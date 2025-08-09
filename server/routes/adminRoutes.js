const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const { validateRestaurantRegistration, validateDriverRegistration } = require('../middleware/validation');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private
router.get('/dashboard', protect, authorize('admin'), asyncHandler(req, res) => {
  // Get user statistics
  const totalUsers = await User.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalRestaurants = await User.countDocuments({ role: 'restaurant' });
  const totalDrivers = await User.countDocuments({ role: 'driver' });
  
  // Get pending restaurants and drivers
  const pendingRestaurants = await Restaurant.countDocuments({ status: 'pending' });
  const pendingDrivers = await User.countDocuments({ role: 'driver', status: 'pending' });

  // Get order statistics
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ status: 'delivered' });
  
  // Get revenue statistics
  const orders = await Order.find({ status: 'delivered' });
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('customer', 'name')
    .populate('restaurant', 'name');

  // Get recent users
  const recentUsers = await User.find()
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      userStats: {
        totalUsers,
        totalCustomers,
        totalRestaurants,
        totalDrivers,
        pendingRestaurants,
        pendingDrivers
      },
      orderStats: {
        totalOrders,
        completedOrders,
        totalRevenue
      },
      recentOrders,
      recentUsers
    }
  });
}));

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private
router.get('/users', protect, authorize('admin'), asyncHandler(async (req, res) => {
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
  let query = User.find(JSON.parse(queryStr)).select('-password');

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
  const total = await User.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const users = await query;

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
    count: users.length,
    pagination,
    data: users
  });
}));

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private
router.get('/users/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
}));

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private
router.put('/users/:id/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
}));

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private
router.delete('/users/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}));

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private
router.get('/restaurants', protect, authorize('admin'), asyncHandler(async (req, res) => {
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
// @route   GET /api/admin/restaurants/:id
// @access  Private
router.get('/restaurants/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
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

// @desc    Create restaurant
// @route   POST /api/admin/restaurants
// @access  Private
router.post('/restaurants', protect, authorize('admin'), validateRestaurantRegistration, asyncHandler(async (req, res) => {
  // Create user for restaurant owner
  const { name, email, phone, password, ...restaurantData } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'restaurant',
    status: 'active'
  });

  // Create restaurant
  const restaurant = await Restaurant.create({
    ...restaurantData,
    owner: user._id,
    status: 'active'
  });

  res.status(201).json({
    success: true,
    data: restaurant
  });
}));

// @desc    Update restaurant
// @route   PUT /api/admin/restaurants/:id
// @access  Private
router.put('/restaurants/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email phone');

  res.status(200).json({
    success: true,
    data: restaurant
  });
}));

// @desc    Update restaurant status
// @route   PUT /api/admin/restaurants/:id/status
// @access  Private
router.put('/restaurants/:id/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate('owner', 'name email phone');

  // Update user status as well
  await User.findByIdAndUpdate(
    restaurant.owner._id,
    { status: req.body.status }
  );

  res.status(200).json({
    success: true,
    data: restaurant
  });
}));

// @desc    Delete restaurant
// @route   DELETE /api/admin/restaurants/:id
// @access  Private
router.delete('/restaurants/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Delete restaurant owner
  await User.findByIdAndDelete(restaurant.owner._id);

  // Delete restaurant products
  await Product.deleteMany({ restaurant: restaurant._id });

  await restaurant.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}));

// @desc    Get all drivers
// @route   GET /api/admin/drivers
// @access  Private
router.get('/drivers', protect, authorize('admin'), asyncHandler(async (req, res) => {
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
  let query = User.find({ ...JSON.parse(queryStr), role: 'driver' }).select('-password');

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
  const total = await User.countDocuments({ ...JSON.parse(queryStr), role: 'driver' });

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const drivers = await query;

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
    count: drivers.length,
    pagination,
    data: drivers
  });
}));

// @desc    Get single driver
// @route   GET /api/admin/drivers/:id
// @access  Private
router.get('/drivers/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const driver = await User.findOne({ _id: req.params.id, role: 'driver' }).select('-password');

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  // Get driver statistics
  const orders = await Order.find({ driver: driver._id, status: 'delivered' });
  const totalOrders = orders.length;
  const totalEarnings = orders.reduce((sum, order) => sum + order.deliveryFee, 0);

  res.status(200).json({
    success: true,
    data: {
      driver,
      stats: {
        totalOrders,
        totalEarnings
      }
    }
  });
}));

// @desc    Create driver
// @route   POST /api/admin/drivers
// @access  Private
router.post('/drivers', protect, authorize('admin'), validateDriverRegistration, asyncHandler(async (req, res) => {
  const { name, email, phone, password, vehicleType, vehicleColor, licenseNumber } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'driver',
    status: 'active',
    vehicleType,
    vehicleColor,
    licenseNumber
  });

  res.status(201).json({
    success: true,
    data: user
  });
}));

// @desc    Update driver
// @route   PUT /api/admin/drivers/:id
// @access  Private
router.put('/drivers/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let driver = await User.findOne({ _id: req.params.id, role: 'driver' });

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  driver = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'driver' },
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: driver
  });
}));

