const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

console.log('🤖 Bot is running! Ask the doctor to:');
console.log('1. Search for your bot: @Tricog_henry_bot');
console.log('2. Send any message to the bot (like "hello")');
console.log('3. Their chat ID will appear here\n');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Unknown';
    const lastName = msg.from.last_name || '';
    const username = msg.from.username || 'No username';
    
    console.log('📱 New message received!');
    console.log(`👤 From: ${firstName} ${lastName} (@${username})`);
    console.log(`🆔 Chat ID: ${chatId}`);
    console.log(`💬 Message: "${msg.text}"`);
    console.log('-----------------------------------');
    
    // Send a response back
    bot.sendMessage(chatId, `Hello ${firstName}! Your chat ID is: ${chatId}`);
});

console.log('Waiting for messages...');