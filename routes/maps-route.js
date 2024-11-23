const express = require('express')
const mapsRoute = express.Router()
const mapsController = require('../controllers/maps-controller')

mapsRoute.get('/all',mapsController.getAllLandmarks)
mapsRoute.get('/category/:categoryId',mapsController.getLandmarkByCategoryId)
mapsRoute.get('/trip/:tripId/day/:dayIndex', mapsController.getLandmarksByTripId)

module.exports = mapsRoute
