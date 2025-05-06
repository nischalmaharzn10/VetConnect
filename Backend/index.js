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
import { PORT, mongoDBURL } from './config.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // Join a room (user ID or appointment ID)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`➡️ Socket ${socket.id} joined room: ${roomId}`);
  });

  // Send WebRTC offer
  socket.on('send-offer', (offer, roomId) => {
    console.log(`📡 [${socket.id}] sending offer to room ${roomId}:`, offer);
    socket.to(roomId).emit('receive-offer', offer);
  });

  // Send WebRTC answer
  socket.on('send-answer', (answer, roomId) => {
    console.log(`📡 [${socket.id}] sending answer to room ${roomId}:`, answer);
    socket.to(roomId).emit('receive-answer', answer);
  });

  // Send ICE candidate
  socket.on('send-ice-candidate', (candidate, roomId) => {
    console.log(`❄️ [${socket.id}] sending ICE candidate to room ${roomId}:`, candidate);
    socket.to(roomId).emit('receive-ice-candidate', candidate);
  });

  // Vet invites user to call
  socket.on('invite-call', ({ userId, appointmentId }) => {
    console.log(`📨 [${socket.id}] Inviting user ${userId} for appointment ${appointmentId}`);
    io.to(userId).emit('call-invitation', { userId, appointmentId });
  });

  // User accepts call
  socket.on('accept-call', (roomId) => {
    console.log(`📞 [${socket.id}] accepted call, notifying room ${roomId}`);
    socket.to(roomId).emit('user-accepted-call');
  });

  // Optional: handle decline (if you're emitting it from frontend)
  socket.on('decline-call', (roomId) => {
    console.log(`🚫 [${socket.id}] declined call in room ${roomId}`);
    socket.to(roomId).emit('call-declined');
  });

  // Optional: register user to receive targeted events
  socket.on('register-user', ({ userId }) => {
    socket.join(userId);
    console.log(`👤 Registered user ${userId} on socket ${socket.id}`);
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});


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
