import "dotenv/config";

/**
 * Validates and exports all environment configuration.
 * Fails fast on startup if required variables are missing.
 */

const required = [
  "DISCORD_BOT_TOKEN",
  "DISCORD_GUILD_ID",
  "VERIFY_CHANNEL_ID",
  "VERIFIED_ROLE_ID",
  "AZURE_ACS_CONNECTION_STRING",
  "EMAIL_FROM",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n${missing.map((k) => `   - ${k}`).join("\n")}`);
  console.error("\nCopy .env.example to .env and fill in the values.");
  process.exit(1);
}

const config = Object.freeze({
  // Discord
  botToken: process.env.DISCORD_BOT_TOKEN,
  guildId: process.env.DISCORD_GUILD_ID,
  verifyChannelId: process.env.VERIFY_CHANNEL_ID,
  verifiedRoleId: process.env.VERIFIED_ROLE_ID,

  // Azure Communication Services Email
  acsConnectionString: process.env.AZURE_ACS_CONNECTION_STRING,
  emailFrom: process.env.EMAIL_FROM,

  // OTP settings (with defaults)
  otpExpiryMs: parseInt(process.env.OTP_EXPIRY_MS, 10) || 900_000,        // 15 minutes
  otpMaxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS, 10) || 3,
  otpCooldownMs: parseInt(process.env.OTP_COOLDOWN_MS, 10) || 60_000,     // 60 seconds
  otpMaxRequestsPerWindow: parseInt(process.env.OTP_MAX_REQUESTS_PER_WINDOW, 10) || 5,
});

export default config;
