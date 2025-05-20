const formidable = require("formidable");
const connectToDatabase = require("./db");
const ChatId = require("./ChatId");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Ошибка загрузки файла");

    const filePath = files.file?.filepath;
    if (!filePath) return res.status(400).send("Файл не загружен");

    try {
      const data = fs.readFileSync(filePath, "utf8");
      const ids = JSON.parse(data);
      if (!Array.isArray(ids))
        return res.status(400).send("Неверный формат JSON");

      await connectToDatabase();

      // Очистим старые chat_id (по желанию, можно изменить логику)
      await ChatId.deleteMany({});

      // Вставим новые chat_id с уникальностью
      const uniqueIds = [...new Set(ids)];
      const docs = uniqueIds.map((chat_id) => ({ chat_id }));
      await ChatId.insertMany(docs);

      res.writeHead(302, { Location: "/api/bot" });
      res.end();
    } catch (e) {
      console.error("Ошибка обработки файла:", e);
      res.status(400).send("Ошибка обработки файла");
    }
  });
};
