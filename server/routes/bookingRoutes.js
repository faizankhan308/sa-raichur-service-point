const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById, updateBookingStatus, getBookingsByPhone } = require('../controllers/bookingController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public booking request creation and tracker lookup routes
router.post('/', createBooking);
router.get('/phone/:phone', getBookingsByPhone);

// Secured routes for admin dashboard controls
router.get('/', protectAdmin, getBookings);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id/status', protectAdmin, updateBookingStatus);

module.exports = router;
