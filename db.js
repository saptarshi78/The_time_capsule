const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// Message Schema
const messageSchema = new mongoose.Schema({
    messageId: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    releaseDateTime: { type: Date, required: true },
});

// Message Model
const Message = mongoose.model('Message', messageSchema);

module.exports = { connectDB, Message };
