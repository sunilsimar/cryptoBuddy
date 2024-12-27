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
    seedPhrase?: string;
}

export const userData: { [key: number]: User } = {};

// Handle incoming messages
app.post('/webhook', async (req, res) => {
    console.log('Incoming request:', req.body); // Log the entire request body

    const message = req.body.message;

    if (message && message.chat && message.chat.id && message.text) {
        const chatId = message.chat.id;
        const messageText = message.text.toLowerCase();
        const firstName = message.chat.first_name;

        console.log('Chat ID:', chatId); // Log the chat ID
        console.log('Message Text:', messageText); // Log the message text

        if (messageText === '/start') {
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Buy', callback_data: 'buy' },
                            { text: 'Fund', callback_data: 'fund' },
                        ],
                        [
                            { text: 'Wallet', callback_data: 'wallet' },
                            { text: 'Export Seed Phrase', callback_data: 'seedPhrase' },
                        ],
                    ],
                },
            };
            await bot.sendMessage(chatId, `Welcome to cryptoBuddy - the fastest and most secure bot for trading any token on Solana!

You currently have no SOL in your wallet. To start trading, Create your wallet first by sending "Wallet" text to bot.

Or buy SOL with Apple / Google Pay via MoonPay here (https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=6xAwqoXn1e4wuv6HzY4HN57dKJe9SGEa7kqGAzDxFya4&showWalletAddressForm=true&currencyCode=sol&signature=0hVkA9hikARUO0umwQYwpxp8fSvRwBchGDJSIx9pVMQ%3D).

Once done, tap refresh and your balance will appear here.

To buy a token: enter a ticker, token address, or URL from pump.fun, Birdeye, DEX Screener or Meteora.

For more info on your wallet and to export your seed phrase, tap "Wallet" below.`,
                { ...options, parse_mode: 'Markdown' }
            );
        } else if (['hello', 'hey', 'good morning', 'good evening', 'good night'].includes(messageText)) {
            await bot.sendMessage(chatId, `Hey ${firstName}, how can I assist you with your trading today?`);
        } else if (messageText === 'wallet') {
            if (!userData[chatId]) {
                userData[chatId] = {};
            }
            let walletAddress = userData[chatId].walletAddress;
            if (walletAddress) {
                const balance = await getBalance(walletAddress); // Your getBalance function
                const message = `*Your Wallet:*\n\n` +
                    `*Address:* \`${walletAddress}\`\n` +
                    `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
                    `_Tap to copy the address and send SOL to deposit._`;
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
                            ],
                        ],
                    }
                });
            } else {
                const { walletAddress, seedPhrase } = await createWallet();
                userData[chatId].walletAddress = walletAddress;
                userData[chatId].seedPhrase = seedPhrase;
                const balance = await getBalance(walletAddress); // Your getBalance function
                const message = `*Your Wallet:*\n\n` +
                    `*Address:* \`${walletAddress}\`\n` +
                    `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
                    `_Tap to copy the address and send SOL to deposit._`;
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
                            ],
                        ],
                    }
                });
            }
        } else if (messageText === 'export seed phrase') {
            if (!userData[chatId]) {
                userData[chatId] = {};
            }
            let userSeed = userData[chatId].seedPhrase;
            if (userSeed) {
                await bot.sendMessage(chatId, userSeed);
            } else {
                await bot.sendMessage(chatId, "You need to create a wallet first");
            }
        }
    } else if (req.body.callback_query) {
        const callbackQuery = req.body.callback_query;
        const chatId = callbackQuery.message.chat.id;
        const action = callbackQuery.data;

        if (action === 'wallet') {
            if (!userData[chatId]) {
                userData[chatId] = {};
            }
            let walletAddress = userData[chatId].walletAddress;

            if (walletAddress) {
                const balance = await getBalance(walletAddress); // Your getBalance function
                const message = `*Your Wallet:*\n\n` +
                    `*Address:* \`${walletAddress}\`\n` +
                    `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
                    `_Tap to copy the address and send SOL to deposit._`;
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
                            ],
                        ],
                    }
                });

                // Answer the callback query to stop the button from blinking
                await bot.answerCallbackQuery(callbackQuery.id);
            } else {
                const { walletAddress, seedPhrase } = await createWallet(); // Your createWallet function
                userData[chatId].walletAddress = walletAddress;
                userData[chatId].seedPhrase = seedPhrase;
                const balance = await getBalance(walletAddress); // Your getBalance function
                const message = `*Your Wallet:*\n\n` +
                    `*Address:* \`${walletAddress}\`\n` +
                    `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
                    `_Tap to copy the address and send SOL to deposit._`;
                await bot.sendMessage(chatId, message, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
                            ],
                        ],
                    }
                });
                await bot.answerCallbackQuery(callbackQuery.id);
            }
        } else if (action === 'fund') {
            await bot.sendMessage(chatId, `To fund your wallet, use the MoonPay link in the welcome message.`);
            await bot.answerCallbackQuery(callbackQuery.id);
        } else if (action === 'seedPhrase') {
            let userSeed = userData[chatId].seedPhrase;
            if (userSeed) {
                const formattedSeedMessage = `*Your Seed Phrase:*\n\n\`${userSeed}\`\n` +
                    `\nKeep this phrase safe and do not share it with anyone.\n\n` +
                    `_Tap to copy the seed phrase._`;
                await bot.sendMessage(chatId, formattedSeedMessage, {
                    parse_mode: 'Markdown',
                });
                await bot.answerCallbackQuery(callbackQuery.id);
            } else {
                await bot.sendMessage(chatId, "You need to create a wallet first");
                await bot.answerCallbackQuery(callbackQuery.id);
            }
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