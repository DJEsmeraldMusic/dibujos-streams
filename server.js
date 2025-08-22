const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://lab.fronteraespacial.com', 'https://streamelements.com'], // Added StreamElements origin
    methods: ['GET', 'POST'],
  },
});

// Serve a default response for favicon to avoid 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://lab.fronteraespacial.com');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST');
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  socket.on('draw', (data) => {
    console.log('Broadcasting draw event:', data); // Debug log
    io.emit('draw', data); // Broadcast to all clients
  });
  socket.on('clear', () => {
    console.log('Broadcasting clear event'); // Debug log
    io.emit('clear'); // Broadcast clear to all
  });
});

server.listen(10000, () => {
  console.log('Servidor corriendo en puerto 10000');
});
