const canvas = document.getElementById("canvas");
const eraser = document.getElementById('eraser')
const pen = document.getElementById('pen')
const colorPicker = document.getElementById('color-picker')
const penSize = document.getElementById('penSize')
const eraserSlider = document.getElementById('eraserSize')
const selectBtn = document.getElementById('selectBtn')
const context = canvas.getContext("2d");

// disable right clicking
document.oncontextmenu = function () {
    return false;
}

// list of all strokes drawn
const drawings = [];
const eraseRects = [];

// coordinates of our cursor
let cursorX;
let cursorY;
let prevCursorX;
let prevCursorY;

let enablePainting = false
let enableErase = false
let lineWidth = penSize.value;
let eraserSize = eraserSlider.value

// distance from origin
let offsetX = 0;
let offsetY = 0;

// zoom amount
let scale = 1;

// convert coordinates
function toScreenX(xTrue) {
    return (xTrue + offsetX) * scale;
}
function toScreenY(yTrue) {
    return (yTrue + offsetY) * scale;
}
function toTrueX(xScreen) {
    return (xScreen / scale) - offsetX;
}
function toTrueY(yScreen) {
    return (yScreen / scale) - offsetY;
}
function trueHeight() {
    return canvas.clientHeight / scale;
}
function trueWidth() {
    return canvas.clientWidth / scale;
}

function redrawCanvas() {
    // set the canvas to the size of the window
    canvas.width = document.body.clientWidth - 265;
    canvas.height = document.body.clientHeight - 120;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
    }
    for (let i = 0; i < eraseRects.length; i++) {
        const rect = eraseRects[i];
        context.clearRect(toScreenX(rect.x), toScreenY(rect.y), rect.w * scale, rect.h * scale)
    }
}
redrawCanvas();

// if the window changes size, redraw the canvas
window.addEventListener("resize", (event) => {
    redrawCanvas();
});

// Mouse Event Handlers
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('wheel', onMouseWheel, false);

selectBtn.addEventListener('click', () => {
    enableErase = enablePainting = false
    changeColor(selectBtn, pen, eraser)
})

function changeColor(a, b, c) {
    a.classList.remove(a.classList[1])
    a.classList.add('btn-primary')
    b.classList.remove(b.classList[1])
    b.classList.add('btn-secondary')
    c.classList.remove(c.classList[1])
    c.classList.add('btn-secondary')
}

penSize.addEventListener('change', () => {
    lineWidth = penSize.value
})

eraserSlider.addEventListener('change', () => {
    eraserSize = eraserSlider.value
})

pen.addEventListener('click', (e) => {
    changeColor(pen, selectBtn, eraser)
    enablePainting = !enablePainting
    if (enablePainting) enableErase = false
    else {
        pen.classList.remove(pen.classList[1])
        pen.classList.add('btn-secondary')
        selectBtn.classList.remove(pen.classList[1])
        selectBtn.classList.add('btn-primary')
    }
})

eraser.addEventListener('click', () => {
    changeColor(eraser, selectBtn, pen)
    enableErase = !enableErase
    if (enableErase) enablePainting = false
    else {
        eraser.classList.remove(c.classList[1])
        eraser.classList.add('btn-secondary')
        selectBtn.classList.remove(pen.classList[1])
        selectBtn.classList.add('btn-primary')
    }
})


// Touch Event Handlers 
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchcancel', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove);


// mouse functions
let leftMouseDown = false;
let rightMouseDown = false;
function onMouseDown(event) {

    // detect left clicks
    if (event.button == 0) {
        leftMouseDown = true;
        rightMouseDown = false;
    }
    // detect right clicks
    if (event.button == 2) {
        rightMouseDown = true;
        leftMouseDown = false;
    }

    // update the cursor coordinates
    cursorX = event.clientX - canvas.offsetLeft;
    cursorY = event.clientY - canvas.offsetTop;
    prevCursorX = event.clientX - canvas.offsetLeft;
    prevCursorY = event.clientY - canvas.offsetTop;
}
function onMouseMove(event) {
    // get mouse position
    cursorX = event.clientX - canvas.offsetLeft;
    cursorY = event.clientY - canvas.offsetTop;
    const scaledX = toTrueX(cursorX);
    const scaledY = toTrueY(cursorY);
    const prevScaledX = toTrueX(prevCursorX);
    const prevScaledY = toTrueY(prevCursorY);

    if (leftMouseDown && enablePainting) {
        // add the line to our drawing history
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY
        })
        // draw a line
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }
    if (leftMouseDown && enableErase) {
        eraseRects.push({
            x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetLeft,
            w: eraserSize,
            h: eraserSize
        })
        erase(event)
    }
    if (rightMouseDown) {
        // move the screen
        offsetX += (cursorX - prevCursorX) / scale;
        offsetY += (cursorY - prevCursorY) / scale;
        redrawCanvas();
    }
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}
function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;
}
function onMouseWheel(event) {
    const deltaY = event.deltaY;
    const scaleAmount = -deltaY / 500;
    scale = scale * (1 + scaleAmount);

    // zoom the page based on where the cursor is
    var distX = event.pageX / canvas.clientWidth;
    var distY = event.pageY / canvas.clientHeight;

    // calculate how much we need to zoom
    const unitsZoomedX = trueWidth() * scaleAmount;
    const unitsZoomedY = trueHeight() * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    offsetX -= unitsAddLeft;
    offsetY -= unitsAddTop;

    redrawCanvas();
}

