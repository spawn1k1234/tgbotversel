// lib/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const userSchema = new mongoose.Schema({
  chatId: { type: String, unique: true },
  joinedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { connectDB, User };
