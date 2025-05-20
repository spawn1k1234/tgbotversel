const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { Telegraf } = require("telegraf");
const { getChatIdsCollection } = require("./db");

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
      const chatIdsColl = await getChatIdsCollection();
      const allChatIds = await chatIdsColl.find({}).toArray();

      for (const doc of allChatIds) {
        try {
          if (photoPath) {
            await bot.telegram.sendPhoto(
              doc.chatId,
              { source: photoPath },
              { caption: text }
            );
          } else {
            await bot.telegram.sendMessage(doc.chatId, text);
          }
        } catch (e) {
          console.error(
            `Ошибка отправки сообщения для ${doc.chatId}:`,
            e.message
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при получении chat_id из БД:", error);
      return res.status(500).send("Ошибка при рассылке");
    }

    res.writeHead(302, { Location: "/api/bot" });
    res.end();
  });
};
