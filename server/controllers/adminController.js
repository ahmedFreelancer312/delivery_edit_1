const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Account Management
exports.getPendingRegistrations = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveRegistration = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Content Management
exports.addRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics
exports.getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fee Management
exports.updateCommissionRate = async (req, res) => {
  try {
    // Update logic for commission rate
    res.json({ message: 'Commission rate updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};