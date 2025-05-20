const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is required!");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
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
    res.status(200).send("Telegram bot is running");
  }
};
