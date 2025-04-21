import express from 'express';
import { createAppointment, getAppointmentsForUser, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/authmiddleware.js'; // Import the middleware
import { getAppointmentsByVetId } from '../controllers/appointmentController.js';
import { updatePrescription } from '../controllers/appointmentController.js';
import { getAppointmentById } from '../controllers/appointmentController.js';
import { upsertPrescription } from '../controllers/prescriptionController.js';
import { getPrescriptionByAppointmentId } from '../controllers/prescriptionController.js';
import { getPetById } from '../controllers/appointmentController.js';
import { getUserById } from '../controllers/appointmentController.js';
import { getBookedTimes } from '../controllers/appointmentController.js';


const appointmentRouter = express.Router();

// Route to create an appointment
appointmentRouter.post('/create', createAppointment); // Only 'user' or 'vet' can create appointments

// Route to get all appointments for a user
appointmentRouter.get('/users/:userId', authenticate, getAppointmentsForUser); // Only authenticated users can view appointments

appointmentRouter.get("/vets/:vetId", getAppointmentsByVetId);  // New route

// Route to update appointment status (Vet can do this)
appointmentRouter.put('/:appointmentId/status', updateAppointmentStatus);

appointmentRouter.put("/:appointmentId/prescription", upsertPrescription);


appointmentRouter.get("/:id", getAppointmentById);

// In routes/prescriptionRoutes.js or wherever your prescription routes are
appointmentRouter.get('/:appointmentId/prescriptionform', getPrescriptionByAppointmentId);


appointmentRouter.get("/pets/:id", getPetById);

appointmentRouter.get('/userinfo/:id', getUserById); // 👈 GET user by ID

// Get booked time slots for a vet on a specific date
appointmentRouter.get('/booked-times/:vetId/:date', getBookedTimes);




export default appointmentRouter;
    