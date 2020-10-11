const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/signup', (req, res) => {
    res.render('index', { title: "hello parnab" })
})

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) return res.redirect('/signup', { name })
})

module.exports = router