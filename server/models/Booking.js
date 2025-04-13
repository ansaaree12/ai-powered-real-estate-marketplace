import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

export { Booking };