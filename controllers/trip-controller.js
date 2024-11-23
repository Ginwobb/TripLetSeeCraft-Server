const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')

module.exports.getAllTrips = tryCatch(async(req,res)=>{
    const getTrips = await prisma.trip.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            places:true
        }
    })
    res.json({trips:getTrips})
})

module.exports.createTrip = tryCatch(async (req, res) => {
    const { name, destinationId, days, people, places, startDate, endDate } = req.body;
  
    if (!name || !destinationId) {
      return res.status(400).json({ error: 'Name and destinationId are required' });
    }
  
    if (!Array.isArray(places) || places.some(place => !('dayIndex' in place) || !('placeId' in place))) {
      return res.status(400).json({ error: 'All places must have dayIndex and placeId' });
    }
  
    const newTrip = await prisma.trip.create({
      data: {
        name,
        days: days || 1,
        people: parseInt(people, 10) || 1, 
        userId: req.user.id,
        destinationId: parseInt(destinationId, 10), 
        places: {
          create: places,
        },
        startDate:new Date(startDate),
        endDate:new Date(endDate),
      },
    });
    
    res.status(201).json({ trip: newTrip });
  });
  

module.exports.getTrip = tryCatch(async(req,res)=>{
    const {tripId} = req.params
    const foundTrip = await prisma.trip.findUnique({
        where:{
            id:Number(tripId)
        },
        include:{
            places:{
                include:{
                    place:true
                }
            },
            user:true,
        }
    })
    if(!foundTrip){
        createError(404, 'Trip not found')
    }
    res.json({trip:foundTrip})
})

module.exports.editTrip = tryCatch(async(req,res)=>{
    const {tripId} = req.params
    const {name,people} = req.body
    const updatedTrip = await prisma.trip.update({
        where:{
            id:Number(tripId)
        },
        data:{
            name,
            people:people || undefined
        }
    })
    res.json({trip:updatedTrip})
})

module.exports.deleteTrip = tryCatch(async(req,res)=>{
    const {tripId} = req.params
    const deletedTrip = await prisma.trip.delete({
        where:{
            id:Number(tripId)
        }
    })
    res.json({trip:deletedTrip})
})

module.exports.cloneTrip = tryCatch(async (req, res) => {
    const { tripId } = req.params;

    const foundTrip = await prisma.trip.findUnique({
        where: {
            id: Number(tripId),
        },
        include: {
            user: true,
            destination: true,
            places: {
                include: {
                    place: true,
                },
            },
        },
    });

    console.log('Found Trip:', foundTrip);

    if (!foundTrip) {
        return createError(404, 'Trip not found');
    }

    const cloneTrip = await prisma.trip.create({
        data: {
            name: foundTrip.name + ' (copy)',
            days: foundTrip.days,
            people: foundTrip.people,
            startDate: foundTrip.startDate,
            endDate: foundTrip.endDate,
            user: {
                connect: {
                    id: foundTrip.userId,
                },
            },
            destination: {
                connect: {
                    id: foundTrip.destinationId,
                },
            },
        },
    });

    const placesClone = foundTrip.places.map(place => ({
        tripId: cloneTrip.id,         
        placeId: place.place.id,      
        dayIndex: place.dayIndex,      
    }));

    await prisma.trip_place.createMany({
        data: placesClone,
    });

    const clonedTripWithPlaces = await prisma.trip.findUnique({
        where: {
            id: cloneTrip.id,
        },
        include: {
            user: true,
            destination: true,
            places: {
                include: {
                    place: true,
                },
            },
        },
    });

    res.json({ trip: clonedTripWithPlaces });
});


module.exports.shareTrip = tryCatch(async(req,res)=>{
    const {tripId} = req.params
    const foundTrip = await prisma.trip.findUnique({
        where:{
            id:Number(tripId)
        },
    })
    if(!foundTrip){
        createError(404, 'Trip not found')
    }
    const shareTrip = 'Trip shared'
    res.json({message:shareTrip})
})