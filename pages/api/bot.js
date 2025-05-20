import { Telegraf } from "telegraf";
import dbConnect from "../../lib/db";
import User from "../../models/User";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Отключаем bodyParser для ручной обработки webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    try {
      const update = JSON.parse(data);

      await dbConnect();

      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id;
        const firstName = update.message.from.first_name || "Друг";

        // Сохраняем chatId, если ещё нет
        const user = await User.findOne({ chatId });
        if (!user) {
          await User.create({ chatId });
        }

        // Обработка команды /start
        if (
          update.message.text &&
          update.message.text.toLowerCase() === "/start"
        ) {
          await bot.telegram.sendMessage(
            chatId,
            `Привет, ${firstName}! Выбери кнопку:`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Instagram",
                      url: "https://instagram.com/your_instagram",
                    },
                  ],
                  [{ text: "Менеджер", url: "https://t.me/your_manager" }],
                ],
              },
            }
          );
        } else {
          await bot.telegram.sendMessage(chatId, "Нажми /start для начала");
        }
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error in webhook:", error);
      res.status(400).send("Invalid request");
    }
  });
}
