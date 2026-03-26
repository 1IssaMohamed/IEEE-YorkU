/**
 * IEEE YorkU Backend Server
 * 
 * Simple Express API serving club data to the React frontend
 * Runs on port 5000 by default
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

import { clubMission, pastEvents, team, sponsors } from "./data.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const YORKU_EMAIL_REGEX = /^[^@\s]+@(my\.)?yorku\.ca$/i;
const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

const inviteMaxAgeFromEnv = Number.parseInt(process.env.DISCORD_INVITE_MAX_AGE ?? "86400", 10);
const discordInviteMaxAge = Number.isFinite(inviteMaxAgeFromEnv) && inviteMaxAgeFromEnv >= 0
  ? inviteMaxAgeFromEnv
  : 86400;

const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
const isSmtpSecure =
  process.env.SMTP_SECURE === "true" ||
  (Number.isFinite(smtpPort) && smtpPort === 465);

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.isFinite(smtpPort) ? smtpPort : 587,
  secure: isSmtpSecure,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
});

let mailTransportVerificationPromise = null;

const ensureMailTransportReady = async () => {
  if (!mailTransportVerificationPromise) {
    mailTransportVerificationPromise = mailTransporter.verify().catch((verificationError) => {
      mailTransportVerificationPromise = null;
      throw verificationError;
    });
  }

  await mailTransportVerificationPromise;
};

// Security middleware
app.use(helmet()); // Adds various HTTP security headers

// Rate limiting - prevent brute force and DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});
app.use("/api", limiter);

const hardwareInviteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many invite requests. Please try again in a few minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.ALLOWED_ORIGIN || true 
    : true,
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse JSON bodies in requests
app.use(express.json({ limit: "10kb" })); // Limit body size

const createSingleUseDiscordInvite = async () => {
  const discordBotToken = process.env.DISCORD_BOT_TOKEN;
  const discordChannelId = process.env.DISCORD_CHANNEL_ID;

  if (!discordBotToken || !discordChannelId) {
    throw new Error("Discord invite generation is not configured.");
  }

  const response = await fetch(
    `${DISCORD_API_BASE_URL}/channels/${discordChannelId}/invites`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${discordBotToken}`
      },
      body: JSON.stringify({
        max_age: discordInviteMaxAge,
        max_uses: 1,
        temporary: false,
        unique: true
      })
    }
  );

  if (!response.ok) {
    let errorDetail = "";

    try {
      const payload = await response.json();
      if (payload && typeof payload.message === "string") {
        errorDetail = payload.message;
      }
    } catch {
      // Intentionally ignored: response may not have a JSON body.
    }

    const suffix = errorDetail ? `: ${errorDetail}` : "";
    throw new Error(`Discord invite request failed (${response.status})${suffix}`);
  }

  const invitePayload = await response.json();
  if (!invitePayload || typeof invitePayload.code !== "string") {
    throw new Error("Discord invite response did not include a valid invite code.");
  }

  return `https://discord.gg/${invitePayload.code}`;
};

// Health check endpoint - useful for monitoring
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get club information (mission statement)
app.get("/api/info", (_req, res) => {
  res.json({ mission: clubMission });
});

// Get all past events with images
app.get("/api/past-events", (_req, res) => {
  res.json(pastEvents);
});

// Get all team members
app.get("/api/team", (_req, res) => {
  res.json(team);
});

// Get all sponsors
app.get("/api/sponsors", (_req, res) => {
  res.json(sponsors);
});

app.post("/api/hardware/request-invite", hardwareInviteLimiter, async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!YORKU_EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "A valid @yorku.ca or @my.yorku.ca email is required." });
  }

  try {
    const senderAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!senderAddress) {
      throw new Error("EMAIL_FROM or SMTP_USER is required for outbound mail.");
    }

    await ensureMailTransportReady();

    const inviteUrl = await createSingleUseDiscordInvite();

    await mailTransporter.sendMail({
      from: senderAddress,
      to: email.toLowerCase(),
      subject: "Your IEEE YorkU Hardware Club Discord Invite",
      text: [
        "Hi,",
        "",
        "Here is your one-time IEEE YorkU Hardware Club Discord invite:",
        inviteUrl,
        "",
        "This invite can only be used once.",
        "",
        "If you did not request this, you can ignore this email.",
        "",
        "- IEEE YorkU"
      ].join("\n"),
      html: `
        <p>Hi,</p>
        <p>Here is your one-time IEEE YorkU Hardware Club Discord invite:</p>
        <p><a href="${inviteUrl}">${inviteUrl}</a></p>
        <p>This invite can only be used once.</p>
        <p>If you did not request this, you can ignore this email.</p>
        <p>- IEEE YorkU</p>
      `
    });

    return res.json({
      message: "Check your @yorku.ca inbox for your one-time Discord invite link."
    });
  } catch (requestError) {
    const safeErrorMessage =
      requestError instanceof Error ? requestError.message : "Unknown invite delivery error.";
    console.error("Failed hardware invite request:", safeErrorMessage);
    return res.status(500).json({ error: "Unable to process your request right now. Please try again later." });
  }
});

// 404 handler - catches all undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
