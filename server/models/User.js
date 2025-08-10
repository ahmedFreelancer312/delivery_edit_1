const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'restaurant', 'driver', 'admin'],
    default: 'customer'
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending'
  },
  profile: {
    name: String,
    phone: String,
    address: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);