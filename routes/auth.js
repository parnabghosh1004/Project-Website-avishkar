const express = require('express')
const router = express.Router()

router.get('/signin', (req, res) => {
    res.render('index', { title: "hello parnab" })
})

module.exports = router