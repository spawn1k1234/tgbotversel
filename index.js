const { Telegraf, Markup, Scenes, session } = require("telegraf");
const { connectDB, getDB } = require("./db");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Текст "О нас" — более официальный, с акцентом на надёжность и качество
const aboutText = `
*PODLUXSWEGAM — ваш надежный поставщик люкс-копий из Китая!*

Мы гарантируем премиальное качество каждой вещи, максимально приближенной к оригиналу, при этом сохраняя доступные цены.

Почему выбирают PodLuxSwegam?  
• Строгий контроль качества на всех этапах производства  
• Только проверенные и надежные поставщики  
• Оперативная доставка и профессиональная поддержка клиентов  
• Индивидуальный подход к каждому заказу  

Благодарим вас за доверие — мы ценим каждого клиента и стремимся к вашему совершенству в стиле!
`;

// Главное меню — добавлена кнопка для подписки на Telegram-канал
function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.url(
        "💬 Связаться с менеджером",
        "https://t.me/podluxswegam"
      ),
    ],
    [
      Markup.button.url(
        "📸 Наш Instagram",
        "https://instagram.com/your_instagram"
      ),
    ],
    [
      Markup.button.url(
        "🔔 Подписаться на наш Telegram-канал",
        "https://t.me/your_channel_username"
      ),
    ],
    [Markup.button.callback("ℹ️ О нас", "about_info")],
    [Markup.button.callback("🎁 Акции и скидки", "promo")],
  ]);
}

// Сцена для рассылки (оставлена без изменений)
const broadcastScene = new Scenes.WizardScene(
  "broadcast",
  async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply("⛔️ У вас нет доступа к этой команде.");
      return ctx.scene.leave();
    }
    await ctx.reply("📷 Пожалуйста, отправьте фото для рассылки:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message.photo) {
      await ctx.reply("⚠️ Пожалуйста, отправьте изображение.");
      return;
    }
    ctx.wizard.state.photo =
      ctx.message.photo[ctx.message.photo.length - 1].file_id;
    await ctx.reply("✏️ Теперь отправьте текст для рассылки:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message.text) {
      await ctx.reply("⚠️ Пожалуйста, отправьте текст.");
      return;
    }
    ctx.wizard.state.caption = ctx.message.text;
    await ctx.replyWithPhoto(ctx.wizard.state.photo, {
      caption: ctx.wizard.state.caption,
    });
    await ctx.reply("✅ Предпросмотр готов. Отправить рассылку? (да/нет)");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const confirmation = ctx.message.text.toLowerCase();
    if (confirmation === "да") {
      const db = getDB();
      const users = await db.collection("users").find().toArray();
      for (const user of users) {
        try {
          await ctx.telegram.sendPhoto(user.chatId, ctx.wizard.state.photo, {
            caption: ctx.wizard.state.caption,
          });
        } catch (error) {
          console.error(
            `❌ Не удалось отправить сообщение пользователю ${user.chatId}:`,
            error
          );
        }
      }
      await ctx.reply("📢 Рассылка завершена.");
    } else {
      await ctx.reply("❌ Рассылка отменена.");
    }
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([broadcastScene]);
bot.use(session());
bot.use(stage.middleware());

// Команда /start — приветствие + главное меню с более серьёзным тоном
bot.start(async (ctx) => {
  const db = getDB();
  const user = {
    chatId: ctx.chat.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
  };

  await db
    .collection("users")
    .updateOne({ chatId: user.chatId }, { $set: user }, { upsert: true });

  await ctx.reply(
    `Здравствуйте, ${
      ctx.from.first_name || "уважаемый клиент"
    }! 👋\n\nДобро пожаловать в PODLUXSWEGAM — магазин люкс-копий премиум-класса.\n\nПожалуйста, выберите нужное действие из меню ниже:`,
    mainMenu()
  );
});

// Обработчик кнопки "О нас" с кнопкой назад и ссылкой на акции
bot.action("about_info", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(aboutText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [Markup.button.callback("🎁 Акции и скидки", "promo")],
    ]),
  });
});

// Акции и скидки — более официальный стиль, с кнопкой на магазин и назад
const promoText = `
🎉 *Специальные предложения от PodLuxSwegam*

- Скидка 10% на первый заказ с промокодом: WELCOME10  
- Бесплатная доставка при заказе от 1000 юаней  
- Еженедельные распродажи и эксклюзивные новинки  

Следите за обновлениями и не упускайте выгодные предложения!
`;

bot.action("promo", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(promoText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [
        Markup.button.webApp(
          "🛍 Перейти в магазин",
          "https://podluxswegam-lok7.vercel.app"
        ),
      ],
    ]),
  });
});

// Обработчик кнопки "Назад" — возвращение в главное меню
bot.action("main_menu", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `Вы вернулись в главное меню. Пожалуйста, выберите действие:`,
    mainMenu()
  );
});

// Команда /about — тоже открывает "О нас"
bot.command("about", async (ctx) => {
  await ctx.replyWithMarkdown(aboutText, mainMenu());
});

// Команда для запуска рассылки (только для админа)
bot.command("broadcast", (ctx) => ctx.scene.enter("broadcast"));

// Запуск бота
(async () => {
  await connectDB();
  bot.launch();
  console.log("🤖 Бот запущен");
})();

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
