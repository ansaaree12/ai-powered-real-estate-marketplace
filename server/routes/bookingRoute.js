import express from 'express';
import { bookVisitHandler, removeBookingHandler } from '../controllers/bookingController.js';

const router = express.Router();

// Define routes for booking and removing visits
router.post('/bookVisit/:propertyId', bookVisitHandler);
router.post('/removeBooking/:id', removeBookingHandler);

export { router as bookingRoute };
