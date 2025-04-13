import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
import { bookingRoute } from './routes/bookingRoute.js';
import agentRoutes from './routes/agentRoutes.js'; // ✅ Use default import (No `{}`)
import { messageRoute } from './routes/messageRoute.js';
import chatbotRoutes from './routes/chatbot.js'; // ✅ Correct path

// Load environment variables
dotenv.config();




const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Database connection
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process if database connection fails
  });

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);
app.use('/api/booking', bookingRoute);
app.use('/api/agents', agentRoutes); // ✅ Use correctly
app.use('/api/messages', messageRoute);
app.use('/api/chatbot', chatbotRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});