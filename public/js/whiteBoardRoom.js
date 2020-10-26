const socket = io('/')
const ClientName = document.getElementById('ClientName')
const roomID = document.getElementById('roomID')

// canvas

const canvas = document.getElementById("canvas");
const eraser = document.getElementById('eraser')
const pen = document.getElementById('pen')
const colorPicker = document.getElementById('color-picker')
const penSize = document.getElementById('penSize')
const eraserSlider = document.getElementById('eraserSize')
const selectBtn = document.getElementById('selectBtn')
const saveBtn = document.getElementById('saveDrawings')
const clearBtn = document.getElementById('clearDrawings')
const context = canvas.getContext("2d")

// disable right clicking
document.oncontextmenu = function () {
    return false;
}

// list of all strokes drawn
let drawings = [];

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

let cname = "name", roomid = "roomid", type = "admin", id = 'id'

socket.on('user-joined', (users) => {
    let index = 1
    document.getElementById('pageSubmenu').innerHTML = ""
    for (let i in users) {
        if (users[i].id != id) {
            if (type == 'admin') {
                document.getElementById('pageSubmenu').innerHTML += `<li><div class="dropdown show">
                <a style="color:black;text-decoration:none;" class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${index}.) ${users[i].name}</a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" id="${i}" style="margin-right: 10px;cursor: pointer;" onclick="allowDenyAccess(this.id)">Allow Board Access</a>
                </div>
                </div></li>`
                index++
            }
            else {
                document.getElementById('pageSubmenu').innerHTML += `<li><a style="color:black;text-decoration:none;">${index}.) ${users[i].name}</a></li>`
            }
        }
    }
    if (type == "admin") {
        let src = canvas.toDataURL('image/png')
        socket.emit('send', { src, roomid })
    }
})

socket.on('left', (leftUser, users) => {
    let index = 1
    if (leftUser.type == "admin") window.location.href = `${window.location.origin}/dashboard`
    else {
        document.getElementById('pageSubmenu').innerHTML = ""
        for (let i in users) {
            if (users[i].id != id) {
                if (type == 'admin') {
                    document.getElementById('pageSubmenu').innerHTML += `<li><div class="dropdown show">
                    <a style="color:black;text-decoration:none;" class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink${index}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${index}.) ${users[i].name}</a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink${index}">
                    <a class="dropdown-item" id="${i}" style="margin-right: 10px;cursor: pointer;" onclick="allowDenyAccess(this.id)">Allow Board Access</a>
                    </div>
                    </div></li>`
                    index++
                }
                else {
                    document.getElementById('pageSubmenu').innerHTML += `<li><a style="color:black;text-decoration:none;">${index}.) ${users[i].name}</a></li>`
                }
            }
        }
    }
})


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
    context.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1), line.width, line.color)
    }
    let src = canvas.toDataURL('image/png')
    socket.emit('send', { src, roomid })
}
redrawCanvas()

socket.on('recieve', ({ src, roomid }) => {
    let img = new Image()
    img.src = src
    img.onload = () => {
        context.drawImage(img, 0, 0)
    }
})

socket.on('receiveAccess', (type) => {
    if (type === 'allow') showFeatures()
    else if (type === 'deny') hideFeatures()
})

// if the window changes size, redraw the canvas
window.addEventListener("resize", () => {
    redrawCanvas();
});

function changeColor(a, b, c) {
    a.classList.remove(a.classList[1])
    a.classList.add('btn-primary')
    b.classList.remove(b.classList[1])
    b.classList.add('btn-secondary')
    c.classList.remove(c.classList[1])
    c.classList.add('btn-secondary')
}

function hideFeatures() {
    document.getElementById('eraser').style.display = "none"
    document.getElementById('pen').style.display = "none"
    document.getElementById('color-picker').style.display = "none"
    document.getElementById('penSize').style.display = "none"
    document.getElementById('eraserSize').style.display = "none"
    document.getElementById('selectBtn').style.display = "none"
    document.getElementById('saveDrawings').style.display = "none"
    document.getElementById('clearDrawings').style.display = "none"
    document.getElementById('penText').style.display = "none"
    document.getElementById('eraseText').style.display = "none"
    document.getElementById('colorText').style.display = "none"
}

function showFeatures() {
    document.getElementById('eraser').style.display = "inline-block"
    document.getElementById('pen').style.display = "inline-block"
    document.getElementById('color-picker').style.display = "inline-block"
    document.getElementById('penSize').style.display = "inline-block"
    document.getElementById('eraserSize').style.display = "inline-block"
    document.getElementById('selectBtn').style.display = "inline-block"
    document.getElementById('clearDrawings').style.display = "inline-block"
    document.getElementById('penText').style.display = "inline-block"
    document.getElementById('eraseText').style.display = "inline-block"
    document.getElementById('colorText').style.display = "inline-block"
}

