const mongoose = require('mongoose');

const quote = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
});

const Quote = mongoose.model('quote', quote);

module.exports = Quote;
