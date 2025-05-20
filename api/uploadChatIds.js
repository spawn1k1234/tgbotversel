const formidable = require("formidable");
const fs = require("fs");
const { getChatIdsCollection } = require("./db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Upload error");

    const filePath = files.file?.filepath;
    if (!filePath) return res.status(400).send("No file uploaded");

    try {
      const data = fs.readFileSync(filePath, "utf8");
      const ids = JSON.parse(data);
      if (!Array.isArray(ids))
        return res.status(400).send("Invalid JSON format");

      const chatIdsColl = await getChatIdsCollection();

      // Очистить коллекцию и загрузить новые chat_id
      await chatIdsColl.deleteMany({});
      const docs = ids.map((chatId) => ({ chatId }));
      await chatIdsColl.insertMany(docs);

      res.writeHead(302, { Location: "/api/bot" });
      res.end();
    } catch (e) {
      console.error("Ошибка загрузки chat_id:", e);
      res.status(400).send("Invalid JSON file");
    }
  });
};
