const { Telegraf } = require("telegraf");
const { saveUser } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Включаем логирование
bot.use((ctx, next) => {
  console.log("Update:", JSON.stringify(ctx.update, null, 2));
  return next();
});

// Обработка команд
bot.start(async (ctx) => {
  try {
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
  } catch (err) {
    console.error("Start command error:", err);
  }
});

// Обработчик для Vercel
module.exports = async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    // Для Vercel нужно парсить тело запроса
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ error: "Empty request body" });
    }

    // Обрабатываем обновление
    await bot.handleUpdate(body);

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};
