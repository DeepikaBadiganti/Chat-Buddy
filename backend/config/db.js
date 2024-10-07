const mongoose = require('mongoose')


const connectDB = async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        const conn = await mongoose.connect(MONGO_URI)
        console.log(`MongoDB Connected`.cyan.bold)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

module.exports = connectDB;