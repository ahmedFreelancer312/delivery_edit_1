require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));