function allowDenyAccess(socketId) {
    if (document.getElementById(socketId).innerText === 'Allow Board Access') {
        document.getElementById(socketId).innerText = 'Deny Board Access'
        socket.emit('sendAccess', 'allow', socketId)
    }
    else {
        document.getElementById(socketId).innerText = 'Allow Board Access'
        socket.emit('sendAccess', 'deny', socketId)
    }
}

socket.on('i-have-joined', (details, organiser) => {
    cname = details.name
    roomid = details.roomId
    id = details.id
    type = details.type
    ClientName.innerText = `Name : ${cname}`
    roomID.innerText = `Room ID : ${roomid}`
    document.getElementById('pageSubmenu1').innerHTML = `<li><a>${organiser}</a></li>`
    socket.emit('new-user-joined', details)

    if (details.type === "user") {
        hideFeatures()
    }

    if (details.type === "admin") {
        document.getElementById('sidenavItems').innerHTML += `<br>
        <li>
            <a href="#pageSubmenu2" data-toggle="collapse" aria-expanded="false"
                class="dropdown-toggle">Saved Boards</a>
            <ul class="collapse lisst-unstyled" style="list-style: none;" id="pageSubmenu2"></ul>
        </li>`
    }

    // Mouse Event Handlers
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mouseout', onMouseUp, false)
    canvas.addEventListener('mousemove', onMouseMove, false)
    canvas.addEventListener('wheel', onMouseWheel, false)

    // Touch Event Handlers 
    canvas.addEventListener('touchstart', onTouchStart)
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('touchcancel', onTouchEnd)
    canvas.addEventListener('touchmove', onTouchMove)

    penSize.addEventListener('change', () => {
        lineWidth = penSize.value
    })

    eraserSlider.addEventListener('change', () => {
        eraserSize = eraserSlider.value
    })

    selectBtn.addEventListener('click', () => {
        enableErase = enablePainting = false
        changeColor(selectBtn, pen, eraser)
        canvas.classList.remove('penStyle')
        canvas.classList.remove('eraserStyle')
    })

    pen.addEventListener('click', (e) => {
        changeColor(pen, selectBtn, eraser)
        canvas.classList.add('penStyle')
        canvas.classList.remove('eraserStyle')
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
        canvas.classList.add('eraserStyle')
        canvas.classList.remove('penStyle')
        if (enableErase) enablePainting = false
        else {
            eraser.classList.remove(c.classList[1])
            eraser.classList.add('btn-secondary')
            selectBtn.classList.remove(pen.classList[1])
            selectBtn.classList.add('btn-primary')
        }
    })

    saveBtn.addEventListener('click', () => {
        let imageSrc = canvas.toDataURL('image/png')
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const image = new File([blob], 'drawing.png', blob)
                let data = new FormData()
                data.append("file", image)
                data.append("upload_preset", "drawingboard")
                data.append("cloud_name", "instaimagesparnab")

                fetch(`https://api.cloudinary.com/v1_1/instaimagesparnab/image/upload`, {
                    method: "post",
                    body: data,
                })
                    .then(res => res.json())
                    .then(data => {
                        fetch(`/saveWhiteBoard`, {
                            method: 'put',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                            },
                            body: JSON.stringify({
                                url: data.secure_url
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data)
                            })
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            })
    })

    clearBtn.addEventListener('click', () => {
        drawings = []
        redrawCanvas()
    })
})

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
    cursorX = event.pageX - canvas.offsetLeft;
    cursorY = event.pageY - canvas.offsetTop + 24;
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}
function onMouseMove(event) {
    // get mouse position
    cursorX = event.pageX - canvas.offsetLeft;
    cursorY = event.pageY - canvas.offsetTop + 24;
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
            y1: scaledY,
            width: lineWidth,
            color: colorPicker.value
        })
        // draw a line
        drawLine(cursorX, cursorY, prevCursorX, prevCursorY, lineWidth, colorPicker.value)
    }
    if (enableErase) {
        if (leftMouseDown) erase(event.pageX - canvas.offsetLeft, event.pageY + 24, eraserSize)
    }
    let src = canvas.toDataURL('image/png')
    socket.emit('send', { src, roomid })

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

function drawLine(x0, y0, x1, y1, lineWidth, color) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round"
    context.stroke();
}

function erase(x, y, s) {
    context.fillStyle = '#ffffff'
    drawings = drawings.filter(d => {
        return !(Math.abs(x - d.x0) < s && Math.abs(x - d.x1) < s && Math.abs(y - d.y0) < s && Math.abs(y - d.y1) < s)
    })
    redrawCanvas()
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

