// const { Telegraf, Markup, Scenes, session } = require("telegraf");
// const { connectDB, getDB } = require("./db");
// require("dotenv").config();

// const bot = new Telegraf(process.env.BOT_TOKEN);

// // Текст "О нас" — более официальный, с акцентом на надёжность и качество
// const aboutText = `
// *PODLUXSWEGAM — ваш надежный поставщик люкс-копий из Китая!*

// Мы гарантируем премиальное качество каждой вещи, максимально приближенной к оригиналу, при этом сохраняя доступные цены.

// Почему выбирают PodLuxSwegam?
// • Строгий контроль качества на всех этапах производства
// • Только проверенные и надежные поставщики
// • Оперативная доставка и профессиональная поддержка клиентов
// • Индивидуальный подход к каждому заказу

// Благодарим вас за доверие — мы ценим каждого клиента и стремимся к вашему совершенству в стиле!
// `;

// // Главное меню — добавлена кнопка для подписки на Telegram-канал
// function mainMenu() {
//   return Markup.inlineKeyboard([
//     [
//       Markup.button.url(
//         "💬 Связаться с менеджером",
//         "https://t.me/podluxswegam"
//       ),
//     ],
//     [
//       Markup.button.url(
//         "📸 Наш Instagram",
//         "https://instagram.com/your_instagram"
//       ),
//     ],
//     [
//       Markup.button.url(
//         "🔔 Подписаться на наш Telegram-канал",
//         "https://t.me/your_channel_username"
//       ),
//     ],
//     [Markup.button.callback("ℹ️ О нас", "about_info")],
//     [Markup.button.callback("🎁 Акции и скидки", "promo")],
//   ]);
// }

