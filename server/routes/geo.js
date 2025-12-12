const express = require('express');
const axios = require('axios');
const router = express.Router();

//GET current user's location
router.get('/self', async (req, res) => {
    try {
        const url = IPINFO_TOKEN
            ? `https://ipinfo.io/json?token=${IPINFO_TOKEN}`
            : `https://ipinfo.io/json`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        console.error("Geo SELF Error:", err.message);
        res.status(500).json({ error: "Unable to retrieve your IP geo info." });
    }
});

//GET location for specific IP
router.get('/ip/:ip', async (req, res) => {
    const { ip } = req.params;

    try {
        const url = IPINFO_TOKEN
            ? `https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`
            : `https://ipinfo.io/${ip}/json`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        console.error("Geo IP Error:", err.message);
        res.status(500).json({ error: "Unable to retrieve geo info for this IP." });
    }
});

module.exports = router;
