const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid'); // Import UUID library for unique accessKey
const moment = require('moment'); // Import moment.js for better date handling
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process if DB connection fails
    });

// Define Mongoose Schema and Model
const MessageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    accessKey: { type: String, unique: true, default: () => uuidv4() }, // Generate unique accessKey
});

const Message = mongoose.model('Message', MessageSchema);

// Routes
// Home Route (for testing server status)
app.get('/', (req, res) => {
    res.send('Server is running and connected to the frontend.');
});

// Create Message Route
app.post('/api/messages', async (req, res) => {
    const { text, releaseDate } = req.body;
    console.log('Request Data Received:', { text, releaseDate }); // Log incoming data

    // Save message immediately, even if releaseDate is in the future
    try {
        const newMessage = new Message({ text, releaseDate });
        const savedMessage = await newMessage.save();
        console.log('Message Saved Successfully:', savedMessage); // Log saved data
        res.json({ success: true, id: savedMessage._id, accessKey: savedMessage.accessKey });
    } catch (error) {
        console.error('Error in Saving Message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Retrieve Message Route
app.get('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Retrieve Request for ID:', id); // Log ID for debugging
    try {
        const message = await Message.findById(id);
        if (!message) {
            console.warn('Message Not Found:', id);
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        // Check if the releaseDate is in the future
        const currentDate = moment();
        const messageReleaseDate = moment(message.releaseDate);

        if (messageReleaseDate.isAfter(currentDate)) {
            // If the message release date is in the future, return remaining time
            const remainingTime = messageReleaseDate.diff(currentDate, 'seconds'); // Remaining time in seconds
            console.warn('Message is not yet available:', id);

            const countdown = moment.duration(remainingTime, 'seconds').humanize(); // Human-readable countdown
            return res.status(403).json({ 
                success: false, 
                error: `Message not available yet. Available in ${countdown}`,
                remainingTime // Return raw time in seconds for front-end countdown
            });
        }

        console.log('Message Retrieved:', message); // Log retrieved message
        res.json({ success: true, message });
    } catch (error) {
        console.error('Error in Retrieving Message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
