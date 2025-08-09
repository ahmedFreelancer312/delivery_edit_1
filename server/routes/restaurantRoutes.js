const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get restaurant dashboard
// @route   GET /api/restaurants/dashboard
// @access  Private
router.get('/dashboard', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Get orders statistics
  const totalOrders = await Order.countDocuments({ restaurant: restaurant._id });
  const pendingOrders = await Order.countDocuments({ 
    restaurant: restaurant._id, 
    status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
  });
  const completedOrders = await Order.countDocuments({ 
    restaurant: restaurant._id, 
    status: 'delivered' 
  });
  
  // Get revenue statistics
  const orders = await Order.find({ restaurant: restaurant._id, status: 'delivered' });
  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const averageOrderValue = totalRevenue / completedOrders || 0;

  // Get recent orders
  const recentOrders = await Order.find({ restaurant: restaurant._id })
    .sort('-createdAt')
    .limit(5)
    .populate('customer', 'name phone')
    .populate('items.product', 'name price');

  res.status(200).json({
    success: true,
    data: {
      restaurant,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue
      },
      recentOrders
    }
  });
}));

// @desc    Get restaurant products
// @route   GET /api/restaurants/products
// @access  Private
router.get('/products', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const products = await Product.find({ restaurant: restaurant._id });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
}));

// @desc    Add new product
// @route   POST /api/restaurants/products
// @access  Private
router.post('/products', protect, authorize('restaurant'), validateProduct, asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Add restaurant to req.body
  req.body.restaurant = restaurant._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
}));

// @desc    Update product
// @route   PUT /api/restaurants/products/:id
// @access  Private
router.put('/products/:id', protect, authorize('restaurant'), validateProduct, asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Make sure product belongs to restaurant
  if (product.restaurant.toString() !== restaurant._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
}));

// @desc    Delete product
// @route   DELETE /api/restaurants/products/:id
// @access  Private
router.delete('/products/:id', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Make sure product belongs to restaurant
  if (product.restaurant.toString() !== restaurant._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}));

// @desc    Toggle product availability
// @route   PUT /api/restaurants/products/:id/toggle
// @access  Private
router.put('/products/:id/toggle', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Make sure product belongs to restaurant
  if (product.restaurant.toString() !== restaurant._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    { available: !product.available },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: product
  });
}));

// @desc    Get restaurant orders
// @route   GET /api/restaurants/orders
// @access  Private
router.get('/orders', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const orders = await Order.find({ restaurant: restaurant._id })
    .populate('customer', 'name phone addresses')
    .populate('driver', 'name phone vehicleType vehicleColor')
    .populate('items.product', 'name price image')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
}));

// @desc    Get single order
// @route   GET /api/restaurants/orders/:id
// @access  Private
router.get('/orders/:id', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const order = await Order.findById(req.params.id)
    .populate('customer', 'name phone addresses')
    .populate('driver', 'name phone vehicleType vehicleColor')
    .populate('items.product', 'name price image');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure order belongs to restaurant
  if (order.restaurant.toString() !== restaurant._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Update order status
// @route   PUT /api/restaurants/orders/:id/status
// @access  Private
router.put('/orders/:id/status', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  let order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure order belongs to restaurant
  if (order.restaurant.toString() !== restaurant._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this order');
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Get restaurant analytics
// @route   GET /api/restaurants/analytics
// @access  Private
router.get('/analytics', protect, authorize('restaurant'), asyncHandler(async (req, res) => {
  // Get restaurant owned by logged in user
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Get date range from query parameters
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  
  const endDate = req.query.endDate
    ? new Date(req.query.endDate)
    : new Date();

  // Get orders within date range
  const orders = await Order.find({
    restaurant: restaurant._id,
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'delivered'
  }).populate('items.product', 'name price');

  // Calculate sales data
  const salesData = [];
  const dailySales = {};
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    
    if (!dailySales[date]) {
      dailySales[date] = 0;
    }
    
    dailySales[date] += order.subtotal;
  });

  // Convert daily sales to array
  Object.keys(dailySales).forEach(date => {
    salesData.push({
      date,
      sales: dailySales[date]
    });
  });

  // Sort by date
  salesData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get top products
  const productSales = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product._id]) {
        productSales[item.product._id] = {
          name: item.product.name,
          orders: 0,
          revenue: 0
        };
      }
      
      productSales[item.product._id].orders += item.quantity;
      productSales[item.product._id].revenue += item.price * item.quantity;
    });
  });

  // Convert to array and sort by revenue
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate order statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  res.status(200).json({
    success: true,
    data: {
      salesData,
      topProducts,
      orderStats: {
        totalOrders,
        totalRevenue,
        averageOrderValue
      }
    }
  });
}));

module.exports = router;