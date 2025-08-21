const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = ['https://lab.fronteraespecial.com', 'https://lab.fronteraespecial.com/streams'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        },
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

const PORT = process.env.PORT || 10000; // Puerto configurado a 10000
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
