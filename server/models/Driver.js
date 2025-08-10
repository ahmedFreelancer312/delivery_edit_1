const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  licenseNumber: String,
  vehicle: {
    type: String,
    enum: ['bike', 'car', 'motorcycle']
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);