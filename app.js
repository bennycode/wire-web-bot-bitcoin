const axios = require('axios');
const express = require('express');
const {Account} = require('@wireapp/core');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const bot = new Account({
  email: process.env.WIRE_USERNAME,
  password: process.env.WIRE_PASSWORD,
});

function parseCommand(text) {
  if (typeof text !== 'string') return undefined;
  
  const start = text.indexOf('/');
  const end = text.indexOf(' ');
  
  if (start === 0 && end > -1) {
    return text.substr(start, end);
  } else if (start === 0) {
    return text.substr(start);
  } else {
    return undefined;
  }
}

function fetchPrices() {
  return axios.get('http://api.bitcoincharts.com/v1/weighted_prices.json').then((response) => response.data);
}

async function processPrices() {
  const prices = await fetchPrices();
  return prices['USD']['24h'];
}

async function onMessage({conversation, content}) {
  const question = parseCommand(content);
  let answer;
  
  switch (question) {
    case '/status':
      const usd = await processPrices();
      answer = `Bitcoin price within the last 24 hours: ${usd} USD`;
      break;
  }
  
  if (answer) bot.sendTextMessage(conversation, answer);
}

bot.on(Account.INCOMING.TEXT_MESSAGE, onMessage);

bot
  .listen()
  .then(() => {
    console.log(`Bot is online... Client ID: ${bot.context.clientID}`);
    const app = express();
    const PORT = parseInt(process.env.PORT, 10) || 3000;
    app.get('/', (request, response) => response.send(`Online with "${login.email}".`));
    app.listen(PORT, () => console.log(`Server is running on port "${PORT}".`));
  })
  .catch((error) => console.error(error.message));
