const express = require('express')
const authRoute = express.Router()
const authController = require('../controllers/auth-controller')
const  {registerValidator,loginValidator} = require('../middlewares/validators')

authRoute.post('/register',registerValidator,authController.register)
authRoute.post('/login',loginValidator,authController.login)

module.exports = authRoute