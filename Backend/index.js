import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import CORS
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminroutes.js"; // Ensure correct case
import vetRoutes from "./routes/vetRoutes.js";
import { PORT, mongoDBURL, JWT_SECRET } from './config.js';  // Corrected import name

const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vets", vetRoutes);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VetConnect");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)  // Use mongoDBURL instead of mongoDBRUL
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5555', // Change to your backend port
    },
  },
};
