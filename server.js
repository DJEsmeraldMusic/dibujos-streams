const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://lab.fronteraespecial.com', // Permitir conexiones desde este dominio
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Servir archivos estáticos (opcional, si el frontend no está en lab.fronteraespecial.com)
app.use(express.static(path.join(__dirname, 'public')));

// Manejar conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Retransmitir dibujos
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data); // Enviar a todos los clientes excepto el emisor
    });

    // Limpiar lienzo
    socket.on('clear', () => {
        socket.broadcast.emit('clear'); // Enviar evento de limpieza a todos
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});