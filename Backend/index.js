import express from "express";
import { PORT, mongoDBRUL } from "./config.js";
import mongoose from "mongoose";
import Client from "./models/Admin.js"; // Import the Client model

const app = express();

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VetConnect");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBRUL)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
