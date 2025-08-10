const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');
const driverMiddleware = require('../middleware/driverMiddleware');

router.use(authMiddleware);
router.use(driverMiddleware);

router.get('/orders/available', driverController.getAvailableOrders);
router.put('/orders/:id/accept', driverController.acceptOrder);

module.exports = router;