const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// POST /api/bookings (create booking) - authenticated users only
router.post('/', authenticate, bookingController.createBooking);

// GET /api/bookings/my - get bookings for logged-in user
router.get('/my', authenticate, bookingController.getMyBookings);

// GET /api/bookings - admin only: view all bookings
router.get('/', authenticate, requireAdmin, bookingController.getAllBookings);

module.exports = router;