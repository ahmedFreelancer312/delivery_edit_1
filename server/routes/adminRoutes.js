const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

// Account Management
router.get('/pending-registrations', adminController.getPendingRegistrations);
router.put('/approve-registration/:id', adminController.approveRegistration);

// Content Management
router.post('/restaurants', adminController.addRestaurant);

// Analytics
router.get('/analytics/orders', adminController.getOrderAnalytics);

// Fee Management
router.put('/fees/commission', adminController.updateCommissionRate);

module.exports = router;