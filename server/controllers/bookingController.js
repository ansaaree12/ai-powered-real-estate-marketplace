import { Booking } from '../models/Booking.js';

const bookVisitHandler = async (req, res) => {
  try {
    const { email, date } = req.body; // Get data from the request body
    const { propertyId } = req.params; // Get the propertyId from the URL

    console.log(`Booking visit for property ${propertyId} on ${date} by ${email}`);

    const newBooking = new Booking({
      propertyId,
      email,
      date: new Date(date), // Ensure the date is properly formatted
    });

    await newBooking.save();

    res.status(200).json({ message: "Visit booked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error while booking visit" });
  }
};

const removeBookingHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const booking = await Booking.findOneAndDelete({ _id: id, email });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`Booking ${id} removed successfully for email ${email}`);
    res.status(200).json({ message: "Booking removed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while removing booking" });
  }
};

export { bookVisitHandler, removeBookingHandler };
