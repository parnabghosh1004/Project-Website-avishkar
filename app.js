const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { MongoURI } = require('./config/keys')
const port = process.env.PORT || 5000

// connecting to mongodb
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

app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

