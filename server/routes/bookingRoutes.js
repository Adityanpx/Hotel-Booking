import express from 'express';
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Check availability of a room before booking
bookingRouter.post('/check-availability', checkAvailabilityAPI);

// Create a booking (only for logged-in users)
bookingRouter.post('/book', protect, createBooking);

// Get all bookings for a user
bookingRouter.get('/user', protect, getUserBookings);

// Get all bookings for a hotel (hotel owner only)
bookingRouter.get('/hotel', protect, getHotelBookings);

export default bookingRouter;
