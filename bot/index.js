// bot/index.js
const { Telegraf, Markup } = require("telegraf");
const { connectDB, User } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await connectDB();

  const chatId = ctx.chat.id.toString();
  await User.updateOne({ chatId }, { chatId }, { upsert: true });

  await ctx.reply(
    `Привет, ${ctx.from.first_name || "друг"}! 👋\n\nВот полезные ссылки:`,
    Markup.inlineKeyboard([
      [Markup.button.url("📸 Instagram", "https://instagram.com")],
      [
        Markup.button.url(
          "💬 Написать менеджеру",
          "https://t.me/manager_username"
        ),
      ],
    ])
  );
});

module.exports = bot;
