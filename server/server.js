require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Access environment variables
// IMPORTANT: PORT is usually set by Vercel's environment
const PORT = process.env.PORT || 8000; 
const MONGO_URI = process.env.MONGO_URI;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

// Routes
const authRoutes = require('./routes/auth'); 

// ----------------------------------------------------------------------
// FIX 1: Implement CORS Middleware with Explicit Origin Check
// This resolves the "Access-Control-Allow-Origin" conflict and allows deployment on Vercel.
// ----------------------------------------------------------------------

// 1. Define Allowed Frontend Origins
const allowedOrigins = [
    'http://localhost:3000', // React Local Dev
    // Add specific Vercel preview domains if necessary (like https://frontend-zeta-gilt-20.vercel.app)
    process.env.FRONTEND_URL, // Your official Vercel domain (set in ENV)
];

// 2. Define a regex pattern to allow all Vercel preview domains (*.vercel.app)
const vercelPreviewRegex = /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

// Middleware
app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman/cURL)
        if (!origin) return callback(null, true); 
        
        // Check if the origin is in the explicit list OR matches the Vercel preview pattern
        if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            callback(null, true); // Origin is allowed
        } else {
            console.warn(`CORS blocked request from disallowed origin: ${origin}`);
            callback(new Error(`Not allowed by CORS policy.`), false); // Origin is blocked
        }
    },
    // Explicitly allow all methods necessary for API access
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Now allowed because 'origin' is explicitly checked
}));

// ----------------------------------------------------------------------
// Geo API Routes
// ----------------------------------------------------------------------

// Get user's own IP geolocation (Self)
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

// ----------------------------------------------------------------------
// FIX 2: Mongoose Connection Logic
// We leave the connect block here, but Vercel requires the ENV vars to be set!
// ----------------------------------------------------------------------

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});