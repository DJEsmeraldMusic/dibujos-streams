document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const clearCanvas = document.getElementById('clearCanvas');
    const socket = io('https://tu-servidor.com'); // Reemplaza con la URL de tu servidor

    // Configurar canvas
    canvas.width = 1280; // Ajusta al tamaño deseado (coincide con el widget)
    canvas.height = 720;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let painting = false;
    let lastX, lastY;

    // Iniciar dibujo
    function startPosition(e) {
        painting = true;
        const rect = canvas.getBoundingClientRect();
        lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
        lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
    }

    // Terminar dibujo
    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    // Dibujar localmente y enviar al servidor
    function draw(e) {
        if (!painting) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Dibujar localmente
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Enviar datos al servidor
        socket.emit('draw', {
            x0: lastX,
            y0: lastY,
            x1: x,
            y1: y,
            color: colorPicker.value,
            lineWidth: brushSize.value
        });

        lastX = x;
        lastY = y;
    }

    // Recibir dibujos de otros usuarios
    socket.on('draw', (data) => {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.lineWidth;
        ctx.beginPath();
        ctx.moveTo(data.x0, data.y0);
        ctx.lineTo(data.x1, data.y1);
        ctx.stroke();
    });

    // Limpiar lienzo
    clearCanvas.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear');
    });

    socket.on('clear', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Eventos del mouse
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // Ajustar canvas al redimensionar
    window.addEventListener('resize', () => {
        canvas.width = 1280;
        canvas.height = 720;
    });
});