module.exports = async (req, res) => {
  const filePath = path.join(__dirname, "..", "chat_ids.json");
  if (!fs.existsSync(filePath))
    return res.status(404).send("No chat_ids found");

  const content = fs.readFileSync(filePath);
  res.setHeader("Content-Disposition", "attachment; filename=chat_ids.json");
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(content);
};
