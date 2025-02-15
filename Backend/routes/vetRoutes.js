import express from "express";
import { authenticate, authorize } from "../middleware/authmiddleware.js";  // Import middleware
import { registerVet } from "../controllers/vetController.js";  // Import vet controller

const router = express.Router();

// Register Vet
router.post("/api/vets/register", registerVet);

// More routes for vet-specific functionality

export default router;
