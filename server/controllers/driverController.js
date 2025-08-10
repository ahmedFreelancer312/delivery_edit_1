const Order = require('../models/Order');
const Driver = require('../models/Driver');

exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: 'ready_for_delivery',
      driver: null 
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        driver: req.user._id,
        status: 'picked_up'
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};