import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { removeVerifiedUser, findByDiscordId } from "../services/database.js";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

export const data = new SlashCommandBuilder()
  .setName("unverify")
  .setDescription("Remove verification from a user (revoke role and delete DB record)")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to unverify")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  const targetUser = interaction.options.getUser("user", true);

  // Check if user has a verification record
  const record = findByDiscordId(targetUser.id);
  if (!record) {
    await interaction.reply({
      content: `❌ **${targetUser.tag}** has no verification record.`,
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    // Remove the verified role
    const member = await interaction.guild.members.fetch(targetUser.id);
    await member.roles.remove(config.verifiedRoleId);
  } catch {
    // User may have left the server — continue with DB cleanup
    logger.warn(`Could not remove role from ${targetUser.tag} (may have left the server)`);
  }

  // Remove from database
  const deleted = removeVerifiedUser(targetUser.id);

  if (deleted) {
    await interaction.editReply({
      content: `✅ **${targetUser.tag}** has been unverified.\n\n• Role removed\n• Email \`${record.email}\` freed for re-use`,
    });
    logger.info(`User ${targetUser.tag} unverified by ${interaction.user.tag}`);
  } else {
    await interaction.editReply({
      content: `⚠️ Database record not found (may have been already removed). Role removal attempted.`,
    });
  }
}
