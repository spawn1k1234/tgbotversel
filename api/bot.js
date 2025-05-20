const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required!");

const bot = new Telegraf(BOT_TOKEN);
const chatIdsFile = path.join(__dirname, "..", "chat_ids.json");
let chatIds = fs.existsSync(chatIdsFile)
  ? JSON.parse(fs.readFileSync(chatIdsFile, "utf8"))
  : [];

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  if (!chatIds.includes(chatId)) {
    chatIds.push(chatId);
    fs.writeFileSync(chatIdsFile, JSON.stringify(chatIds));
  }
  return ctx.reply(
    `Привет, ${
      ctx.from.first_name || "друг"
    }! Добро пожаловать в наш интернет-магазин.`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "🛍 Магазин",
          "https://your-mini-app-link.example.com"
        ),
      ],
      [Markup.button.url("📸 Instagram", "https://instagram.com/yourshop")],
      [Markup.button.url("💬 Менеджер", "https://t.me/your_manager")],
    ])
  );
});

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Bot error:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // Панель управления
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <h2>Telegram bot is running</h2>
      <form method="POST" action="/api/broadcast" enctype="multipart/form-data">
        <label>Текст:</label><br/>
        <textarea name="text" rows="4" cols="50"></textarea><br/><br/>
        <label>Фото:</label><br/>
        <input type="file" name="photo" /><br/><br/>
        <button type="submit">Рекламировать</button>
      </form>
      <br/>
      <form method="GET" action="/api/downloadChatIds">
        <button type="submit">📥 Скачать chat_id</button>
      </form>
      <br/>
      <form method="POST" action="/api/uploadChatIds" enctype="multipart/form-data">
        <label>Загрузить файл с chat_id:</label>
        <input type="file" name="file" />
        <button type="submit">📤 Загрузить chat_id</button>
      </form>
    `);
  }
};
