import express from "express";
import { addPet, getUserPets, deletePet } from "../controllers/petController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensure user is authenticated

const petRouter = express.Router();

// Add a new pet
petRouter.post("/", addPet);

// Get all pets of a specific user
petRouter.get("/user/:userId", protect, getUserPets);

// Delete a pet
petRouter.delete("/:petId", protect, deletePet);

export default petRouter;
