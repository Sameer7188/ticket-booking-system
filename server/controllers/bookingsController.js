const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Receipt = require('../models/Receipt');

exports.createBooking = async (req, res) => {
  try {
    const { userId, showId, seats, total } = req.body;
    if (!userId || !showId || !seats || seats.length === 0) return res.status(400).json({ message: 'Missing booking info' });
    // Mark seats as booked
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    for (const seatNum of seats) {
      const seat = show.seats.find(s => s.seatNumber === seatNum);
      if (!seat || seat.isBooked) return res.status(400).json({ message: `Seat ${seatNum} is already booked` });
      seat.isBooked = true;
    }
    await show.save();
    // Create booking
    const booking = await Booking.create({ user: userId, show: showId, seats, total });
    // Create receipt
    const receipt = await Receipt.create({ user: userId, booking: booking._id, amount: total });
    res.status(201).json({ message: 'Booking successful', booking, receipt });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('show');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
}; 