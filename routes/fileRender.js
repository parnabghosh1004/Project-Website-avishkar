const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/signin', (req, res) => {
    res.render('login')
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router