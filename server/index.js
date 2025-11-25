import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { clubMission, events, team } from "./data.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (allows client to talk to server)
app.use(express.json()); // Parse JSON bodies in requests

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/info", (_req, res) => {
  res.json({ mission: clubMission });
});

app.get("/api/events", (_req, res) => {
  res.json(events);
});

app.get("/api/team", (_req, res) => {
  res.json(team);
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
