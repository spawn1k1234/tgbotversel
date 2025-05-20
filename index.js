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

const stage = new Scenes.Stage([broadcastScene]);
bot.use(session());
bot.use(stage.middleware());

// Команда /about — рассказывает о магазине
bot.command("about", async (ctx) => {
  const aboutText = `
*О нас*  
Добро пожаловать в наш магазин — ваш надежный источник стильных и качественных товаров из Китая!  
Мы специализируемся на продаже люкс-копий премиум-класса — вещей, которые идеально повторяют оригиналы, но при этом доступны по разумной цене.

Почему выбирают нас?  
• Проверенные поставщики и строгий контроль качества  
• Одежда, обувь и аксессуары с безупречной отделкой и материалами  
• Быстрая доставка и внимательная поддержка клиентов

Мы дорожим вашим доверием и стремимся предоставить только лучшие товары, чтобы вы всегда чувствовали себя уверенно и стильно!

Спасибо, что выбираете нас!
  `;
  await ctx.replyWithMarkdown(aboutText);
});

// Обработка команды /start
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
    }! 👋\n\nДобро пожаловать в наш магазин люкс-копий из Китая.`,
    Markup.inlineKeyboard([
      [Markup.button.url("💬 Менеджер", "https://t.me/manager_username")],
      [
        Markup.button.url(
          "📸 Instagram",
          "https://instagram.com/your_instagram"
        ),
      ],
      [Markup.button.callback("ℹ️ О нас", "about_info")],
    ])
  );
});

// Обработчик кнопки "О нас"
bot.action("about_info", async (ctx) => {
  const aboutText = `
*О нас*  
Добро пожаловать в наш магазин — ваш надежный источник стильных и качественных товаров из Китая!  
Мы специализируемся на продаже люкс-копий премиум-класса — вещей, которые идеально повторяют оригиналы, но при этом доступны по разумной цене.

Почему выбирают нас?  
• Проверенные поставщики и строгий контроль качества  
• Одежда, обувь и аксессуары с безупречной отделкой и материалами  
• Быстрая доставка и внимательная поддержка клиентов

Мы дорожим вашим доверием и стремимся предоставить только лучшие товары, чтобы вы всегда чувствовали себя уверенно и стильно!

Спасибо, что выбираете нас!
  `;
  await ctx.answerCbQuery(); // убирает "часики" у кнопки
  await ctx.editMessageText(aboutText, { parse_mode: "Markdown" });
});

// Команда для запуска рассылки (только админ)
bot.command("broadcast", (ctx) => ctx.scene.enter("broadcast"));

// Запуск бота
(async () => {
  await connectDB();
  bot.launch();
  console.log("🤖 Бот запущен");
})();
