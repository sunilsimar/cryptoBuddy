// import TelegramBot from "node-telegram-bot-api";
// import { createWallet, getBalance } from "./createWallet";
// import dotenv from "dotenv";

// dotenv.config();

// const token = process.env.TOKEN;

// if (!token) {
//     throw new Error("Bot token is not defined in the environment variables.");
// }
// const bot = new TelegramBot(token, { polling: true });

// export interface User {
//     walletAddress?: string;
//     seedPhrase?:  string;
// }

// export const userData: { [key: number]: User } = {};

// bot.on('message', async (msg)=>{
//     const chatId = msg.chat.id;
//     const messageText = msg.text;

//     if(messageText === '/start'){
//         const options = {
//             reply_markup: {
//                 inline_keyboard: [
//                     [
//                         { text: 'Buy', callback_data: 'buy' },
//                         { text: 'Fund', callback_data: 'fund' },
//                     ],
//                     [
//                         { text: 'Wallet', callback_data: 'wallet' },
//                         { text: 'Export Seed Phrase', callback_data: 'seedPhrase' },
//                     ],
//                 ],
//             },
//         };
//         bot.sendMessage(chatId, `Welcome to cryptoBuddy - the fastest and most secure bot for trading any token on Solana!

// You currently have no SOL in your wallet. To start trading, Create your wallet first by sending "Wallet" text to bot.

// Or buy SOL with Apple / Google Pay via MoonPay here (https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=6xAwqoXn1e4wuv6HzY4HN57dKJe9SGEa7kqGAzDxFya4&showWalletAddressForm=true&currencyCode=sol&signature=0hVkA9hikARUO0umwQYwpxp8fSvRwBchGDJSIx9pVMQ%3D).

// Once done, tap refresh and your balance will appear here.

// To buy a token: enter a ticker, token address, or URL from pump.fun, Birdeye, DEX Screener or Meteora.

// For more info on your wallet and to export your seed phrase, tap "Wallet" below.`,
// { ...options, parse_mode: 'Markdown' }
// );
//     }

//     if(messageText === 'Hello'){
//         bot.sendMessage(chatId, "hello creator sunil here")
//     }

//     else if(messageText === 'Wallet'){
//         if (!userData[chatId]) {
//             userData[chatId] = {};
//         }
//         let walletAddress = userData[chatId].walletAddress;
//         if (walletAddress) {
//             const balance = await getBalance(walletAddress);
//             bot.sendMessage(chatId, `your wallet address is: ${userData[chatId].walletAddress} and your balance is ${balance} SOL`);
//         } else {
//             const {walletAddress, seedPhrase} = await createWallet();
//             userData[chatId].walletAddress = walletAddress;
//             userData[chatId].seedPhrase = seedPhrase;
//             const balance = await getBalance(walletAddress);
//             setTimeout(() => {
//                 bot.sendMessage(chatId, `your wallet address is: ${walletAddress} and your balance is ${balance} SOL`);
//             }, 100);
//         }
//     }

//     else if(messageText == "Export Seed Phrase"){
//         if (!userData[chatId]) {
//             userData[chatId] = {};
//         }
//         let userSeed = userData[chatId].seedPhrase;
//         if(userSeed){
//             bot.sendMessage(chatId, userSeed);
//         }
//         else{
//             bot.sendMessage(chatId, "You need to create a wallet first")
//         }

//     }

// })


// bot.on('callback_query', async (callbackQuery) => {
//     if (!callbackQuery.message) return;
//     const chatId = callbackQuery.message.chat.id;
//     const action = callbackQuery.data;

//     if (action === 'wallet') {
//         if (!userData[chatId]) {
//             userData[chatId] = {};
//         }
//         let walletAddress = userData[chatId].walletAddress;

//         if (walletAddress) {
//             const balance = await getBalance(walletAddress); // Your getBalance function
//             const message = `*Your Wallet:*\n\n` +
//                 `*Address:* \`${walletAddress}\`\n` +
//                 `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
//                 `_Tap to copy the address and send SOL to deposit._`;

//             // Send message with markdown formatting
//             await bot.sendMessage(chatId, message, {
//                 parse_mode: 'Markdown',
//                reply_markup: {
//                 inline_keyboard: [
//                     [
//                         { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
//                     ],
//                 ],
//             }
//         });

//     await bot.answerCallbackQuery(callbackQuery.id);
          
//         } else {
//             const { walletAddress, seedPhrase } = await createWallet(); // Your createWallet function
//             userData[chatId].walletAddress = walletAddress;
//             userData[chatId].seedPhrase = seedPhrase;
//             const balance = await getBalance(walletAddress);
//             const message = `*Your Wallet:*\n\n` +
//             `*Address:* \`${walletAddress}\`\n` +
//             `*Balance:* ${balance.toFixed(9)} SOL\n\n` +
//             `_Tap to copy the address and send SOL to deposit._`;

//         // Send message with markdown formatting
//         await bot.sendMessage(chatId, message, {
//             parse_mode: 'Markdown',
//            reply_markup: {
//             inline_keyboard: [
//                 [
//                     { text: 'View on Solscan', url: `https://solscan.io/account/${walletAddress}` },
//                 ],
//             ],
//         }
         
//     });
//         await bot.answerCallbackQuery(callbackQuery.id);
//         }

//     } else if (action === 'fund') {
//         bot.sendMessage(chatId, `To fund your wallet, use the MoonPay link in the welcome message.`);
//         await bot.answerCallbackQuery(callbackQuery.id);

//     }
//      else if (action == 'seedPhrase'){
//         let userSeed = userData[chatId].seedPhrase;
//         if(userSeed){
//             const formattedSeedMessage = `*Your Seed Phrase:*\n\n\`${userSeed}\`\n` + `\nKeep this phrase safe and do not share it with anyone.\n\n` + `_Tap to copy the seed phrase._`;
//             await bot.sendMessage(chatId, formattedSeedMessage, {
//                 parse_mode: 'Markdown',
//                 // Add custom keyboard markup if needed
//                 // reply_markup: {
//                 //     keyboard: [
//                 //         [{ text: '💰 Check Balance' }, { text: '📥 Deposit' }, { text: '📤 Withdraw' }]
//                 //     ],
//                 //     resize_keyboard: true
//                 // }
//         });
//             await bot.answerCallbackQuery(callbackQuery.id);
//         }
//         else{
//             bot.sendMessage(chatId, "You need to create a wallet first");
//             await bot.answerCallbackQuery(callbackQuery.id);
//         }
//     }
// });

