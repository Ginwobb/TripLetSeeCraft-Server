const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')

module.exports.getPlace = tryCatch(async(req,res)=>{
    const { destinationId, categoryId } = req.query

    const filter ={}

    if(destinationId){
        filter.destinationId = Number(destinationId)
    }
    if(categoryId){
        filter.categoryId = Number(categoryId)
    }
    const foundPlaces = await prisma.place.findMany({
        where:{
            destinationId:filter.destinationId,
            categoryId:filter.categoryId
        }
    })
    res.json({places:foundPlaces})

})

module.exports.createPlace = tryCatch(async(req,res)=>{
    const {tripId,dayIndex} = req.params
    const {placeId} = req.body

    if(!placeId){
        createError(400, 'Place id is required')
    }

    const newTripPlace = await prisma.trip_place.create({
        data:{
            dayIndex:Number(dayIndex),
            tripId:Number(tripId),
            placeId:Number(placeId)
        },
    })
    res.json({trip_place:newTripPlace})
})


module.exports.deletePlace = tryCatch(async(req,res)=>{
    const {tripId,dayIndex,placeId} = req.params
    const deletedTripPlace = await prisma.trip_place.deleteMany({
        where:{
            tripId:Number(tripId),
            dayIndex:Number(dayIndex),
            placeId:Number(placeId)
        },
    })
    if(deletedTripPlace.count === 0){
        createError(404, 'Place not found')
    }
    res.json({trip_place:deletedTripPlace})
})