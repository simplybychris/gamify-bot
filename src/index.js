require('dotenv').config();
const Discord = require('discord.js');
const config = require('../config.json');

const bot = new Discord.Client();

const { TOKEN } = process.env;

const { prefix, name } = config;

bot.login(TOKEN);

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`) // eslint-disable-line no-console
});
