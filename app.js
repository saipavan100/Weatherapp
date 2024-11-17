const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const weatherRoute = require('./routes/weather');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weatherApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.use('/', weatherRoute);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
