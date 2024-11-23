const express = require('express')
const destinationRoute = express.Router()
const destinationController = require('../controllers/destination-controller')

destinationRoute.get('/',destinationController.getDestinations)
destinationRoute.get('/:destinationId',destinationController.getDestinationById)
module.exports = destinationRoute