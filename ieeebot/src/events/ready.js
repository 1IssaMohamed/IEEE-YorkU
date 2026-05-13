import { REST, Routes } from "discord.js";
import { initDatabase } from "../services/database.js";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

// Import all command definitions
import * as deployButton from "../commands/deployButton.js";
import * as stats from "../commands/stats.js";
import * as lookup from "../commands/lookup.js";
import * as unverify from "../commands/unverify.js";

const commands = [deployButton, stats, lookup, unverify];

/**
 * Called when the bot is logged in and ready.
 * Registers slash commands and initializes the database.
 *
 * @param {import("discord.js").Client} client
 */
export async function onReady(client) {
  logger.info(`Logged in as ${client.user.tag}`);

  // Initialize the SQLite database
  initDatabase();

  // Register slash commands with Discord API
  const rest = new REST({ version: "10" }).setToken(config.botToken);
  const commandData = commands.map((cmd) => cmd.data.toJSON());

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, config.guildId),
      { body: commandData }
    );
    logger.info(`Registered ${commandData.length} slash commands`);
  } catch (err) {
    logger.error("Failed to register slash commands:", err.message);
  }

  // Store commands on client for lookup in interaction handler
  client.commands = new Map();
  for (const cmd of commands) {
    client.commands.set(cmd.data.name, cmd);
  }

  logger.info("Bot is ready and waiting for interactions");
}
