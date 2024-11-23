const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers//user-controller')
const upload = require('../middlewares/upload')

userRoute.get('/me',userController.getProfile)
userRoute.put('/me',upload.single('profileImage'),userController.editProfile)

module.exports = userRoute