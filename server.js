const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const token = '7416524421:AAHmWLZOz3tmFHox7_-2IOgGNP1XqSCxdCg';
const bot = new TelegramBot(token, { polling: true });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/idle-game', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  telegramId: String,
  coins: { type: Number, default: 0 },
  clickPower: { type: Number, default: 1 },
  lastClaimed: Date,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  User.findOne({ telegramId: chatId }, (err, user) => {
    if (err) return bot.sendMessage(chatId, 'Error occurred');
    if (!user) {
      const newUser = new User({ telegramId: chatId });
      newUser.save();
      bot.sendMessage(chatId, 'Welcome to the Idle Mining Game!');
    } else {
      bot.sendMessage(chatId, 'Welcome back!');
    }
  });
});

bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  const url = `https://idle-game-xdhk.vercel.app/`; // Ganti dengan URL server Anda
  bot.sendMessage(chatId, 'Click the button below to play the game:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Play Game', web_app: { url: url } }]
      ]
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
