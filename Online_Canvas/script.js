window.addEventListener('load', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const brushSizeInput = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    const colorPicker = document.getElementById('color-picker');
    const clearCanvasButton = document.getElementById('clear-canvas');
    const eraserBtn = document.getElementById('eraser-btn');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let brushColor = colorPicker.value;
    let brushSize = brushSizeInput.value;
    let isErasing = false;

    const setCanvasSize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    const draw = (e) => {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = isErasing ? '#ffffff' : brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    brushSizeInput.addEventListener('input', () => {
        brushSizeValue.textContent = brushSizeInput.value;
        brushSize = brushSizeInput.value;
    });

    colorPicker.addEventListener('change', () => {
        brushColor = colorPicker.value;
    });

    clearCanvasButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    eraserBtn.addEventListener('click', () => {
        isErasing = !isErasing;
        eraserBtn.style.backgroundColor = isErasing ? '#3498db' : '#e74c3c';
    });
});