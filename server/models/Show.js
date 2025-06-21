const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  isBooked: { type: Boolean, default: false },
});

const castSchema = new mongoose.Schema({
  name: String,
  image: String,
}, { _id: false });

const showSchema = new mongoose.Schema({
  title: String,
  description: String,
  details: String,
  poster: String,
  seats: [seatSchema],
  cast: [castSchema],
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema); 