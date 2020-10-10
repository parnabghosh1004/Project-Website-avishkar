const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { MongoURI } = require('./config/keys')
const port = process.env.PORT || 5000
const expressLayouts = require('express-ejs-layouts')

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
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
app.use(express.static('public'))

// registering all the routes
app.use(require('./routes/auth'))

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

