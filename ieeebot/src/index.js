import { Client, GatewayIntentBits } from "discord.js";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import { onReady } from "./events/ready.js";
import { onInteractionCreate } from "./events/interactionCreate.js";

/**
 * IEEE YorkU Hardware Club — Discord Verification Bot
 *
 * Verifies student membership via @my.yorku.ca email OTP.
 * Assigns @Verified role on successful verification.
 *
 * Flow: Button → Email Modal → OTP Email → Code Modal → Role Assignment
 */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Register event handlers
client.once("ready", () => onReady(client));
client.on("interactionCreate", onInteractionCreate);

// Global error handlers — prevent crashes from killing the bot
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled promise rejection:", err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
  // Give PM2 a chance to restart cleanly
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT — shutting down gracefully");
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM — shutting down gracefully");
  client.destroy();
  process.exit(0);
});

// Login
client.login(config.botToken)
  .then(() => logger.info("Login initiated..."))
  .catch((err) => {
    logger.error("Failed to login:", err.message);
    process.exit(1);
  });
