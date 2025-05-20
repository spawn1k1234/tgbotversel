const { Telegraf, Markup } = require("telegraf");
const connectToDatabase = require("./db");
const ChatId = require("./ChatId");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required!");

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  try {
    await connectToDatabase();

    // Сохраняем chat_id если ещё нет
    await ChatId.updateOne(
      { chat_id: chatId },
      { chat_id: chatId },
      { upsert: true }
    );

    console.log(`Saved chat_id: ${chatId}`);

    return ctx.reply(
      `Привет, ${ctx.from.first_name || "друг"}! Добро пожаловать.`,
      Markup.inlineKeyboard([
        [Markup.button.url("🛍 Магазин", "https://your-shop-link.example.com")],
        [Markup.button.url("📸 Instagram", "https://instagram.com/yourshop")],
        [Markup.button.url("💬 Менеджер", "https://t.me/your_manager")],
      ])
    );
  } catch (error) {
    console.error("Ошибка сохранения chat_id:", error);
    return ctx.reply("Произошла ошибка, попробуйте позже.");
  }
});

module.exports = async (req, res) => {
  if (req.method === "POST") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Empty request body");
    }
    try {
      await bot.handleUpdate(req.body, res);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Bot error:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
