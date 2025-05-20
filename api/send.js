const { Telegraf } = require("telegraf");
const formidable = require("formidable");
const { getAllUsers } = require("../lib/db");

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).send("Error parsing form");
      return;
    }

    const { text } = fields;
    const photo = files.photo;

    try {
      const users = await getAllUsers();

      for (const user of users) {
        try {
          if (photo) {
            await bot.telegram.sendPhoto(
              user.id,
              { source: photo.filepath },
              { caption: text }
            );
          } else {
            await bot.telegram.sendMessage(user.id, text);
          }
        } catch (error) {
          console.error(
            `Error sending message to user ${user.id}:`,
            error.message
          );
        }
      }

      res.status(200).send("Рассылка успешно отправлена!");
    } catch (error) {
      console.error("Error during broadcast:", error);
      res.status(500).send("Ошибка при рассылке");
    }
  });
};
