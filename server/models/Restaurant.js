const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['open', 'closed', 'temporarily_closed'],
    default: 'open'
  },
  preparationTime: { type: Number, default: 30 }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);