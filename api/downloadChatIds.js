const connectToDatabase = require("./db");
const ChatId = require("./ChatId");

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    const chatIdsDocs = await ChatId.find({}, { _id: 0, __v: 0 });
    const chatIds = chatIdsDocs.map((doc) => doc.chat_id);

    const json = JSON.stringify(chatIds, null, 2);

    res.setHeader("Content-Disposition", "attachment; filename=chat_ids.json");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(json);
  } catch (error) {
    console.error("Ошибка при скачивании chat_id:", error);
    res.status(500).send("Ошибка сервера");
  }
};
