const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')
const {Client} = require('@googlemaps/google-maps-services-js')

module.exports.getAllLandmarks = tryCatch(async(req,res)=>{
    const getLandmarks = await prisma.place.findMany()
    res.json({places:getLandmarks})
})

module.exports.getLandmarkByCategoryId = tryCatch(async(req,res)=>{
    const { categoryId } = req.params;
    const places = await prisma.place.findMany({
      where: { categoryId: parseInt(categoryId) },
    });
    res.json({ places });
})

module.exports.getLandmarksByTripId = tryCatch(async(req,res)=>{
    const {tripId,dayIndex} = req.params
    const tripPlaces = await prisma.trip_place.findMany({
        where:{
            tripId:Number(tripId),
            dayIndex:Number(dayIndex)
        },
        include:{
            place:true
        }
    })
    const places = tripPlaces.map(tripPlace => tripPlace.place)
    res.json({places})
})
