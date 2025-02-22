import express from 'express';
import { registerVet } from '../controllers/vetController.js'; // Import register controller

const vetRouter = express.Router();

// Register Vet Route
vetRouter.post("/", registerVet);

export default vetRouter; // Correct export name
