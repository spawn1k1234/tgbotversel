const { Telegraf } = require("telegraf");
const { saveUser } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработка команды /start
bot.start(async (ctx) => {
  const user = {
    id: ctx.from.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
    language_code: ctx.from.language_code,
    is_bot: ctx.from.is_bot,
    date: new Date(),
  };

  await saveUser(user);

  await ctx.reply(`Привет, ${ctx.from.first_name}! 👋`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📸 Instagram", url: "https://instagram.com" },
          { text: "👨‍💼 Менеджер", url: "https://t.me/manager" },
        ],
      ],
    },
  });
});

// Обработка обычных сообщений
bot.on("message", async (ctx) => {
  await ctx.reply("Используйте кнопки ниже для связи:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📸 Instagram", url: "https://instagram.com" },
          { text: "👨‍💼 Менеджер", url: "https://t.me/manager" },
        ],
      ],
    },
  });
});

// Обработчик вебхука
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
    } catch (err) {
      console.error("Error handling update:", err);
      res.status(500).send("Error handling update");
    }
  } else {
    res.status(200).send("Use POST");
  }
};
