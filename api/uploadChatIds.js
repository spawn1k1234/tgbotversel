const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send("Upload error");

    const filePath = files.file?.filepath;
    if (!filePath) return res.status(400).send("No file uploaded");

    const data = fs.readFileSync(filePath, "utf8");
    try {
      const ids = JSON.parse(data);
      if (!Array.isArray(ids))
        return res.status(400).send("Invalid JSON format");

      fs.writeFileSync(
        path.join(__dirname, "..", "chat_ids.json"),
        JSON.stringify(ids, null, 2)
      );
      res.writeHead(302, { Location: "/api/bot" });
      res.end();
    } catch (e) {
      res.status(400).send("Invalid JSON file");
    }
  });
};
