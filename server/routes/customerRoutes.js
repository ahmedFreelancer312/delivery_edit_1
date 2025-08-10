const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', customerController.register);
router.get('/restaurants', customerController.getRestaurants);

// Protected Routes
router.use(authMiddleware);
router.post('/orders', customerController.createOrder);

module.exports = router;