// // Сцена для рассылки (оставлена без изменений)
// const broadcastScene = new Scenes.WizardScene(
//   "broadcast",
//   async (ctx) => {
//     if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
//       await ctx.reply("⛔️ У вас нет доступа к этой команде.");
//       return ctx.scene.leave();
//     }
//     await ctx.reply("📷 Пожалуйста, отправьте фото для рассылки:");
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (!ctx.message.photo) {
//       await ctx.reply("⚠️ Пожалуйста, отправьте изображение.");
//       return;
//     }
//     ctx.wizard.state.photo =
//       ctx.message.photo[ctx.message.photo.length - 1].file_id;
//     await ctx.reply("✏️ Теперь отправьте текст для рассылки:");
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (!ctx.message.text) {
//       await ctx.reply("⚠️ Пожалуйста, отправьте текст.");
//       return;
//     }
//     ctx.wizard.state.caption = ctx.message.text;
//     await ctx.replyWithPhoto(ctx.wizard.state.photo, {
//       caption: ctx.wizard.state.caption,
//     });
//     await ctx.reply("✅ Предпросмотр готов. Отправить рассылку? (да/нет)");
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     const confirmation = ctx.message.text.toLowerCase();
//     if (confirmation === "да") {
//       const db = getDB();
//       const users = await db.collection("users").find().toArray();
//       for (const user of users) {
//         try {
//           await ctx.telegram.sendPhoto(user.chatId, ctx.wizard.state.photo, {
//             caption: ctx.wizard.state.caption,
//           });
//         } catch (error) {
//           console.error(
//             `❌ Не удалось отправить сообщение пользователю ${user.chatId}:`,
//             error
//           );
//         }
//       }
//       await ctx.reply("📢 Рассылка завершена.");
//     } else {
//       await ctx.reply("❌ Рассылка отменена.");
//     }
//     return ctx.scene.leave();
//   }
// );

// const stage = new Scenes.Stage([broadcastScene]);
// bot.use(session());
// bot.use(stage.middleware());

// // Команда /start — приветствие + главное меню с более серьёзным тоном
// bot.start(async (ctx) => {
//   const db = getDB();
//   const user = {
//     chatId: ctx.chat.id,
//     username: ctx.from.username,
//     first_name: ctx.from.first_name,
//   };

//   await db
//     .collection("users")
//     .updateOne({ chatId: user.chatId }, { $set: user }, { upsert: true });

//   await ctx.reply(
//     `Здравствуйте, ${
//       ctx.from.first_name || "уважаемый клиент"
//     }! 👋\n\nДобро пожаловать в PODLUXSWEGAM — магазин люкс-копий премиум-класса.\n\nПожалуйста, выберите нужное действие из меню ниже:`,
//     mainMenu()
//   );
// });

// // Обработчик кнопки "О нас" с кнопкой назад и ссылкой на акции
// bot.action("about_info", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.editMessageText(aboutText, {
//     parse_mode: "Markdown",
//     ...Markup.inlineKeyboard([
//       [Markup.button.callback("⬅️ Назад", "main_menu")],
//       [Markup.button.callback("🎁 Акции и скидки", "promo")],
//     ]),
//   });
// });

// // Акции и скидки — более официальный стиль, с кнопкой на магазин и назад
// const promoText = `
// 🎉 *Специальные предложения от PodLuxSwegam*

// - Скидка 10% на первый заказ с промокодом: WELCOME10
// - Бесплатная доставка при заказе от 1000 юаней
// - Еженедельные распродажи и эксклюзивные новинки

// Следите за обновлениями и не упускайте выгодные предложения!
// `;

// bot.action("promo", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.editMessageText(promoText, {
//     parse_mode: "Markdown",
//     ...Markup.inlineKeyboard([
//       [Markup.button.callback("⬅️ Назад", "main_menu")],
//       [
//         Markup.button.webApp(
//           "🛍 Перейти в магазин",
//           "https://podluxswegam-lok7.vercel.app"
//         ),
//       ],
//     ]),
//   });
// });

// // Обработчик кнопки "Назад" — возвращение в главное меню
// bot.action("main_menu", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.editMessageText(
//     `Вы вернулись в главное меню. Пожалуйста, выберите действие:`,
//     mainMenu()
//   );
// });

// // Команда /about — тоже открывает "О нас"
// bot.command("about", async (ctx) => {
//   await ctx.replyWithMarkdown(aboutText, mainMenu());
// });

// // Команда для запуска рассылки (только для админа)
// bot.command("broadcast", (ctx) => ctx.scene.enter("broadcast"));

// // Запуск бота
// (async () => {
//   await connectDB();
//   bot.launch();
//   console.log("🤖 Бот запущен");
// })();

// // Graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const { connectDB, getDB } = require("./db");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_USERNAME = "podluxswegamtg"; // Без @

// Логирование действий
function logAction(action, userId, username) {
  const logMessage = `[${new Date().toISOString()}] Action: ${action}, UserID: ${userId}, Username: @${
    username || "нет"
  }\n`;
  fs.appendFileSync(path.join(__dirname, "bot.log"), logMessage);
}

// Проверка админа
const isAdmin = (ctx, next) => {
  if (ctx.from.id.toString() === process.env.ADMIN_ID) {
    return next();
  }
  ctx.reply("⛔️ У вас нет доступа к этой команде.");
};

// Проверка подписки на канал
async function checkSubscription(ctx, next) {
  try {
    const member = await ctx.telegram.getChatMember(
      `@${CHANNEL_USERNAME}`,
      ctx.from.id
    );
    if (member.status === "left") {
      return ctx.reply(
        "📢 Для использования бота подпишитесь на наш канал:",
        Markup.inlineKeyboard([
          Markup.button.url(
            "🔔 Подписаться",
            `https://t.me/${CHANNEL_USERNAME}`
          ),
          Markup.button.callback("✅ Я подписался", "check_subscription"),
        ])
      );
    }
    return next();
  } catch (err) {
    console.error("Ошибка проверки подписки:", err);
    return next(); // Пропускаем если ошибка
  }
}

// Текст "О нас"
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

// Текст акций
const promoText = `
🎉 *Специальные предложения от PodLuxSwegam*

- Скидка 10% на первый заказ с промокодом: WELCOME10  
- Бесплатная доставка при заказе от 1000 юаней  
- Еженедельные распродажи и эксклюзивные новинки  

Следите за обновлениями и не упускайте выгодные предложения!
`;

// Главное меню
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
        "🔔 Наш Telegram-канал",
        `https://t.me/${CHANNEL_USERNAME}`
      ),
    ],
    [Markup.button.callback("ℹ️ О нас", "about_info")],
    [Markup.button.callback("🎁 Акции и скидки", "promo")],
    [Markup.button.callback("📝 Оставить отзыв", "leave_feedback")],
    [
      Markup.button.webApp(
        "🛍️ Каталог",
        "https://podluxswegam-lok7.vercel.app"
      ),
    ],
  ]);
}

