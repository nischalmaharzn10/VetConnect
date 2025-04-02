import express from 'express';
import { createAppointment, getAppointmentsForUser, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/authmiddleware.js'; // Import the middleware

const appointmentRouter = express.Router();

// Route to create an appointment
appointmentRouter.post('/create', createAppointment); // Only 'user' or 'vet' can create appointments

// Route to get all appointments for a user
appointmentRouter.get('/users/:userId', authenticate, getAppointmentsForUser); // Only authenticated users can view appointments

// Route to update appointment status (only accessible by admins)
appointmentRouter.put('/update-status', authenticate, authorize(['admin']), updateAppointmentStatus); // Only 'admin' can update appointment status

export default appointmentRouter;
