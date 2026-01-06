/**
 * IEEE YorkU Backend Server
 * 
 * Simple Express API serving club data to the React frontend
 * Runs on port 5000 by default
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { clubMission, events, pastEvents, team, sponsors } from "./data.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (allows client to talk to server)
app.use(express.json()); // Parse JSON bodies in requests

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

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