// @desc    Update driver status
// @route   PUT /api/admin/drivers/:id/status
// @access  Private
router.put('/drivers/:id/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let driver = await User.findOne({ _id: req.params.id, role: 'driver' });

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  driver = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'driver' },
    { status: req.body.status },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: driver
  });
}));

// @desc    Delete driver
// @route   DELETE /api/admin/drivers/:id
// @access  Private
router.delete('/drivers/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const driver = await User.findOne({ _id: req.params.id, role: 'driver' });

  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  await driver.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}));

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private
router.get('/orders', protect, authorize('admin'), asyncHandler(async (req, res) => {
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
  let query = Order.find(JSON.parse(queryStr))
    .populate('customer', 'name phone')
    .populate('restaurant', 'name')
    .populate('driver', 'name phone');

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
  const total = await Order.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const orders = await query;

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
    count: orders.length,
    pagination,
    data: orders
  });
}));

// @desc    Get single order
// @route   GET /api/admin/orders/:id
// @access  Private
router.get('/orders/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name phone addresses')
    .populate('restaurant', 'name address')
    .populate('driver', 'name phone vehicleType vehicleColor')
    .populate('items.product', 'name price image');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private
router.get('/analytics', protect, authorize('admin'), asyncHandler(async (req, res) => {
  // Get date range from query parameters
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  
  const endDate = req.query.endDate
    ? new Date(req.query.endDate)
    : new Date();

  // Get user statistics
  const usersStats = {
    total: await User.countDocuments(),
    customers: await User.countDocuments({ role: 'customer' }),
    restaurants: await User.countDocuments({ role: 'restaurant' }),
    drivers: await User.countDocuments({ role: 'driver' }),
    newUsers: []
  };

  // Get new users by day
  const newUsersByDay = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        customers: { $sum: { $cond: { if: { $eq: ['$role', 'customer'] }, 1, 0 } } },
        restaurants: { $sum: { $cond: { if: { $eq: ['$role', 'restaurant'] }, 1, 0 } } },
        drivers: { $sum: { $cond: { if: { $eq: ['$role', 'driver'] }, 1, 0 } } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  usersStats.newUsers = newUsersByDay.map(day => ({
    date: day._id,
    customers: day.customers,
    restaurants: day.restaurants,
    drivers: day.drivers
  }));

  // Get order statistics
  const ordersStats = {
    total: await Order.countDocuments(),
    completed: await Order.countDocuments({ status: 'delivered' }),
    cancelled: await Order.countDocuments({ status: { $in: ['rejected', 'cancelled'] } }),
    averageOrderValue: 0,
    ordersByStatus: [],
    ordersByDay: [],
    ordersByMonth: []
  };

  // Calculate average order value
  const completedOrders = await Order.find({ status: 'delivered' });
  if (completedOrders.length > 0) {
    ordersStats.averageOrderValue = completedOrders.reduce((sum, order) => sum + order.total, 0) / completedOrders.length;
  }

  // Get orders by status
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  ordersStats.ordersByStatus = ordersByStatus.map(status => ({
    status: status._id,
    count: status.count
  }));

  // Get orders by day
  const ordersByDay = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  ordersStats.ordersByDay = ordersByDay.map(day => ({
    date: day._id,
    count: day.count
  }));

  // Get orders by month
  const ordersByMonth = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  ordersStats.ordersByMonth = ordersByMonth.map(month => ({
    month: month._id,
    count: month.count
  }));

  // Get revenue statistics
  const revenueStats = {
    total: completedOrders.reduce((sum, order) => sum + order.total, 0),
    byMonth: [],
    byRestaurant: [],
    byPaymentMethod: []
  };

  // Get revenue by month
  const revenueByMonth = await Order.aggregate([
    {
      $match: {
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$total' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  revenueStats.byMonth = revenueByMonth.map(month => ({
    month: month._id,
    revenue: month.revenue
  }));

  // Get revenue by restaurant
  const revenueByRestaurant = await Order.aggregate([
    {
      $match: {
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: '$restaurant',
        revenue: { $sum: '$subtotal' }
      }
    },
    {
      $sort: { revenue: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: '_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        name: '$restaurant.name',
        revenue: 1
      }
    }
  ]);

  revenueStats.byRestaurant = revenueByRestaurant;

  // Get revenue by payment method
  const revenueByPaymentMethod = await Order.aggregate([
    {
      $match: {
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: '$paymentMethod',
        revenue: { $sum: '$total' }
      }
    }
  ]);

  revenueStats.byPaymentMethod = revenueByPaymentMethod.map(method => ({
    method: method._id,
    revenue: method.revenue
  }));

  // Get top restaurants
  const topRestaurants = await Order.aggregate([
    {
      $match: {
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: '$restaurant',
        orders: { $sum: 1 },
        revenue: { $sum: '$subtotal' }
      }
    },
    {
      $sort: { orders: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: '_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        name: '$restaurant.name',
        orders: 1,
        rating: '$restaurant.rating'
      }
    }
  ]);

  // Get top products
  const topProducts = await Order.aggregate([
    {
      $unwind: '$items'
    },
    {
      $match: {
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: '$items.product',
        orders: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    {
      $sort: { orders: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },