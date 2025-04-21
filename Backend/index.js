import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/userRoutes.js';
import vetRouter from './routes/vetRoutes.js';
import authRouter from './routes/authroutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import { PORT, mongoDBURL } from './config.js';
import petRouter from "./routes/petRoutes.js";

const app = express();
const httpServer = createServer(app); // Create HTTP server manually for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Socket.IO setup
let clients = {};

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-room', (appointmentId, userId) => {
    if (!clients[appointmentId]) {
      clients[appointmentId] = [];
    }
    clients[appointmentId].push({ userId, socketId: socket.id });

    socket.join(appointmentId);
    console.log(`User ${userId} joined room ${appointmentId}`);
  });

  socket.on('send-ice-candidate', (candidate, appointmentId) => {
    socket.to(appointmentId).emit('receive-ice-candidate', candidate);
  });

  socket.on('send-offer', (offer, appointmentId) => {
    socket.to(appointmentId).emit('receive-offer', offer);
  });

  socket.on('send-answer', (answer, appointmentId) => {
    socket.to(appointmentId).emit('receive-answer', answer);
  });

  socket.on('accept-call', (appointmentId) => {
    socket.to(appointmentId).emit('user-accepted-call');
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    for (let room in clients) {
      clients[room] = clients[room].filter((client) => client.socketId !== socket.id);
    }
  });
});

// Increase payload limit (Adjust as needed)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Use routes
app.use("/api/users", userRouter);
app.use("/api/vets", vetRouter);
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/pets", petRouter);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VetConnect");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server with Socket.IO is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
