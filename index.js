// // index.js
// const { Telegraf, Markup, Scenes, session } = require("telegraf");
// const { connectDB, getDB } = require("./db");
// require("dotenv").config();

// const bot = new Telegraf(process.env.BOT_TOKEN);

// // Сцена для рассылки
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

// // Обработка команды /start
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
//     `Привет, ${ctx.from.first_name || "друг"}! 👋`,
//     Markup.inlineKeyboard([
//       [Markup.button.url("💬 Менеджер", "https://t.me/manager_username")],
//       [
//         Markup.button.url(
//           "📸 Instagram",
//           "https://instagram.com/your_instagram"
//         ),
//       ],
//     ])
//   );
// });

// // Команда для запуска рассылки
// bot.command("broadcast", (ctx) => ctx.scene.enter("broadcast"));

// // Запуск бота
// (async () => {
//   await connectDB();
//   bot.launch();
//   console.log("🤖 Бот запущен");
// })();
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const { connectDB, getDB } = require("./db");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Текст "О нас"
const aboutText = `
*PodLuxSwegam — ваш надежный магазин люкс-копий из Китая!*

Мы предлагаем стильные вещи премиум-класса, максимально приближенные к оригиналам, с безупречным качеством и по доступной цене.

Почему выбирают PodLuxSwegam?
• Только проверенные поставщики  
• Высокое качество материалов и отделки  
• Быстрая доставка и поддержка  
• Мы ценим каждого клиента!

Спасибо, что выбираете PodLuxSwegam — ваш стиль, ваш выбор!
`;

// Главное меню (возврат сюда по кнопке "Главное меню")
function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.url(
        "💬 Связаться с менеджером",
        "https://t.me/manager_username"
      ),
    ],
    [
      Markup.button.url(
        "📸 Наш Instagram",
        "https://instagram.com/your_instagram"
      ),
    ],
    [Markup.button.callback("ℹ️ О нас", "about_info")],
    [Markup.button.callback("🎁 Акции и скидки", "promo")],
  ]);
}

// Сцена для рассылки (оставим без изменений)
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

// Команда /start — приветствие + главное меню
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
    `Привет, ${
      ctx.from.first_name || "друг"
    }! 👋\nДобро пожаловать в PodLuxSwegam — магазин люкс-копий премиум-класса из Китая.\n\nВыберите действие ниже:`,
    mainMenu()
  );
});

// Обработчик кнопки "О нас"
bot.action("about_info", async (ctx) => {
  await ctx.answerCbQuery(); // Убирает "часики"
  await ctx.editMessageText(aboutText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [Markup.button.callback("🎁 Акции и скидки", "promo")],
    ]),
  });
});

// Акции и скидки (пример)
const promoText = `
🎉 *Акции и специальные предложения от PodLuxSwegam!*

- Скидка 10% на первый заказ по промокоду: WELCOME10  
- Бесплатная доставка при заказе от 1000юаней  
- Еженедельные распродажи и эксклюзивные новинки!

Следите за обновлениями и не пропустите выгодные предложения!
`;

bot.action("promo", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(promoText, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Назад", "main_menu")],
      [Markup.button.url("🛒 Перейти в магазин", "https://podluxswegam.shop")],
    ]),
  });
});

// Обработчик кнопки "Назад" — возвращаемся в главное меню
bot.action("main_menu", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `Вы вернулись в главное меню. Выберите действие ниже:`,
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
