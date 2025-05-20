import TelegramBot from "node-telegram-bot-api";

const token =
  process.env.TELEGRAM_BOT_TOKEN ||
  "7651886787:AAEPR_EKo3W4mPpVr1hHcfUH_a3CMd90G64";
const bot = new TelegramBot(token, { polling: false });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.first_name || "друг";

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🛍️ Наш магазин", url: "https://example.com/shop" },
          { text: "📦 Каталог товаров", url: "https://example.com/catalog" },
        ],
        [
          { text: "👨‍💼 Менеджер", callback_data: "manager" },
          { text: "📸 Наш Instagram", url: "https://instagram.com/your_shop" },
        ],
      ],
    },
  };

  bot.sendMessage(
    chatId,
    `Привет, ${username}! 👋\n\nДобро пожаловать в наш магазин люксовых копий из Китая!\n\nВыберите действие:`,
    options
  );
});

// Обработчик кнопки менеджера
bot.on("callback_query", (query) => {
  if (query.data === "manager") {
    bot.sendMessage(
      query.message.chat.id,
      "Для связи с менеджером напишите @manager_username или позвоните по номеру +1234567890"
    );
  }
});

// Обработчик ошибок
bot.on("polling_error", (error) => {
  console.error(error);
});

export { bot };
