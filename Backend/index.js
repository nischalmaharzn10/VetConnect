import express from "express";
import { PORT, mongoDBRUL } from "./config.js";
import mongoose from "mongoose";
import Client from "./models/Client.js"; // Import the Client model

const app = express();

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VetConnect");
});

// Route to Add a New Client
app.post("/add-client", async (req, res) => {
  try {
    const { petName, animalType, breed, birthDate, ownerName } = req.body;

    // Validate required fields
    if (!petName || !animalType || !breed || !birthDate || !ownerName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new client entry
    const newClient = new Client({
      petName,
      animalType,
      breed,
      birthDate: new Date(birthDate), // Ensure birthDate is stored as Date
      ownerName,
    });

    // Save to MongoDB
    await newClient.save();
    res.status(201).json({ message: "Client added successfully!", client: newClient });
  } catch (error) {
    res.status(500).json({ error: "Error adding client", details: error.message });
  }
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
