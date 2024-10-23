const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/holidays', require('./routes/holidays'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export app for testing
module.exports = app;
