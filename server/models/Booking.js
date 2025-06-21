const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [String],
  total: Number,
  status: { type: String, default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 