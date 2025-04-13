import asyncHandler from 'express-async-handler';
import { prisma } from "../config/prismaConfig.js";

// Create user function
export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");
  let { email } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "user registered successfully",
      user: user,
    });
  } else {
    res.status(201).send({ message: 'user already registered' });
  }
});

// Function to book a visit for a user
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { propertyId } = req.params;  // propertyId is from the URL

  // Ensure that email, propertyId, and date are all provided
  if (!email || !propertyId || !date) {
    return res.status(400).json({ error: "Missing email, propertyId, or date" });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },  // Only fetch the booked visits
    });

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the visit for the given propertyId already exists
    const visitExists = user.bookedVisits.some(visit => visit.propertyId === propertyId);

    if (visitExists) {
      return res.status(400).json({ message: "This residency is already booked by you" });
    }

    // If not booked, update the user with the new visit
    await prisma.user.update({
      where: { email },
      data: {
        bookedVisits: {
          push: { propertyId, date },
        },
      },
    });

    res.status(200).json({ message: "Your visit is booked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred while booking your visit" });
  }
});


// Function to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).json({ bookedVisits: user.bookedVisits });  // Send as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle error and return JSON response
  }
});

// Function to cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id: propertyId } = req.params;   // Residency ID from URL (propertyId)

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // Find the index of the booking for this property
    const index = user.bookedVisits.findIndex(visit => visit.propertyId === propertyId);

    if (index === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Remove the booking from bookedVisits array
    user.bookedVisits.splice(index, 1);

    // Update the user's bookedVisits in the database
    await prisma.user.update({
      where: { email },
      data: {
        bookedVisits: user.bookedVisits,
      },
    });

    return res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while canceling the booking" });
  }
});

// Function to add a residency to a user's favorites
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Function to get all favorites of a user
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).json({ favResidenciesID: favResd.favResidenciesID });  // Send as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle error and return JSON response
  }
});