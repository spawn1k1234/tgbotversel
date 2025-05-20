const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SHOP_URL = "https://your-mini-app-link.example.com";
const INSTAGRAM_URL = "https://instagram.com/yourshop";
const MANAGER_URL = "https://t.me/your_manager";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be предоставлен!");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply(
    `Привет, ${
      ctx.from.first_name || "друг"
    }! Добро пожаловать в наш интернет-магазин. Вы можете перейти в наш Mini App, чтобы посмотреть товары.`,
    Markup.inlineKeyboard([
      [Markup.button.url("🛍 Перейти в магазин", SHOP_URL)],
      [Markup.button.url("📸 Instagram", INSTAGRAM_URL)],
      [Markup.button.url("💬 Менеджер", MANAGER_URL)],
    ])
  );
});

// Экспортируем функцию для Vercel
module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await bot.handleUpdate(req.body, res);
      res.status(200).send("OK");
    } else {
      res.status(200).send("Telegram bot endpoint");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
};
