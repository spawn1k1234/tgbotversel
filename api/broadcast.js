const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { Telegraf: Bot } = require("telegraf");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const bot = new Bot(process.env.BOT_TOKEN);
  const form = formidable({
    multiples: false,
    uploadDir: path.join(__dirname, "..", "uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Form parsing error");

    const text = fields.text || "";
    const photoPath = files.photo?.filepath;
    const chatIdsPath = path.join(__dirname, "..", "chat_ids.json");

    let chatIds = [];
    try {
      if (fs.existsSync(chatIdsPath)) {
        const data = fs.readFileSync(chatIdsPath, "utf8");
        chatIds = data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error("Ошибка чтения chat_ids в broadcast:", error.message);
    }

    for (const id of chatIds) {
      try {
        if (photoPath) {
          await bot.sendPhoto(id, { source: photoPath }, { caption: text });
        } else {
          await bot.sendMessage(id, text);
        }
      } catch (e) {
        console.error(`Error sending to ${id}:`, e.message);
      }
    }

    res.writeHead(302, { Location: "/api/bot" });
    res.end();
  });
};
