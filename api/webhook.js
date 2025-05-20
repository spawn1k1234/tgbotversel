const { Telegraf } = require("telegraf");
const { connectToDatabase } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработчики команд
bot.start(async (ctx) => {
  try {
    const db = await connectToDatabase();
    await db.collection("users").updateOne(
      { id: ctx.from.id },
      {
        $set: {
          id: ctx.from.id,
          username: ctx.from.username,
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
          date: new Date(),
        },
      },
      { upsert: true }
    );

    return ctx.reply(`Привет, ${ctx.from.first_name}! 👋`, {
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

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Обработка обновления без дублирования ответа
    await bot.handleUpdate(req.body, res);

    // Не отправляем ответ здесь, так как Telegraf уже это делает
  } catch (err) {
    console.error("Webhook error:", err);

    // Проверяем, не были ли уже отправлены заголовки
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
      });
    }
  }
};
