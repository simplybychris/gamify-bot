const discord = require('discord.js');
const config = require('../config.json');
const commands = require('./commands');
const {Intents} = require('discord.js');
const has = require('./helpers/has');
const GuildConfigModel = require('./schemas/guildConfigSchema');

const {name} = config;
// Config
const configSchema = {
    defaultColors: {
        success: '#41b95f',
        neutral: '#287db4',
        warning: '#ff7100',
        error: '#c63737',
    },
};

async function fetchOrCreateServerConfig(guildId) {
    const serverConfig = await GuildConfigModel.findOneAndUpdate(
        {guildId},
        {guildId},
        {upsert: true, new: true}
    );

    return serverConfig;
}

const createBot = initialConfig => {
    const bot = {
        client: new discord.Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
            ],
        }),
        log: console.log, // eslint-disable-line no-console
        commands: new discord.Collection(),
    };

    bot.load = function load(config) {

        this.config = {};

        // Load config, modules, login
        this.loadConfig(config, () => {
            this.log('Attaching commands...');
            Object.keys(commands).forEach(key => {
                this.commands.set(commands[key].name, commands[key], bot);
            });
            this.log('Connecting...');
            this.client.login(this.config.token);
        });

    };

    bot.onConnect = async function onConnect() {
        this.log(`Logged in as: ${this.client.user.tag} (id: ${this.client.user.id})`);
    };

    bot.onMessage = async function onMessage(message) {

        const { id } = message.guild;
        this.config.serverConfig = {};
        if(!this.config.serverConfig[id]) {
            this.config.serverConfig[id] = await fetchOrCreateServerConfig(id);
        }

        // ignore all other messages without our prefix
        if (!message.content.startsWith(this.config.prefix)) return;
        const args = message.content.split(/ +/);
        // get the command (remove prefix)
        const command = args.shift().toLowerCase().slice(this.config.prefix.length);

        if (!this.commands.has(command)) return;

        try {
            this.commands.get(command).execute(message, bot, args);
        } catch (error) {
            this.log(error);
            message.reply('there was an error trying to execute that command!');
        }
    };

    /*
     * Register event listeners
     */
    bot.client.on('ready', bot.onConnect.bind(bot));
    //
    // bot.client.on('guildCreate', guild => {
    //
    // });

    bot.client.on('error', err => {
        bot.log(`Client error: ${err.message}`);
    });

    bot.client.on('reconnecting', () => {
        bot.log('Reconnecting...');
    });

    bot.client.on('disconnect', evt => {
        bot.log(`Disconnected: ${evt.reason} (${evt.code})`);
    });

    bot.client.on('message', bot.onMessage.bind(bot));

    bot.loadConfig = function loadConfig(config, callback) {
        this.log('Loading config...');
        try {
            if (!config || !has(config, 'token')) {
                throw Error('Config or token are missing.');
            }

            this.config = {
                ...configSchema,
                ...config,
            };
            callback();
        } catch (err) {
            this.log(`Error loading config: ${err.message}`);
            this.log('Please fix the config error and retry.');
        }
    };

    return {
        start: () => {
            bot.load(initialConfig);
        },
    };
};

module.exports = {
    createBot,
};

