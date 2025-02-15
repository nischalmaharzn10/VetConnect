import express from 'express';
import { registerUser } from '../controllers/userController.js';  // Import register controller

const userRouter = express.Router();

// Register User Route
userRouter.post("/", registerUser);

export default userRouter;  // Correct export name
