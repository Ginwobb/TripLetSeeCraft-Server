const express = require('express')
const placeRoute = express.Router()
const placeController = require('../controllers/place-controller')

placeRoute.get('/',placeController.getPlace)

module.exports = placeRoute