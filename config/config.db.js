const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONOGB_URL);
    console.log(`MongoDB Connected`);
};

module.exports = connectDB;