const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all restaurants
// @route   GET /api/customers/restaurants
// @access  Public
router.get('/restaurants', asyncHandler(async (req, res) => {
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Restaurant.find(JSON.parse(queryStr)).populate('owner', 'name email phone');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Restaurant.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const restaurants = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: restaurants.length,
    pagination,
    data: restaurants
  });
}));

// @desc    Get single restaurant
// @route   GET /api/customers/restaurants/:id
// @access  Public
router.get('/restaurants/:id', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email phone');

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
}));

// @desc    Get restaurant products
// @route   GET /api/customers/restaurants/:id/products
// @access  Public
router.get('/restaurants/:id/products', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const products = await Product.find({ restaurant: req.params.id, available: true });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
}));

// @desc    Create new order
// @route   POST /api/customers/orders
// @access  Private
router.post('/orders', protect, authorize('customer'), asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.customer = req.user.id;

  const order = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });
}));

// @desc    Get logged in customer orders
// @route   GET /api/customers/orders
// @access  Private
router.get('/orders', protect, authorize('customer'), asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user.id })
    .populate('restaurant', 'name address deliveryFee deliveryTime')
    .populate('driver', 'name phone vehicleType vehicleColor')
    .populate('items.product', 'name price image');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
}));

// @desc    Get single order
// @route   GET /api/customers/orders/:id
// @access  Private
router.get('/orders/:id', protect, authorize('customer'), asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name address deliveryFee deliveryTime')
    .populate('driver', 'name phone vehicleType vehicleColor')
    .populate('items.product', 'name price image');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Make sure user is order owner
  if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

module.exports = router;