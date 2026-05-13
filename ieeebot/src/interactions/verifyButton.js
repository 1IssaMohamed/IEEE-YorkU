import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import logger from "../utils/logger.js";

/**
 * Custom ID for the persistent verify button.
 * Must match across deploy and interaction handler.
 */
export const VERIFY_BUTTON_ID = "verify-yorku-email";

/**
 * Builds the persistent verification message with embed + button.
 * Sent once to #verify via the /deploy-verify-button command.
 */
export function buildVerifyMessage() {
  const embed = new EmbedBuilder()
    .setColor(0x00629b) // IEEE blue
    .setTitle("🔒 Verify Your YorkU Email")
    .setDescription(
      "To access all channels in this server, you need to verify that you're a current York University student.\n\n" +
      "**How it works:**\n" +
      "1. Click the button below\n" +
      "2. Enter your `@my.yorku.ca` email address\n" +
      "3. Check your inbox for a 6-digit verification code\n" +
      "4. Enter the code when prompted\n\n" +
      "Once verified, all channels will be unlocked automatically."
    )
    .setFooter({ text: "IEEE YorkU Hardware Club • Only @my.yorku.ca emails accepted" });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(VERIFY_BUTTON_ID)
      .setLabel("Verify YorkU Email")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("✉️")
  );

  return { embeds: [embed], components: [row] };
}

/**
 * Handle the verify button click — show the email input modal.
 * @param {import("discord.js").ButtonInteraction} interaction
 */
export async function handleVerifyButton(interaction) {
  const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = await import("discord.js");

  const modal = new ModalBuilder()
    .setCustomId("email-input-modal")
    .setTitle("Verify YorkU Email");

  const emailInput = new TextInputBuilder()
    .setCustomId("email-address")
    .setLabel("Your @my.yorku.ca email address")
    .setPlaceholder("yourname@my.yorku.ca")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(5)
    .setMaxLength(100);

  modal.addComponents(new ActionRowBuilder().addComponents(emailInput));

  await interaction.showModal(modal);
  logger.debug(`Verify button clicked by ${interaction.user.tag}`);
}
