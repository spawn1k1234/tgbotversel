import { bot } from "../../lib/bot";

export default async (req, res) => {
  if (req.method === "POST") {
    const { body } = req;
    await bot.handleUpdate(body);
  }
  res.status(200).json({ status: "OK" });
};
