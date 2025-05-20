const formidable = require("formidable");
const { connectToDatabase } = require("../lib/db");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form error:", err);
      return res.status(500).send("Form error");
    }

    try {
      const db = await connectToDatabase();
      const users = await db.collection("users").find({}).toArray();

      for (const user of users) {
        try {
          if (files.photo) {
            await bot.telegram.sendPhoto(
              user.id,
              { source: files.photo.filepath },
              { caption: fields.text }
            );
          } else {
            await bot.telegram.sendMessage(user.id, fields.text);
          }
        } catch (error) {
          console.error(`Error sending to ${user.id}:`, error.message);
        }
      }

      res.status(200).send("Рассылка отправлена!");
    } catch (error) {
      console.error("Broadcast error:", error);
      res.status(500).send("Ошибка рассылки");
    }
  });
};
