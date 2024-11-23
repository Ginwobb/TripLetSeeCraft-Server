const express = require('express')
const tripRoute = express.Router()
const tripController = require('../controllers/trip-controller')
const placeController = require('../controllers/place-controller')

tripRoute.get('/all',tripController.getAllTrips)
tripRoute.post('/',tripController.createTrip)
tripRoute.get('/:tripId',tripController.getTrip)
tripRoute.put('/:tripId',tripController.editTrip)
tripRoute.delete('/:tripId',tripController.deleteTrip)
tripRoute.post('/:tripId/clone',tripController.cloneTrip)
tripRoute.get('/:tripId/share',tripController.shareTrip)

tripRoute.post('/:tripId/days/:dayIndex/places',placeController.createPlace)
tripRoute.delete('/:tripId/days/:dayIndex/places/:placeId',placeController.deletePlace)


module.exports = tripRoute