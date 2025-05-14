import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/userRoutes.js';
import vetRouter from './routes/vetRoutes.js';
import authRouter from './routes/authroutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import petRouter from './routes/petRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import { PORT, mongoDBURL } from './config.js';

import setupSocket from './socket/VideoCallSocket.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Setup socket logic
setupSocket(io);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/users', userRouter);
app.use('/api/vets', vetRouter);
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/pets', petRouter);
app.use('/api/payments', paymentRouter);

// Health check
app.get('/health', (_, res) => res.status(200).send('OK'));
app.get('/', (_, res) => res.send('Welcome to VetConnect'));

// MongoDB connection
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('✅ MongoDB Connected');
    httpServer.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
  })
  .catch(err => console.error('❌ DB connection error:', err));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Gracefully shutting down');
  await mongoose.disconnect();
  httpServer.close(() => process.exit(0));
});

// Global error logging
process.on('unhandledRejection', err => console.error('🔴 Unhandled Promise Rejection:', err));
process.on('uncaughtException', err => console.error('🔴 Uncaught Exception:', err));
