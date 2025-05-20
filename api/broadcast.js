const formidable = require("formidable");
const { Telegraf } = require("telegraf");
const path = require("path");
const fs = require("fs");
const { connect } = require("../db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const bot = new Telegraf(process.env.BOT_TOKEN);
  const form = formidable({
    multiples: false,
    uploadDir: path.join(__dirname, "..", "uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Form parsing error");

    const text = fields.text || "";
    const photoPath = files.photo?.filepath;

    try {
      const db = await connect();
      const chatIdsCollection = db.collection("chat_ids");
      const chatIdsDocs = await chatIdsCollection.find({}).toArray();
      const chatIds = chatIdsDocs.map((doc) => doc.chatId);

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
          console.error(`Ошибка при отправке сообщению ${id}:`, e.message);
        }
      }

      res.writeHead(302, { Location: "/api/bot" });
      res.end();
    } catch (e) {
      console.error("Ошибка при рассылке:", e);
      res.status(500).send("Ошибка при рассылке");
    }
  });
};
