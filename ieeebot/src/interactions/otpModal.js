import { verifyOtp } from "../services/otp.js";
import { insertVerifiedUser } from "../services/database.js";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

/**
 * Handle the OTP modal submission.
 * Verifies the code → assigns @Verified role → persists to DB.
 *
 * @param {import("discord.js").ModalSubmitInteraction} interaction
 */
export async function handleOtpModal(interaction) {
  const submittedCode = interaction.fields.getTextInputValue("otp-code").trim();
  const userId = interaction.user.id;

  // Verify the OTP
  const result = verifyOtp(userId, submittedCode);

  if (!result.success) {
    await interaction.reply({
      content: `❌ ${result.error}`,
      ephemeral: true,
    });
    return;
  }

  // OTP verified — assign the role
  await interaction.deferReply({ ephemeral: true });

  try {
    const guild = interaction.guild;
    const member = await guild.members.fetch(userId);

    // Assign the verified role
    await member.roles.add(config.verifiedRoleId);

    // Persist to database
    insertVerifiedUser(userId, result.email, interaction.user.tag);

    await interaction.editReply({
      content:
        `✅ **You're verified!**\n\n` +
        `Welcome to the IEEE YorkU Hardware Club, **${interaction.user.displayName}**! 🎉\n\n` +
        `All channels are now unlocked. See you around!`,
    });

    logger.info(`User ${interaction.user.tag} verified with ${result.email}`);
  } catch (err) {
    logger.error(`Failed to assign role to ${interaction.user.tag}:`, err.message);

    await interaction.editReply({
      content:
        "❌ **Verification succeeded but role assignment failed.**\n\n" +
        "Your code was correct. Please contact an admin to manually assign your role.",
    });
  }
}