// Сцена для рассылки
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

// Сцена для обратной связи
const feedbackScene = new Scenes.WizardScene(
  "feedback",
  (ctx) => {
    ctx.reply("📝 Пожалуйста, напишите ваш отзыв или вопрос:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const feedback = ctx.message.text;
    await ctx.reply(
      "🙏 Спасибо за ваш отзыв! Мы свяжемся с вами в ближайшее время."
    );
    const db = getDB();
    await db.collection("feedback").insertOne({
      userId: ctx.from.id,
      username: ctx.from.username,
      text: feedback,
      date: new Date(),
    });
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([broadcastScene, feedbackScene]);
bot.use(session());
bot.use(stage.middleware());

// Сохранение пользователя при любом взаимодействии
bot.use(async (ctx, next) => {
  const db = getDB();
  const user = {
    chatId: ctx.chat.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
    lastActivity: new Date(),
  };
  await db
    .collection("users")
    .updateOne({ chatId: user.chatId }, { $set: user }, { upsert: true });
  return next();
});

// Команда /start
bot.start(checkSubscription, async (ctx) => {
  logAction("start", ctx.from.id, ctx.from.username);
  await ctx.reply(
    `Здравствуйте, ${
      ctx.from.first_name || "уважаемый клиент"
    }! 👋\n\nДобро пожаловать в PODLUXSWEGAM — магазин люкс-копий премиум-класса.\n\nПожалуйста, выберите нужное действие из меню ниже:`,
    mainMenu()
  );
});

// Команда /help
bot.command("help", checkSubscription, (ctx) => {
  ctx.replyWithMarkdown(
    `
*Доступные команды:*
/start - Начать работу с ботом
/about - О нашей компании
/promo - Акции и скидки
/help - Помощь

Для админов:
/broadcast - Рассылка сообщений
/stats - Статистика бота
  `,
    mainMenu()
  );
});

// Команда /about
bot.command("about", checkSubscription, async (ctx) => {
  await ctx.replyWithMarkdown(aboutText, mainMenu());
});

// Команда /promo
bot.command("promo", checkSubscription, async (ctx) => {
  await ctx.replyWithMarkdown(
    promoText,
    Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [
        Markup.button.webApp(
          "🛍 Каталог",
          "https://podluxswegam-lok7.vercel.app"
        ),
      ],
    ])
  );
});

// Команда /stats (только для админа)
bot.command("stats", isAdmin, async (ctx) => {
  const db = getDB();
  const userCount = await db.collection("users").countDocuments();
  const feedbackCount = await db.collection("feedback").countDocuments();
  ctx.reply(
    `📊 *Статистика бота:*
  
👥 Пользователей: ${userCount}
📝 Отзывов: ${feedbackCount}`,
    { parse_mode: "Markdown" }
  );
});

// Обработка текстовых сообщений
bot.on("text", checkSubscription, (ctx) => {
  const text = ctx.message.text.toLowerCase();
  if (text.includes("привет") || text.includes("здравствуйте")) {
    ctx.reply("Здравствуйте! Чем могу помочь?", mainMenu());
  }
});

// Обработчики кнопок
bot.action("about_info", checkSubscription, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(aboutText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [Markup.button.callback("🎁 Акции", "promo")],
    ]),
  });
});

bot.action("promo", checkSubscription, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(promoText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [
        Markup.button.webApp(
          "🛍 Каталог",
          "https://podluxswegam-lok7.vercel.app"
        ),
      ],
    ]),
  });
});

bot.action("main_menu", checkSubscription, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `Вы вернулись в главное меню. Пожалуйста, выберите действие:`,
    mainMenu()
  );
});

bot.action("leave_feedback", checkSubscription, (ctx) =>
  ctx.scene.enter("feedback")
);
bot.action("check_subscription", checkSubscription, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  ctx.reply("Добро пожаловать!", mainMenu());
});

// Команда для рассылки (только для админа)
bot.command("broadcast", isAdmin, (ctx) => ctx.scene.enter("broadcast"));

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error(`Ошибка для ${ctx.updateType}:`, err);
  ctx.reply("⚠️ Произошла ошибка. Пожалуйста, попробуйте позже.");
});

// Запуск бота
(async () => {
  await connectDB();
  bot.launch();
  console.log("🤖 Бот запущен");
})();

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
