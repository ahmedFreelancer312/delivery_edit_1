const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number,
  deliveryFee: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready_for_delivery', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);