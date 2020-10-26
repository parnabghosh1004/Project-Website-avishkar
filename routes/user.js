const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')
const cloudinary = require('cloudinary').v2
const { CLOUDINARY } = require('../config/keys')

cloudinary.config({
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
    upload_preset: CLOUDINARY.UPLOAD_PRESET
})

router.post('/dashboard', requireLogin, (req, res) => {
    User.findById(req.user._id)
        .select('-password')
        .then(user => {
            return res.json(user)
        })
        .catch(e => res.status(404).json({ error: "User not found" }))
})

router.put('/saveWhiteBoard', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $push: { WhiteBoards: req.body.url }
    }, { new: true, useFindAndModify: false },

        (e, result) => {
            if (e) return res.status(422).json({ error: e })
            res.json({ message: "saved successfully !" })
        }
    )
})

router.put('/updatepic', requireLogin, (req, res) => {

    if (req.body.curr_pic_id !== "default") {
        cloudinary.uploader.destroy(req.body.curr_pic_id, (e, result) => {
            console.log(e, result)
        })
    }
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic, pic_id: req.body.pic_id }
    }, { new: true, useFindAndModify: false },

        (e, result) => {
            if (e) return res.status(422).json({ error: 'Pic cannot be updated !' })
            res.json({ message: 'Profile pic updated successfully !' })
        }
    )
})

module.exports = router