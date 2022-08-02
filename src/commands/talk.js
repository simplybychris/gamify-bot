const quoteSchema = require('../schemas/quoteSchema');

module.exports = {
    name: 'talk',
    description: 'Post a message as a bot to specific channel',
    async execute(message, bot, args) {
        const { id } = message.guild;
        const serverConfig = bot.config.serverConfig[id];
        if (!message.member.roles.cache.some(r => serverConfig.modRoles.includes(r.name))) {
            return;
        }

        const mentionedChannel = message.mentions.channels.first();

        if(args.length < 2) return;
        message.delete();
        const channelName = args[0];
        args.shift();
        const messageToSend = args.join(' ');

        if(mentionedChannel) {
            return mentionedChannel.send(messageToSend);
        }

        const channel = message.guild.channels.cache.find(i => i.name === channelName);

        if (channel) {
            return channel.send(messageToSend);
        }
    },
};
