const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
      }
    }
  ],
  subtotal: {
    type: Number,
    required: [true, 'Please add a subtotal'],
    min: [0, 'Subtotal cannot be negative']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Please add a delivery fee'],
    min: [0, 'Delivery fee cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Please add a total'],
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'picked_up',
      'delivering',
      'delivered',
      'rejected',
      'cancelled'
    ],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please add a delivery address']
  },
  deliveryInstructions: {
    type: String,
    default: ''
  },
  estimatedDeliveryTime: {
    type: Number,
    required: [true, 'Please add an estimated delivery time'],
    min: [1, 'Estimated delivery time must be at least 1 minute']
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);