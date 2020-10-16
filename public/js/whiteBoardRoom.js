// for socket io

const socket = io('/')
const ClientName = document.getElementById('ClientName')
const roomID = document.getElementById('roomID')

let cname = "name", roomid = "room", type = "admin", id = 'id'

socket.on('i-have-joined', (details, organiser) => {
    cname = details.name
    roomid = details.roomId
    id = details.id
    if (details.type === "admin") organiser = cname
    ClientName.innerText = `Name : ${cname}`
    roomID.innerText = `Room ID : ${roomid}`
    document.getElementById('pageSubmenu1').innerHTML = `<li><a>${organiser}</a></li>`
    socket.emit('new-user-joined', details)
})

socket.on('user-joined', (name, user) => {
    let index = 1
    document.getElementById('pageSubmenu').innerHTML = ""
    for (let i in user) {
        if (user[i][0] != id) {
            document.getElementById('pageSubmenu').innerHTML += `<li><a>${index} Name : ${user[i][1]}</a></li>`
        }
    }
})

// socket.emit()
