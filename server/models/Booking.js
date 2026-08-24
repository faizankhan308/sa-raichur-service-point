const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  services: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  address: {
    type: String,
    required: true,
    trim: true
  },
  preferredDate: {
    type: String,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    required: true,
    default: 'New',
    enum: ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled']
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
