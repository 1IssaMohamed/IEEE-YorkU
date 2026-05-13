import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { lookupUser } from "../services/database.js";

export const data = new SlashCommandBuilder()
  .setName("lookup")
  .setDescription("Look up a verified user by email or Discord ID")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Email address or Discord user ID")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
  const query = interaction.options.getString("query", true).trim();
  const user = lookupUser(query);

  if (!user) {
    await interaction.reply({
      content: `❌ No verified user found for \`${query}\`.`,
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x00629b)
    .setTitle("🔍 User Lookup")
    .addFields(
      { name: "Discord ID", value: user.discord_id, inline: true },
      { name: "Username", value: user.discord_username || "Unknown", inline: true },
      { name: "Email", value: user.email, inline: false },
      { name: "Verified At", value: user.verified_at, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
