const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    commandPrefix: {
        type: mongoose.SchemaTypes.String,
        default: '/',
    },
    questAccessRolePrefix: {
        type: mongoose.SchemaTypes.String,
    },
    roomExp: {
        type: mongoose.SchemaTypes.String,
    },
    modRoles: {
        type: [String]
    }
});

const GuildConfigSchema = mongoose.model('guildConfig', guildConfigSchema);

module.exports = GuildConfigSchema;
