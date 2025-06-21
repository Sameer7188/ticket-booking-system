const Receipt = require('../models/Receipt');

exports.getUserReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.params.userId }).populate('booking');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receipts', error: err.message });
  }
}; 