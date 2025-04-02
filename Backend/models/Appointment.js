import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet',
    required: true,
  },
  appointmentDate: {
    type: Date,  
    required: true,
  },
  scheduledTime: {
    type: String,  
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ['pending', 'scheduled', 'cancelled'],
  //   default: 'pending',
  // },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema,'appointments');
export default Appointment;
