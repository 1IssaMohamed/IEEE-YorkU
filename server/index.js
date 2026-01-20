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

import { clubMission, events, pastEvents, team, sponsors } from "./data.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check endpoint - useful for monitoring
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get club information (mission statement)
app.get("/api/info", (_req, res) => {
  res.json({ mission: clubMission });
});

// Get all events with images
app.get("/api/events", (_req, res) => {
  res.json(events);
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
