const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const restaurantMiddleware = require('../middleware/restaurantMiddleware');

router.use(authMiddleware);
router.use(restaurantMiddleware);

router.post('/products', restaurantController.addProduct);
router.get('/orders', restaurantController.getOrders);
router.put('/orders/:id/status', restaurantController.updateOrderStatus);

module.exports = router;