require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Access environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

// Routes
const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"], 
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Get user's own IP geolocation
app.get('/api/geo/self', async (req, res) => {
    try {
        const url = IPINFO_TOKEN
            ? `https://ipinfo.io/json?token=${IPINFO_TOKEN}`
            : `https://ipinfo.io/json`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Geo API SELF Error:", error.message);
        res.status(500).json({ error: "Failed to fetch user's geolocation" });
    }
});

// Get geolocation for specific IP
app.get('/api/geo/ip/:ip', async (req, res) => {
    const { ip } = req.params;

    try {
        const url = IPINFO_TOKEN
            ? `https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`
            : `https://ipinfo.io/${ip}/json`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Geo API IP Error:", error.message);
        res.status(500).json({ error: "Failed to fetch geolocation for IP" });
    }
});

app.use('/api', authRoutes);

//MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
