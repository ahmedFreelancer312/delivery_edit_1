const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');

// @desc    Get driver dashboard
// @route   GET /api/drivers/dashboard
// @access  Private
router.get('/dashboard', protect, authorize('driver'), asyncHandler(async (req, res) => {
  // Get available orders (ready and not assigned to a driver)
  const availableOrders = await Order.find({
    status: 'ready',
    driver: null
  })
    .populate('restaurant', 'name address')
    .populate('customer', 'name phone')
    .populate('items.product', 'name price')
    .sort('createdAt');

  // Get current order (orders that are picked_up or delivering and assigned to this driver)
  const currentOrder = await Order.findOne({
    driver: req.user.id,
    status: { $in: ['picked_up', 'delivering'] }
  })
    .populate('restaurant', 'name address')
    .populate('customer', 'name phone addresses')
    .populate('items.product', 'name price');

  // Get driver statistics
  const completedOrders = await Order.countDocuments({
    driver: req.user.id,
    status: 'delivered'
  });

  const orders = await Order.find({
    driver: req.user.id,
    status: 'delivered'
  });

  const totalEarnings = orders.reduce((sum, order) => sum + order.deliveryFee, 0);
  const averageDeliveryTime = 25; // In a real app, you would calculate this from actual delivery times

  res.status(200).json({
    success: true,
    data: {
      availableOrders,
      currentOrder,
      stats: {
        completedOrders,
        totalEarnings,
        averageDeliveryTime
      }
    }
  });
}));

// @desc    Get driver orders
// @route   GET /api/drivers/orders
// @access  Private
router.get('/orders', protect, authorize('driver'), asyncHandler(async (req, res) => {
  const orders = await Order.find({ driver: req.user.id })
    .populate('restaurant', 'name address')
    .populate('customer', 'name phone addresses')
    .populate('items.product', 'name price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
}));

// @desc    Get single order
// @route   GET /api/drivers/orders/:id
// @access  Private
router.get('/orders/:id', protect, authorize('driver'), asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name address')
    .populate('customer', 'name phone addresses')
    .populate('items.product', 'name price');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure order belongs to driver or is available
  if (order.driver && order.driver.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Accept order
// @route   PUT /api/drivers/orders/:id/accept
// @access  Private
router.put('/orders/:id/accept', protect, authorize('driver'), asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure order is ready and not assigned to a driver
  if (order.status !== 'ready' || order.driver) {
    res.status(400);
    throw new Error('Order is not available for acceptance');
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      driver: req.user.id,
      status: 'picked_up'
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Update order status
// @route   PUT /api/drivers/orders/:id/status
// @access  Private
router.put('/orders/:id/status', protect, authorize('driver'), asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure order belongs to driver
  if (order.driver.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this order');
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  // If order is delivered, set actual delivery time
  if (req.body.status === 'delivered') {
    order.actualDeliveryTime = Date.now();
    await order.save();
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Get driver earnings
// @route   GET /api/drivers/earnings
// @access  Private
router.get('/earnings', protect, authorize('driver'), asyncHandler(async (req, res) => {
  // Get date range from query parameters
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  
  const endDate = req.query.endDate
    ? new Date(req.query.endDate)
    : new Date();

  // Get orders within date range
  const orders = await Order.find({
    driver: req.user.id,
    status: 'delivered',
    createdAt: { $gte: startDate, $lte: endDate }
  });

  // Calculate earnings data
  const earningsData = [];
  const dailyEarnings = {};
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    
    if (!dailyEarnings[date]) {
      dailyEarnings[date] = 0;
    }
    
    dailyEarnings[date] += order.deliveryFee;
  });

  // Convert daily earnings to array
  Object.keys(dailyEarnings).forEach(date => {
    earningsData.push({
      date,
      earnings: dailyEarnings[date]
    });
  });

  // Sort by date
  earningsData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate earnings statistics
  const totalEarnings = orders.reduce((sum, order) => sum + order.deliveryFee, 0);
  const totalOrders = orders.length;
  const averageEarningsPerOrder = totalOrders > 0 ? totalEarnings / totalOrders : 0;

  res.status(200).json({
    success: true,
    data: {
      earningsData,
      totalEarnings,
      totalOrders,
      averageEarningsPerOrder
    }
  });
}));

module.exports = router;