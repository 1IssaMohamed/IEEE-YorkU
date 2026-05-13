import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { findByEmail, findByDiscordId } from "../services/database.js";
import { checkCooldown, createOtp } from "../services/otp.js";
import { sendVerificationEmail } from "../services/email.js";
import logger from "../utils/logger.js";

/**
 * Strict regex for @my.yorku.ca student emails only.
 * Case-insensitive. Rejects @yorku.ca (faculty/staff).
 */
const EMAIL_REGEX = /^[^@\s]+@my\.yorku\.ca$/i;

/**
 * Handle the email modal submission.
 * Validates email → checks DB → checks cooldown → sends OTP.
 *
 * @param {import("discord.js").ModalSubmitInteraction} interaction
 */
export async function handleEmailModal(interaction) {
  const email = interaction.fields.getTextInputValue("email-address").trim().toLowerCase();
  const userId = interaction.user.id;

  // 1. Validate email domain
  if (!EMAIL_REGEX.test(email)) {
    await interaction.reply({
      content: "❌ **Invalid email.** Only `@my.yorku.ca` student emails are accepted.\n\nExample: `yourname@my.yorku.ca`",
      ephemeral: true,
    });
    return;
  }

  // 2. Check if this Discord account is already verified
  const existingUser = findByDiscordId(userId);
  if (existingUser) {
    await interaction.reply({
      content: `✅ **You're already verified** with \`${existingUser.email}\`.\n\nIf you need to change your email, contact an admin.`,
      ephemeral: true,
    });
    return;
  }

  // 3. Check if this email is already claimed by another account
  const existingEmail = findByEmail(email);
  if (existingEmail) {
    await interaction.reply({
      content: "❌ **This email is already verified** with another Discord account.\n\nIf you believe this is an error, contact an admin.",
      ephemeral: true,
    });
    return;
  }

  // 4. Check rate limits / cooldown
  const cooldownCheck = checkCooldown(userId);
  if (!cooldownCheck.allowed) {
    await interaction.reply({
      content: `⏳ ${cooldownCheck.reason}`,
      ephemeral: true,
    });
    return;
  }

  // 5. Generate OTP and send email
  await interaction.deferReply({ ephemeral: true });

  const otp = createOtp(userId, email);
  const sent = await sendVerificationEmail(email, otp);

  if (!sent) {
    await interaction.editReply({
      content: "❌ **Failed to send verification email.** Please try again in a few minutes.\n\nIf the problem persists, contact an admin.",
    });
    logger.error(`Failed to send OTP email to ${email} for user ${interaction.user.tag}`);
    return;
  }

  // 6. Show success message with "Enter Code" button
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("otp-enter-code")
      .setLabel("Enter Code")
      .setStyle(ButtonStyle.Success)
      .setEmoji("🔑")
  );

  await interaction.editReply({
    content:
      `📧 **Verification code sent!**\n\n` +
      `Check your inbox at \`${email}\` (including junk/spam).\n\n` +
      `The code expires in **15 minutes**. Click the button below to enter it.`,
    components: [row],
  });

  logger.info(`OTP sent to ${email} for user ${interaction.user.tag}`);
}
