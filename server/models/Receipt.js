const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: Number,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema); 