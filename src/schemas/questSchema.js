const mongoose = require('mongoose');

const quest = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    level: {
        type: Number
    },
    roleAccess: {
        type: String
    },
    roleAward: {
        type: String
    },
    message: {
        type: String
    }

})

const Quest = mongoose.model("quest", quest);

module.exports = Quest;
