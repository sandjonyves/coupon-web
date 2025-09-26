// app.js
const express = require("express");
const cors = require("cors");

// Services (mock si nécessaire)
const { registerDeviceToken, sendToSingleDevice, sendToAllDevices } = require("./services/pushService");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006'
  ],
  credentials: true,
}));

// ================= Routes =================

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server OK" });
});

// Register device token
app.post("/api/register-token", (req, res) => {
  const { token } = req.body;
  const success = registerDeviceToken(token);

  if (success) {
    return res.status(200).json({ message: "Jeton enregistré avec succès" });
  } else {
    return res.status(400).json({ error: "Jeton invalide ou déjà enregistré" });
  }
});

// Send notification to single device
app.post("/api/send-notification", async (req, res) => {
  const { token, title, body, data } = req.body;
  try {
    const result = await sendToSingleDevice(token, title, body, data);
    if (result.success) {
      return res.status(200).json({ message: "Notification envoyée", result });
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Send notification to all devices
app.post("/api/send-notification-all", async (req, res) => {
  const { title, body, data } = req.body;
  try {
    const result = await sendToAllDevices(title, body, data);
    return res.status(200).json({
      message: "Notifications envoyées",
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = app;
