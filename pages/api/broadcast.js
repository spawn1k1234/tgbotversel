import dbConnect from "../../lib/db";
import User from "../../models/User";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text, photoUrl } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  await dbConnect();

  try {
    const users = await User.find();

    for (const user of users) {
      try {
        if (photoUrl) {
          await bot.telegram.sendPhoto(user.chatId, photoUrl, {
            caption: text,
          });
        } else {
          await bot.telegram.sendMessage(user.chatId, text);
        }
      } catch (e) {
        console.warn(`Failed to send message to ${user.chatId}`, e.message);
      }
    }

    res.status(200).json({ message: "Broadcast sent" });
  } catch (e) {
    console.error("Broadcast error:", e);
    res.status(500).json({ error: "Failed to send broadcast" });
  }
}
