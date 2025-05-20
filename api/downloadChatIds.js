const { getChatIdsCollection } = require("./db");

module.exports = async (req, res) => {
  try {
    const chatIdsColl = await getChatIdsCollection();
    const allChatIds = await chatIdsColl.find({}).toArray();

    const ids = allChatIds.map((doc) => doc.chatId);

    res.setHeader("Content-Disposition", "attachment; filename=chat_ids.json");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(ids, null, 2));
  } catch (error) {
    console.error("Ошибка при скачивании chat_id:", error);
    res.status(500).send("Ошибка сервера");
  }
};
