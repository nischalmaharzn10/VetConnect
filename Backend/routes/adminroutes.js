import express from "express";
import { authenticate, authorize } from "../middleware/authmiddleware.js";  // Import middleware
import { adminControllerFunction } from "../controllers/adminController.js";  // Your controller

const router = express.Router();

// Admin specific route, access control with authentication and authorization
router.get("/dashboard", authenticate, authorize(["Admin"]), adminControllerFunction);

export default router;
