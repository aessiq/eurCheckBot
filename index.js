'use strict'
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const token = '5175773703:AAG9ntBfob88aEKIe5jUHXbpDBKVVqsYQ-c';
const bot = new TelegramBot(token, {polling: true});
const refreshTimeInMinutes = 2;

const chatsAndRates = {};

bot.setMyCommands([
  {command: '/currentrate', description: 'Получить текущий курс.'},
  {command: '/start', description: 'Запускает бота, обнуляет курс.'},
]);

const setExchangeRate = async (chatId, text) => {
  chatsAndRates[chatId] = text;
  await bot.sendMessage(chatId, `Вы установили курс: ${text} рублей.`);
}

const getCurrentRate = async () => {
  try {
    const data = await axios.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB');
    const eurRate = await data.data.payload.rates[5].buy;
    return eurRate
  } catch (err) {
    await bot.sendMessage(chatId, 'Oops, there is an error! Please try again later');
    console.log(err);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === '/start') {
    chatsAndRates[chatId] = Infinity;
    await bot.sendMessage(chatId, 'Это бот для мониторинга курса евро (coming soon: доллары). Введите пороговое значение и бот сообщит вам, если курс его достигнет. Курс проверяется каждые две минуты (в дальнейшем планиурую настраивать это время).');
    return
  }
  if (text === '/currentrate') {
    await bot.sendMessage(chatId, await getCurrentRate());
    return
  }
  if (text.match(/^\d+$/)) {
    setExchangeRate(chatId, text);
    checkEUR();
    return
  }
  await bot.sendMessage(chatId, 'Такой команды бот не знает.');
});

const checkEUR = async () => {
  try {
    const response = await axios.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB');
    const eurRate = await response.data.payload.rates[5].buy;
    for (let key in chatsAndRates) {
      if (eurRate >= chatsAndRates[key]) {
        bot.sendMessage(key, `TIME TO SELL! Курс превысил ${chatsAndRates[key]}.`);
      }
    }
    return eurRate;
  } catch (err) {
    for (let key in chatsAndRates) {
      await bot.sendMessage(key, 'Oops, there is an error! Please try again later.');
    }
    console.log(err);
  }
}

setInterval(checkEUR, 1000*60*refreshTimeInMinutes);