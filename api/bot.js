const { Telegraf, Markup } = require("telegraf");
const { connect } = require("../db");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required!");

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  try {
    const db = await connect();
    const chatIdsCollection = db.collection("chat_ids");

    const chatId = ctx.chat.id;

    const exists = await chatIdsCollection.findOne({ chatId });
    if (!exists) {
      await chatIdsCollection.insertOne({ chatId });
      console.log(`✅ Новый chat_id сохранён в базе: ${chatId}`);
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
  } catch (error) {
    console.error("Ошибка в start handler:", error);
    return ctx.reply("Произошла ошибка, попробуйте позже.");
  }
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
    // Панель управления, оставляем как есть
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <!DOCTYPE html>
      <html lang="ru">
      <head><meta charset="UTF-8" /><title>Панель бота</title></head>
      <body>
        <h2>Telegram bot is running</h2>
        <form method="POST" action="/api/broadcast" enctype="multipart/form-data">
          <label>Текст:</label><br/>
          <textarea name="text" rows="4" cols="50"></textarea><br/><br/>
          <label>Фото:</label><br/>
          <input type="file" name="photo" /><br/><br/>
          <button type="submit">📢 Рекламировать</button>
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
      </body>
      </html>
    `);
  }
};
