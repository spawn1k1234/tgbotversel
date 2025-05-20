module.exports = (req, res) => {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
        <!DOCTYPE html>
        <html lang="ru">
        <head><meta charset="UTF-8" /><title>Панель рассылки</title></head>
        <body>
          <h2>Отправить рассылку</h2>
          <form method="POST" action="/api/broadcast" enctype="multipart/form-data">
            <label>Текст сообщения:</label><br/>
            <textarea name="text" rows="4" cols="50" required></textarea><br/><br/>
            <label>Фото (опционально):</label><br/>
            <input type="file" name="photo" accept="image/*" /><br/><br/>
            <button type="submit">Отправить рассылку</button>
          </form>
        </body>
        </html>
      `);
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
