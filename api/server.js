const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN; // Menggunakan variabel lingkungan
const bot = new TelegramBot(token, { polling: true });

const uri = process.env.MONGODB_URI; // Menggunakan variabel lingkungan

// Buat MongoClient dengan opsi MongoClientOptions untuk mengatur versi API Stabil
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Hubungkan klien ke server
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('idle-game');
    const users = db.collection('users');

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      console.log(`Received /start command from chatId: ${chatId}`);
      try {
        let user = await users.findOne({ telegramId: chatId });
        if (!user) {
          user = { telegramId: chatId, coins: 0, clickPower: 1, lastClaimed: new Date() };
          await users.insertOne(user);
          bot.sendMessage(chatId, 'Welcome to the Idle Mining Game!');
        } else {
          bot.sendMessage(chatId, 'Welcome back!');
        }
      } catch (err) {
        console.error('Error handling /start command:', err);
        bot.sendMessage(chatId, 'Error occurred');
      }
    });

    bot.onText(/\/play/, (msg) => {
      const chatId = msg.chat.id;
      const url = `https://your-app-name.vercel.app`; // Ganti dengan URL Vercel Anda
      console.log(`Received /play command from chatId: ${chatId}`);
      bot.sendMessage(chatId, 'Click the button below to play the game:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Play Game', web_app: { url: url } }]
          ]
        }
      });
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

run().catch(console.dir);

module.exports = app;