function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = colorPicker.value;
    context.lineWidth = lineWidth;
    context.lineCap = "round"
    context.stroke();
}

function erase(event) {
    context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, eraserSize, eraserSize)
}

// touch functions
const prevTouches = [null, null]; // up to 2 touches
let singleTouch = false;
let doubleTouch = false;
function onTouchStart(event) {
    if (event.touches.length == 1) {
        singleTouch = true;
        doubleTouch = false;
    }
    if (event.touches.length >= 2) {
        singleTouch = false;
        doubleTouch = true;
    }

    // store the last touches
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];

}
function onTouchMove(event) {
    // get first touch coordinates
    const touch0X = event.touches[0].pageX;
    const touch0Y = event.touches[0].pageY;
    const prevTouch0X = prevTouches[0].pageX;
    const prevTouch0Y = prevTouches[0].pageY;

    const scaledX = toTrueX(touch0X);
    const scaledY = toTrueY(touch0Y);
    const prevScaledX = toTrueX(prevTouch0X);
    const prevScaledY = toTrueY(prevTouch0Y);

    if (leftMouseDown && enablePainting) {
        // add the line to our drawing history
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY,
        })
        // draw a line
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }
    if (leftMouseDown && enableErase) {
        eraseRects.push({
            x: event.clientX,
            y: event.clientY - 60,
            w: eraserSize,
            h: eraserSize
        })
        erase(event)
    }

    if (singleTouch && enablePainting) {
        // add to history
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY
        })
        drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y);
    }

    if (singleTouch && enableErase) {
        eraseRects.push({
            x: event.clientX,
            y: event.clientY - 60,
            w: eraserSize,
            h: eraserSize
        })
        erase(event)
    }

    if (doubleTouch) {
        // get second touch coordinates
        const touch1X = event.touches[1].pageX;
        const touch1Y = event.touches[1].pageY;
        const prevTouch1X = prevTouches[1].pageX;
        const prevTouch1Y = prevTouches[1].pageY;

        // get midpoints
        const midX = (touch0X + touch1X) / 2;
        const midY = (touch0Y + touch1Y) / 2;
        const prevMidX = (prevTouch0X + prevTouch1X) / 2;
        const prevMidY = (prevTouch0Y + prevTouch1Y) / 2;

        // calculate the distances between the touches
        const hypot = Math.sqrt(Math.pow((touch0X - touch1X), 2) + Math.pow((touch0Y - touch1Y), 2));
        const prevHypot = Math.sqrt(Math.pow((prevTouch0X - prevTouch1X), 2) + Math.pow((prevTouch0Y - prevTouch1Y), 2));

        // calculate the screen scale change
        var zoomAmount = hypot / prevHypot;
        scale = scale * zoomAmount;
        const scaleAmount = 1 - zoomAmount;

        // calculate how many pixels the midpoints have moved in the x and y direction
        const panX = midX - prevMidX;
        const panY = midY - prevMidY;
        // scale this movement based on the zoom level
        offsetX += (panX / scale);
        offsetY += (panY / scale);

        // Get the relative position of the middle of the zoom.
        // 0, 0 would be top left. 
        // 0, 1 would be top right etc.
        var zoomRatioX = midX / canvas.clientWidth;
        var zoomRatioY = midY / canvas.clientHeight;

        // calculate the amounts zoomed from each edge of the screen
        const unitsZoomedX = trueWidth() * scaleAmount;
        const unitsZoomedY = trueHeight() * scaleAmount;

        const unitsAddLeft = unitsZoomedX * zoomRatioX;
        const unitsAddTop = unitsZoomedY * zoomRatioY;

        offsetX += unitsAddLeft;
        offsetY += unitsAddTop;

        redrawCanvas();
    }
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];
}
function onTouchEnd(event) {
    singleTouch = false;
    doubleTouch = false;
}
