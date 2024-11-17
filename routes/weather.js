const express = require('express');
const axios = require('axios');
const Search = require('../models/search');
const router = express.Router();

// Fetch weather data and store recent searches
router.get('/', async (req, res) => {
    const apiKey = 'e884e49500a94e69811163154241309'; // WeatherAPI key
    const city = req.query.city;

    try {
        if (!city) {
            const recentSearches = await Search.find().sort({ date: -1 }).limit(5);
            return res.render('index', { weather: null, recentSearches, error: null });
        }

        // Fetch weather data from WeatherAPI
        const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        const weatherData = response.data;

        // Save the search to MongoDB
        await Search.create({ city });

        // Fetch recent searches
        const recentSearches = await Search.find().sort({ date: -1 }).limit(5);

        res.render('index', {
            weather: {
                city: weatherData.location.name,
                temp: weatherData.current.temp_c, // Temperature in Celsius
                desc: weatherData.current.condition.text, // Weather description
            },
            recentSearches,
            error: null,
        });
    } catch (err) {
        console.error(err.message); // Log the error for debugging

        // Fetch recent searches even in case of an error
        const recentSearches = await Search.find().sort({ date: -1 }).limit(5);

        res.render('index', {
            weather: null,
            recentSearches,
            error: 'City not found or API error!',
        });
    }
});

module.exports = router;
