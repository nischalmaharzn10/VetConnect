import express from 'express';
import {
  createAppointment,
  getAppointmentsForUser,
  updateAppointmentStatus,
  getAppointmentsByVetId,
  getAppointmentById,
  getPetById,
  getUserById,
  getBookedTimes
} from '../controllers/appointmentController.js';

import {
  upsertPrescription,
  getPrescriptionByAppointmentId
} from '../controllers/prescriptionController.js';

import { authenticate, authorize } from '../middleware/authmiddleware.js';

const appointmentRouter = express.Router();

// Create an appointment
appointmentRouter.post('/create', createAppointment);

// Get all appointments for a user
appointmentRouter.get('/users/:userId', authenticate, getAppointmentsForUser);

// Get appointments for a vet
appointmentRouter.get('/vets/:vetId', getAppointmentsByVetId);

// Update appointment status
appointmentRouter.put('/:appointmentId/status', updateAppointmentStatus);

// Upsert prescription for an appointment
appointmentRouter.put('/:appointmentId/prescription', upsertPrescription);

// Get appointment by ID
appointmentRouter.get('/:id', getAppointmentById);

// Get prescription form by appointment ID
appointmentRouter.get('/:appointmentId/prescriptionform', getPrescriptionByAppointmentId);

// Get pet by ID
appointmentRouter.get('/pets/:id', getPetById);

// Get user info by ID
appointmentRouter.get('/userinfo/:id', getUserById);

// Get booked time slots for a vet on a specific date
appointmentRouter.get('/booked-times/:vetId/:date', getBookedTimes);

export default appointmentRouter;
