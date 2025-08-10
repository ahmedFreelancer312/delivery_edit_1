const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
const Order = require('../models/Order');
const generateToken = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password, role: 'customer' });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'approved' });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      customer: req.user._id,
      status: 'pending'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};