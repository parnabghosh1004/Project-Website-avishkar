const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { JWT_SECRET } = require('../config/keys')

router.post('/signup', (req, res) => {

    const { firstName, lastName, email, password, pic, pic_id } = req.body

    User.findOne({ email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with this email !" })
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        password: hashedPassword,
                        email,
                        firstName,
                        lastName,
                        pic,
                        pic_id
                    })
                    user.save().then(user => {
                        return res.json({ message: 'User Saved successfully !' })
                    })
                })
                .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
})

router.post('/signin', (req, res) => {

    const { email, password } = req.body

    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Wrong username or password!" })
            }

            bcrypt.compare(password, savedUser.password).then(doMatch => {
                if (doMatch) {
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                    // const { _id, firstName, lastName, email, pic, pic_id, favourites } = savedUser
                    return res.json({ token, user: savedUser })
                }
                return res.status(422).json({ error: "Wrong username or password" })
            })
                .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
})


module.exports = router