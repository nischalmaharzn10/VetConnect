import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import vetRouter from './routes/vetRoutes.js';
import authRouter from './routes/authroutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import { PORT, mongoDBURL } from './config.js';
import petRouter from "./routes/petRoutes.js";

const app = express();

// Increase payload limit (Adjust as needed)
app.use(express.json({ limit: "10mb" }));  // Set JSON request size limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));  // Set URL-encoded request size limit
app.use(cors());

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/users", userRouter);
app.use("/api/vets", vetRouter);
app.use("/api/auth", authRouter);  
app.use("/api/appointments", appointmentRouter);  
app.use("/api/pets", petRouter);


// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VetConnect");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
