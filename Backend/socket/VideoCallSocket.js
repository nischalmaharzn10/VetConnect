// socket/videoCallSocket.js
export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('register-user', ({ userId }) => {
      if (userId) {
        socket.join(userId);
        console.log(`👤 Registered user ${userId} on socket ${socket.id}`);
      }
    });

    socket.on('invite-call', ({ userId, appointmentId }) => {
      console.log(`📨 Inviting user ${userId} to appointment ${appointmentId}`);
      io.to(userId).emit('call-invitation', { userId, appointmentId });
    });

    socket.on('accept-call', (appointmentId) => {
      console.log(`📞 Call accepted for appointment ${appointmentId}`);
      socket.to(appointmentId).emit('user-accepted-call');
    });

    socket.on('join-room', ({ actualApptId, userId }) => {
      if (!actualApptId) {
        console.warn(`⚠️ No appointmentId provided by ${socket.id}`);
        return;
      }

      socket.join(actualApptId);
      console.log(`➡️ Socket ${socket.id} joined room: ${actualApptId}`);

      if (userId) {
        io.to(userId).emit('peer-joined-room', {
          appointmentId: actualApptId,
          joinedBy: socket.id
        });
      }
    });

    socket.on('send-offer', ({ offer, appointmentId }) => {
      socket.to(appointmentId).emit('receive-offer', offer);
    });

    socket.on('send-answer', (answer, appointmentId) => {
      socket.to(appointmentId).emit('receive-answer', answer);
    });

    socket.on('send-ice-candidate', (candidate, appointmentId) => {
      socket.to(appointmentId).emit('receive-ice-candidate', candidate);
    });

    socket.on('decline-call', (appointmentId) => {
      socket.to(appointmentId).emit('call-declined');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
}
