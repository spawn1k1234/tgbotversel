const connectToDatabase = require("./db");
const ChatId = require("./ChatId");
const { Telegraf } = require("telegraf");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required!");

const bot = new Telegraf(BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Разбор формы с файлом
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Ошибка при разборе формы:", err);
      res.status(500).send("Ошибка сервера");
      return;
    }

    const text = fields.text;
    if (!text) {
      res.status(400).send("Текст сообщения обязателен");
      return;
    }

    let photoBuffer = null;
    let photoType = null;

    if (files.photo && files.photo.size > 0) {
      try {
        photoBuffer = fs.readFileSync(files.photo.path);
        photoType = files.photo.type;
      } catch (readErr) {
        console.error("Ошибка чтения файла фото:", readErr);
        res.status(500).send("Ошибка сервера");
        return;
      }
    }

    try {
      await connectToDatabase();

      const chatIds = await ChatId.find({}, { chat_id: 1, _id: 0 });
      if (chatIds.length === 0) {
        res.status(200).send("Нет chat_id для рассылки");
        return;
      }

      // Рассылка
      let successCount = 0;
      let failCount = 0;

      for (const doc of chatIds) {
        try {
          if (photoBuffer) {
            // Если есть фото — сначала отправляем фото с подписью
            await bot.telegram.sendPhoto(
              doc.chat_id,
              { source: photoBuffer },
              { caption: text }
            );
          } else {
            await bot.telegram.sendMessage(doc.chat_id, text);
          }
          successCount++;
        } catch (error) {
          console.error(`Ошибка при отправке chat_id=${doc.chat_id}:`, error);
          failCount++;
        }
      }

      res
        .status(200)
        .send(
          `Рассылка завершена. Успешно: ${successCount}, Ошибок: ${failCount}`
        );
    } catch (error) {
      console.error("Ошибка при рассылке:", error);
      res.status(500).send("Ошибка сервера");
    }
  });
};
