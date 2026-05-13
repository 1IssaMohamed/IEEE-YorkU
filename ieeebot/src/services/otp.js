import { randomInt } from "node:crypto";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

/**
 * In-memory OTP store.
 * Map<discordUserId, { otp, email, attempts, createdAt, expiresAt, timerId }>
 */
const otpStore = new Map();

/**
 * Rate limit / cooldown store.
 * Map<discordUserId, { lastRequest, requestCount, windowStart }>
 */
const cooldownStore = new Map();

/**
 * Generate a cryptographically secure 6-digit OTP.
 * @returns {string} 6-digit code as a string (preserves leading zeros)
 */
function generateOtp() {
  return String(randomInt(100000, 999999));
}

/**
 * Check if a user is rate-limited from requesting a new OTP.
 * @param {string} userId
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function checkCooldown(userId) {
  const now = Date.now();
  const entry = cooldownStore.get(userId);

  if (!entry) {
    return { allowed: true };
  }

  // Check per-request cooldown (60s between requests)
  const timeSinceLastRequest = now - entry.lastRequest;
  if (timeSinceLastRequest < config.otpCooldownMs) {
    const remainingSeconds = Math.ceil((config.otpCooldownMs - timeSinceLastRequest) / 1000);
    return {
      allowed: false,
      reason: `Please wait ${remainingSeconds} seconds before requesting another code.`,
    };
  }

  // Check rate limit window (max requests per 15-minute window)
  const windowMs = 15 * 60 * 1000;
  if (now - entry.windowStart > windowMs) {
    // Window has reset — clear the counter
    cooldownStore.delete(userId);
    return { allowed: true };
  }

  if (entry.requestCount >= config.otpMaxRequestsPerWindow) {
    return {
      allowed: false,
      reason: "Too many verification requests. Please try again in 15 minutes.",
    };
  }

  return { allowed: true };
}

/**
 * Create and store an OTP for a user.
 * @param {string} userId — Discord user ID
 * @param {string} email — verified email address
 * @returns {string} the generated OTP code
 */
export function createOtp(userId, email) {
  // Clear any existing OTP for this user
  clearOtp(userId);

  const otp = generateOtp();
  const now = Date.now();

  // Set auto-expiry timer
  const timerId = setTimeout(() => {
    otpStore.delete(userId);
    logger.debug(`OTP expired for user ${userId}`);
  }, config.otpExpiryMs);

  otpStore.set(userId, {
    otp,
    email: email.toLowerCase(),
    attempts: 0,
    createdAt: now,
    expiresAt: now + config.otpExpiryMs,
    timerId,
  });

  // Update cooldown tracking
  const cooldown = cooldownStore.get(userId);
  if (cooldown && now - cooldown.windowStart < 15 * 60 * 1000) {
    cooldown.lastRequest = now;
    cooldown.requestCount += 1;
  } else {
    cooldownStore.set(userId, {
      lastRequest: now,
      requestCount: 1,
      windowStart: now,
    });
  }

  logger.info(`OTP created for user ${userId} → ${email}`);
  return otp;
}

/**
 * Verify an OTP submitted by a user.
 * @param {string} userId
 * @param {string} submittedCode
 * @returns {{ success: boolean, email?: string, error?: string }}
 */
export function verifyOtp(userId, submittedCode) {
  const entry = otpStore.get(userId);

  if (!entry) {
    return { success: false, error: "No pending verification found. Please request a new code." };
  }

  // Check expiry
  if (Date.now() > entry.expiresAt) {
    clearOtp(userId);
    return { success: false, error: "Your code has expired. Please request a new one." };
  }

  // Check attempt limit
  if (entry.attempts >= config.otpMaxAttempts) {
    clearOtp(userId);
    return {
      success: false,
      error: "Too many incorrect attempts. Please request a new code.",
    };
  }

  // Compare codes
  if (submittedCode.trim() !== entry.otp) {
    entry.attempts += 1;
    const remaining = config.otpMaxAttempts - entry.attempts;

    if (remaining <= 0) {
      clearOtp(userId);
      return {
        success: false,
        error: "Too many incorrect attempts. Please request a new code.",
      };
    }

    return {
      success: false,
      error: `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // Success — grab the email before clearing
  const { email } = entry;
  clearOtp(userId);

  return { success: true, email };
}

/**
 * Check if a user has a pending OTP.
 * @param {string} userId
 * @returns {boolean}
 */
export function hasPendingOtp(userId) {
  return otpStore.has(userId);
}

/**
 * Clear a user's OTP entry and its expiry timer.
 * @param {string} userId
 */
export function clearOtp(userId) {
  const entry = otpStore.get(userId);
  if (entry?.timerId) {
    clearTimeout(entry.timerId);
  }
  otpStore.delete(userId);
}

/**
 * Get the count of currently pending OTPs (for /stats command).
 * @returns {number}
 */
export function getPendingCount() {
  return otpStore.size;
}
