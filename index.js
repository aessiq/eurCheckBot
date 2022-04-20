'use strict'
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const token = '5175773703:AAG9ntBfob88aEKIe5jUHXbpDBKVVqsYQ-c';
const bot = new TelegramBot(token, {polling: true});
const chatId = 1039025815;
let threshold = 86;
const refreshTimeInMinutes = 2;

function checkEUR() {
  try {
    axios.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB')
    .then(response => {
      const eurRate = response.data.payload.rates[5].buy;
      if (eurRate >= threshold) {
        bot.sendMessage(chatId, 'TIME TO SELL! Exchange rate is ' + eurRate);
      } else {
        console.log(eurRate);
      }
    });
  } catch {
    bot.sendMessage(chatId, 'Oops, there is an error!');
  }
}

checkEUR();
setInterval(checkEUR, 1000*60*refreshTimeInMinutes);