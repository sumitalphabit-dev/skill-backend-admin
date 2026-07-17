const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api', routes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler MUST be the last middleware
app.use(errorHandler);

module.exports = app;
