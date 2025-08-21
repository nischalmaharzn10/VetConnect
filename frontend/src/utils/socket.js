// utils/socket.js
import io from "socket.io-client";

const socket = io("http://localhost:5555", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;