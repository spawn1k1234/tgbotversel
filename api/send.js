const formidable = require("formidable");
const { connectToDatabase } = require("../lib/db");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    try {
      const db = await connectToDatabase();
      const users = await db.collection("users").find({}).toArray();

      const results = await Promise.allSettled(
        users.map((user) => {
          try {
            if (files.photo) {
              return bot.telegram.sendPhoto(
                user.id,
                { source: files.photo.filepath },
                { caption: fields.text }
              );
            }
            return bot.telegram.sendMessage(user.id, fields.text);
          } catch (error) {
            console.error(`Error sending to ${user.id}:`, error.message);
            return null;
          }
        })
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;

      return res.status(200).json({
        message: `Рассылка завершена. Успешно: ${successful}, Ошибок: ${
          users.length - successful
        }`,
      });
    } catch (error) {
      console.error("Broadcast failed:", error);
      return res.status(500).json({
        error: "Broadcast failed",
        details: error.message,
      });
    }
  });
};
