const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['مطاعم', 'سوبر ماركت', 'حلويات', 'مقاهي', 'مخبز']
  },
  image: {
    type: String,
    default: 'default-restaurant.jpg'
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Please add a delivery fee'],
    min: [0, 'Delivery fee cannot be negative']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Please add a delivery time'],
    min: [1, 'Delivery time must be at least 1 minute']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for products
restaurantSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

// Virtual for orders
restaurantSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

module.exports = mongoose.model('Restaurant', restaurantSchema);