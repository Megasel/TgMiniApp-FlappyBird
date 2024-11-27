const express = require("express");
const path = require("path");
const compression = require("compression");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = 80;

// Telegram Bot токен (замените на ваш)
const TOKEN = "TOKEN";
const bot = new TelegramBot(TOKEN, { polling: true });

// Используем сжатие
app.use(compression());

// Указываем директорию Unity Build
const buildPath = path.join(__dirname, "Build");

// Настраиваем раздачу сжатых файлов
app.use(
    express.static(buildPath, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith(".br")) {
                res.setHeader("Content-Encoding", "br");
                res.setHeader("Content-Type", "application/javascript");
            } else if (filePath.endsWith(".gz")) {
                res.setHeader("Content-Encoding", "gzip");
                res.setHeader("Content-Type", "application/javascript");
            }
        },
        maxAge: "1y", // Кэшируем файлы на год
    })
);

// Обслуживание основного файла HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

// Telegram Bot Logic
bot.onText(/start/, (msg) => {
    const chatId = msg.chat.id;

    // Сначала отправляем сообщение с кнопкой для игры
    bot.sendMessage(chatId, "Flappy Bird:", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Играть",
                        web_app: { url: `https://flappybird-frigwis.amvera.io` }, // Замените на ваш домен
                    },
                ],
            ],
        },
    }).then(() => {
        // Затем отправляем отдельное сообщение с ссылками
        bot.sendMessage(
            chatId,
            `Понравилась классика игрового мира? 😏\nНе поскупись и подпишись на наш ТГ! [*тык*](*ссылка на тг*)\nБудем очень благодарны 😘\n\nP.S. А может еще на [Ютуб](*ссылка на ютуб*)?!`,
            {
                parse_mode: "Markdown", // Используем Markdown для форматирования текста
            }
        );
    });
});



// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at https://flappybird-frigwis.amvera.io`);
});
