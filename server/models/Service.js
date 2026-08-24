const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cleaning', 'maintenance', 'others']
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviewCount: {
    type: Number,
    default: 150
  },
  image: {
    type: String,
    default: ''
  },
  benefits: [String],
  inclusions: [String]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
