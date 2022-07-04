const questSchema = require('../schemas/questSchema');

module.exports = {
    name: 'approve',
    description: 'Approve user\'s quest',
    async execute(message, bot, args) {
        const { id } = message.guild;
        const serverConfig = bot.config.serverConfig[id];

        const questName = args[0];

        if (!message.member.roles.cache.some(r => serverConfig.modRoles.includes(r.name))) {
            return;
        }

        const user = message.mentions.users.first();
        if(!user) {
            return;
        }

        const memberTarget = message.guild.members.cache.get(user.id);
        const questFound = await questSchema.findOne({ name: questName });
        if (!questFound) {
            return;
        }

        const quests = await questSchema.find({});
        const awardRoles = quests.map(quest => quest.roleAward);
        const accessRoles = quests.map(quest => quest.roleAccess);
        let roleDelete = message.guild.roles.cache.filter(role => {
            return awardRoles.includes(role.name) || accessRoles.includes(role.name);
        });
        let roleToAdd = message.guild.roles.cache.find(role => role.name === questFound.roleAward);
        if (!roleToAdd) {
            return;
        }
        message.guild.roles.cache.forEach(role => {
            if (accessRoles.includes(role.name)) {
                memberTarget.roles.remove(role);
            }
        });

        const hasAwardRole = memberTarget.roles.cache.some(role => role.name === roleToAdd?.name);
        if (hasAwardRole) {
            message.channel.send('This role is already granted.');
            return;
        }

        try {
            await memberTarget.roles.remove(roleDelete);
            await memberTarget.roles.add(roleToAdd);
        } catch (err) {
            console.log(err);
            message.channel.send('Oops! I have no such power.');
        }

        const awardMessage = questFound.message.replace('{{user}}', user.toString()).replace('{{role}}', roleToAdd.name);
        const roomExp = message.guild.channels.cache.find(i => i.name === serverConfig.roomExp);
        roomExp ? roomExp.send(awardMessage) : message.channel.send(awardMessage);
    },
};
