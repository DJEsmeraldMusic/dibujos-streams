const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://lab.fronteraespacial.com', // Allow your frontend origin
    methods: ['GET', 'POST'],
  },
});

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://lab.fronteraespacial.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// Socket.IO connection handling (example)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(10000, () => {
  console.log('Servidor corriendo en puerto 10000');
});
