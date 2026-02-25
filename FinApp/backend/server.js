const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure MONGO_DB URI is provided
if (!process.env.MONGO_DB) {
    console.error('FATAL ERROR: MONGO_DB is not defined in .env');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('MongoDB Connected successfully to Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const translateRoutes = require('./routes/translate');
const aiRoutes = require('./routes/ai');
const ttsRoutes = require('./routes/tts');

app.use('/api/auth', authRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tts', ttsRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('FinApp Backend API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
