import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStats } from "../services/database.js";
import { getPendingCount } from "../services/otp.js";

export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Show verification statistics")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  const stats = getStats();
  const pending = getPendingCount();

  const embed = new EmbedBuilder()
    .setColor(0x00629b)
    .setTitle("📊 Verification Statistics")
    .addFields(
      { name: "Total Verified", value: String(stats.total), inline: true },
      { name: "Last 24h", value: String(stats.today), inline: true },
      { name: "Last 7 Days", value: String(stats.thisWeek), inline: true },
      { name: "Pending OTPs", value: String(pending), inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
