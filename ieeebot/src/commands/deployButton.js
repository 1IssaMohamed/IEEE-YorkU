import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { buildVerifyMessage } from "../interactions/verifyButton.js";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

export const data = new SlashCommandBuilder()
  .setName("deploy-verify-button")
  .setDescription("Post the verification embed and button to the #verify channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  const channel = await interaction.guild.channels.fetch(config.verifyChannelId);

  if (!channel || !channel.isTextBased()) {
    await interaction.reply({
      content: `❌ Could not find the verify channel. Check \`VERIFY_CHANNEL_ID\` in your .env.`,
      ephemeral: true,
    });
    return;
  }

  const message = buildVerifyMessage();
  await channel.send(message);

  await interaction.reply({
    content: `✅ Verification message deployed to <#${config.verifyChannelId}>.`,
    ephemeral: true,
  });

  logger.info(`Verify button deployed by ${interaction.user.tag} to #${channel.name}`);
}
