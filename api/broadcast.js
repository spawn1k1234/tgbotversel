const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { Telegraf } = require("telegraf");
const connectToDatabase = require("./db");
const ChatId = require("./ChatId");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({
    multiples: false,
    uploadDir: path.join(__dirname, "..", "uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Form parsing error");

    const text = fields.text || "";
    const photoPath = files.photo?.filepath;
    const bot = new Telegraf(process.env.BOT_TOKEN);

    try {
      await connectToDatabase();
      const chatIdsDocs = await ChatId.find({});
      const chatIds = chatIdsDocs.map((doc) => doc.chat_id);

      for (const id of chatIds) {
        try {
          if (photoPath) {
            await bot.telegram.sendPhoto(
              id,
              { source: photoPath },
              { caption: text }
            );
          } else {
            await bot.telegram.sendMessage(id, text);
          }
        } catch (e) {
          console.error(`Ошибка отправки пользователю ${id}:`, e.message);
        }
      }
    } catch (error) {
      console.error("Ошибка рассылки:", error);
      return res.status(500).send("Ошибка рассылки");
    }

    res.writeHead(302, { Location: "/api/bot" });
    res.end();
  });
};
