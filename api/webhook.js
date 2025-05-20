const { Telegraf } = require("telegraf");
const { saveUser } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда /start
bot.start(async (ctx) => {
  const user = {
    id: ctx.from.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
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

// Обработчик вебхука
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Проверяем, есть ли тело запроса
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("Пустое тело запроса");
      return res.status(400).json({ error: "Empty request body" });
    }

    // Обрабатываем обновление от Telegram
    await bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error("Ошибка в вебхуке:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
