const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { MongoURI } = require('./config/keys')
const expressLayouts = require('express-ejs-layouts')
const port = process.env.PORT || 5000

const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)

// mongodb specific
mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected", () => {
    console.log("Connected to Mongodb Atlas!")
})
mongoose.connection.on("error", (e) => {
    console.log(e)
})

// registering all the models
require('./models/user')

// express specific
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use('/static', express.static('public'))
app.use(express.json())


// registering all the routes
app.use(require('./routes/auth'))
app.use(require('./routes/user'))
app.use(require('./routes/fileRender'))


app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

const requireLogin = require('./middleware/requireLogin')

let rooms = {}
let details = { name: "user", roomId: "roomid", type: "user", id: "id" }, organiser

app.post('/createRoom', requireLogin, (req, res) => {
    details = req.body
    rooms[details.roomId] = {}
    organiser = details.name
    res.json({ roomId: details.roomId })
})

app.post('/joinRoom', requireLogin, (req, res) => {
    details = req.body
    if (Object.keys(rooms).includes(details.roomId)) res.json({ roomId: details.roomId })
    else {
        res.json({ error: "This room does not exists !" })
    }
})

app.get('/room/:Id', (req, res) => {
    if (Object.keys(rooms).includes(req.params.Id)) return res.render('whiteBoardRoom')
    res.redirect('/dashboard')
})

// socket io 
io.on('connection', socket => {
    socket.join(details.roomId)
    socket.emit('i-have-joined', details, organiser)

    details = { name: "user", roomId: "roomid", type: "user" }

    socket.on('new-user-joined', (user) => {
        rooms[user.roomId][socket.id] = [user.id, user.name]
        io.to(user.roomId).emit('user-joined', user.name, rooms[user.roomId])
    })
})


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

