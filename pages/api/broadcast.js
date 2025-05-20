import nextConnect from "next-connect";
import multer from "multer";
import dbConnect from "../../lib/db";
import User from "../../models/User";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("photo"));

apiRoute.post(async (req, res) => {
  await dbConnect();

  const text = req.body.text;
  const photoBuffer = req.file.buffer;

  // Получаем всех пользователей
  const users = await User.find();

  // Рассылаем фото + текст
  for (const user of users) {
    try {
      await bot.telegram.sendPhoto(
        user.chatId,
        { source: photoBuffer },
        { caption: text }
      );
    } catch (err) {
      console.error("Error sending to", user.chatId, err.message);
    }
  }

  res.json({ message: "Рассылка отправлена" });
});

export const config = {
  api: {
    bodyParser: false, // multer
  },
};

export default apiRoute;
