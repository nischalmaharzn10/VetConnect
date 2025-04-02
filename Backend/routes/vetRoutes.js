import express from 'express';
import { registerVet, getVets, getVetById } from '../controllers/vetController.js';

const vetRouter = express.Router();

vetRouter.post("/", registerVet);
vetRouter.get("/", getVets);  // Fetch all vets
vetRouter.get("/:id", getVetById);  // Fetch a single vet by ID

export default vetRouter;
