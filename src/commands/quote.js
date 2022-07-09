const quoteSchema = require('../schemas/quoteSchema');

module.exports = {
    name: 'alfredo',
    description: 'Get a quote',
    async execute(message) {
        let quote = await quoteSchema.aggregate([{ $sample: { size: 1 } }]);
        quote = quote[0].name.replace('{{user}}', message.author.toString());

        message.channel.send(quote);
    },
};
