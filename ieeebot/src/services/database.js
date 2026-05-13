import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "..", "data", "verified_users.db");

// Ensure data directory exists
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

/**
 * Initialize database schema.
 * Called once on bot startup.
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS verified_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      discord_username TEXT,
      verified_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_email ON verified_users(email);
    CREATE INDEX IF NOT EXISTS idx_discord_id ON verified_users(discord_id);
  `);

  const count = db.prepare("SELECT COUNT(*) as count FROM verified_users").get();
  logger.info(`Database initialized — ${count.count} verified users on record`);
}

/**
 * Check if an email is already claimed by any Discord account.
 * @param {string} email
 * @returns {{ discord_id: string, discord_username: string } | undefined}
 */
export function findByEmail(email) {
  return db.prepare("SELECT discord_id, discord_username, verified_at FROM verified_users WHERE email = ?").get(email.toLowerCase());
}

/**
 * Check if a Discord user already has a verified email.
 * @param {string} discordId
 * @returns {{ email: string } | undefined}
 */
export function findByDiscordId(discordId) {
  return db.prepare("SELECT email, verified_at FROM verified_users WHERE discord_id = ?").get(discordId);
}

/**
 * Insert a verified user record.
 * @param {string} discordId
 * @param {string} email
 * @param {string} discordUsername
 */
export function insertVerifiedUser(discordId, email, discordUsername) {
  const stmt = db.prepare(
    "INSERT INTO verified_users (discord_id, email, discord_username) VALUES (?, ?, ?)"
  );
  stmt.run(discordId, email.toLowerCase(), discordUsername);
  logger.info(`Verified: ${discordUsername} (${discordId}) → ${email}`);
}

/**
 * Remove a verified user record.
 * @param {string} discordId
 * @returns {boolean} true if a record was deleted
 */
export function removeVerifiedUser(discordId) {
  const result = db.prepare("DELETE FROM verified_users WHERE discord_id = ?").run(discordId);
  return result.changes > 0;
}

/**
 * Get verification statistics.
 * @returns {{ total: number, today: number, thisWeek: number }}
 */
export function getStats() {
  const total = db.prepare("SELECT COUNT(*) as count FROM verified_users").get().count;
  const today = db.prepare(
    "SELECT COUNT(*) as count FROM verified_users WHERE verified_at >= datetime('now', '-1 day')"
  ).get().count;
  const thisWeek = db.prepare(
    "SELECT COUNT(*) as count FROM verified_users WHERE verified_at >= datetime('now', '-7 days')"
  ).get().count;

  return { total, today, thisWeek };
}

/**
 * Look up a user by email or Discord ID.
 * @param {string} query — email address or Discord ID
 * @returns {object | undefined}
 */
export function lookupUser(query) {
  // Try by email first
  const byEmail = db.prepare(
    "SELECT discord_id, email, discord_username, verified_at FROM verified_users WHERE email = ?"
  ).get(query.toLowerCase());
  if (byEmail) return byEmail;

  // Try by Discord ID
  return db.prepare(
    "SELECT discord_id, email, discord_username, verified_at FROM verified_users WHERE discord_id = ?"
  ).get(query);
}

export default db;
