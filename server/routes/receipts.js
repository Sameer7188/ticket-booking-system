const express = require('express');
const router = express.Router();
const { getUserReceipts } = require('../controllers/receiptsController');

router.get('/user/:userId', getUserReceipts);

module.exports = router; 