const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { MongoURI } = require('./config/keys')
const expressLayouts = require('express-ejs-layouts')
const port = process.env.PORT || 5000

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

// express specific
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())

// registering all the models
require('./models/user')

// registering all the routes
app.use(require('./routes/auth'))
app.use(require('./routes/user'))
app.use(require('./routes/fileRender'))


app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

