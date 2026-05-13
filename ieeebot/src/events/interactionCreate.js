import { VERIFY_BUTTON_ID, handleVerifyButton } from "../interactions/verifyButton.js";
import { handleEmailModal } from "../interactions/emailModal.js";
import { handleOtpButton } from "../interactions/otpButton.js";
import { handleOtpModal } from "../interactions/otpModal.js";
import logger from "../utils/logger.js";

/**
 * Central interaction router.
 * Routes all button clicks, modal submissions, and slash commands
 * to their respective handlers.
 *
 * @param {import("discord.js").Interaction} interaction
 */
export async function onInteractionCreate(interaction) {
  try {
    // ── Slash Commands ──
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands?.get(interaction.commandName);
      if (command) {
        await command.execute(interaction);
      }
      return;
    }

    // ── Button Interactions ──
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case VERIFY_BUTTON_ID:
          await handleVerifyButton(interaction);
          break;
        case "otp-enter-code":
          await handleOtpButton(interaction);
          break;
        default:
          logger.debug(`Unhandled button: ${interaction.customId}`);
      }
      return;
    }

    // ── Modal Submissions ──
    if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case "email-input-modal":
          await handleEmailModal(interaction);
          break;
        case "otp-input-modal":
          await handleOtpModal(interaction);
          break;
        default:
          logger.debug(`Unhandled modal: ${interaction.customId}`);
      }
      return;
    }
  } catch (err) {
    logger.error(`Interaction error (${interaction.type}):`, err);

    // Try to respond with an error message if we haven't already
    const errorMessage = "❌ Something went wrong. Please try again or contact an admin.";
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    } catch {
      // Can't reply — interaction may have timed out
    }
  }
}
