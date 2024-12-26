import TelegramBot from "node-telegram-bot-api";
import { createWallet, getBalance } from "./createWallet";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

const token = process.env.TOKEN;

if (!token) {
    throw new Error("Bot token is not defined in the environment variables.");
}
const bot = new TelegramBot(token);

// Set up the webhook URL
const TELEGRAM_WEBHOOK_URL = 'https://cryptobuddy-ngpz.onrender.com/webhook';
bot.setWebHook(TELEGRAM_WEBHOOK_URL);


export interface User {
    walletAddress?: string;
    seedPhrase?:  string;
}

export const userData: { [key: number]: User } = {};


// Handle incoming messages
app.post('/webhook', (req, res) => {
    console.log('Incoming request:', req.body); // Log the entire request body

    const message = req.body.message;

    if (message && message.chat && message.chat.id && message.text) {
        const chatId = message.chat.id;
        const messageText = message.text;

        console.log('Chat ID:', chatId); // Log the chat ID
        console.log('Message Text:', messageText); // Log the message text

        // Example reply
        if (messageText === 'Hello') {
            bot.sendMessage(chatId, 'Hello, I am your bot!');
        }
    } else {
        console.error('Invalid message format:', req.body); // Log invalid message format
    }

    res.sendStatus(200); // Acknowledge receipt
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
