const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const { BOT_TOKEN, SHOP_URL, INSTAGRAM_URL, MANAGER_URL } = require("./config");

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || "your-vercel-domain.vercel.app"; // поменяй на свой домен в Vercel

// Обработка команды /start
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

// Вебхук для Vercel
app.use(express.json());

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot
    .handleUpdate(req.body, res)
    .then(() => res.status(200).send("OK"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error");
    });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Настройка webhook
  bot.telegram
    .setWebhook(`https://${DOMAIN}/bot${BOT_TOKEN}`)
    .then(() => console.log("Webhook установлен"))
    .catch(console.error);
});
