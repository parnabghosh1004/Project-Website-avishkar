const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')

router.post('/dashboard', requireLogin, (req, res) => {
    User.findById(req.user._id)
        .select('-password')
        .then(user => {
            return res.json(user)
        })
        .catch(e => res.status(404).json({ error: "User not found" }))
})

module.exports = router