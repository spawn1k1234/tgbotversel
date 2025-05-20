import { Telegraf } from "telegraf";
import dbConnect from "../../lib/db";
import User from "../../models/User";

const bot = new Telegraf(process.env.BOT_TOKEN);

export const config = {
  api: {
    bodyParser: false,
  },
};

// Простой хэндлер для обработки raw запроса с Telegram update
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  await dbConnect();

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    try {
      const update = JSON.parse(data);

      if (update.message && update.message.chat) {
        const chatId = update.message.chat.id;
        const firstName = update.message.from.first_name || "";

        // Сохраняем chatId
        const userExists = await User.findOne({ chatId });
        if (!userExists) {
          await User.create({ chatId });
        }

        if (update.message.text === "/start") {
          // Отвечаем с кнопками
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
      res.status(200).end("ok");
    } catch (err) {
      console.error(err);
      res.status(500).end("error");
    }
  });
}
