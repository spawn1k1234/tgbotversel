// api/bot.js
const express = require("express");
const { config } = require("dotenv");
config();

const bot = require("../bot/index");

const app = express();

app.use(express.json());

app.post("/api/bot", (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Vercel SSR-compatible export
module.exports = app;
