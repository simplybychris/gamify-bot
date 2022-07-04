const mongoose = require('mongoose');

const connectDatabase = async (uri) => {
    await mongoose.connect(uri).then(() => {
        console.log('Database connected.');
    }).catch((err) => {
        console.log('Error while connecting to database. \n', err);
    });
};

module.exports = connectDatabase;


