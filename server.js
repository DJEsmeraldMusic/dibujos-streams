const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://lab.fronteraespecial.com', // Permitir tu dominio
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Servir archivos estáticos (opcional, si alojas el frontend en Render)
app.use(express.static(path.join(__dirname, 'public')));

// Manejar conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 10000; // Cambiado de 3000 a 10000
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
