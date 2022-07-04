require('dotenv').config();
const BotFactory = require('./src/index');
const connectDatabase = require('./src/db/dbConn');

const { TOKEN, MONGODB_URI } = process.env;

const discordBot = BotFactory.createBot({
    token: TOKEN,
    name: 'GamifyBot',
    prefix: '/'
});

discordBot.start();
connectDatabase(MONGODB_URI);
