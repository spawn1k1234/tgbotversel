const mongoose = require("mongoose");

const ChatIdSchema = new mongoose.Schema({
  chat_id: { type: Number, unique: true, required: true },
});

module.exports =
  mongoose.models.ChatId || mongoose.model("ChatId", ChatIdSchema);
