const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router