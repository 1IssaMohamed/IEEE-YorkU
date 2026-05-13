import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import logger from "../utils/logger.js";

/**
 * Handle the "Enter Code" button click — show the OTP input modal.
 * @param {import("discord.js").ButtonInteraction} interaction
 */
export async function handleOtpButton(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("otp-input-modal")
    .setTitle("Enter Verification Code");

  const codeInput = new TextInputBuilder()
    .setCustomId("otp-code")
    .setLabel("6-digit verification code")
    .setPlaceholder("123456")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(6)
    .setMaxLength(6);

  modal.addComponents(new ActionRowBuilder().addComponents(codeInput));

  await interaction.showModal(modal);
  logger.debug(`OTP entry button clicked by ${interaction.user.tag}`);
}
