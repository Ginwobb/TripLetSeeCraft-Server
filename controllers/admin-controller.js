const path = require('path')
const fs = require('fs')
const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')
const cloudinary = require('../config/cloudinary')

module.exports.getAllUsers = tryCatch(async(req,res)=>{
    const user = await prisma.user.findMany()
    res.json({users:user})
})

module.exports.countUser = tryCatch(async(req,res)=>{
    const user = await prisma.user.count()
    res.json({users:user})
})

module.exports.updateUser = tryCatch(async(req,res)=>{
    const {userId} = req.params
    const {role} = req.body
    const updateUser = await prisma.user.update({
        where:{
            id:Number(userId)
        },
        data:{
            role
        }
    })
    res.json({user:updateUser})
})

module.exports.deleteUser = tryCatch(async(req,res)=>{
    const {userId} = req.params
    const deleteUser = await prisma.user.delete({
        where:{
            id:Number(userId)
        }
    })
    res.json({user:deleteUser})
})

module.exports.getAllTrips = tryCatch(async(req,res)=>{
    const trip = await prisma.trip.findMany({
        include:{
            places:{
                select:{
                    place:{
                        select:{
                            name:true
                        }
                    }
                }
            },
            destination:{
                select:{
                    name:true
                }
            },
            user:{
                select:{
                    firstName:true,
                    lastName:true,
                }
            }
        }
    })
    const tripsDetails = trip.map(trip => ({
        ...trip,
        user:`${trip.user.firstName} ${trip.user.lastName}`,
        destination: trip.destination.name,
        places: trip.places.map(tp => tp.place.name).join(", ")
    }))
    res.json({trips:tripsDetails})
})

module.exports.countTrip = tryCatch(async(req,res)=>{
    const trip = await prisma.trip.count()
    res.json({trips:trip})
})

module.exports.getAllCategories = tryCatch(async(req,res)=>{
    const category = await prisma.category.findMany()
    res.json({categories:category})
})

module.exports.getAllDestinations = tryCatch(async(req,res)=>{
    const destination = await prisma.destination.findMany()
    res.json({destinations:destination})
})

module.exports.getAllPlaces = tryCatch(async(req,res)=>{
    const place = await prisma.place.findMany()
    res.json({places:place})
})

module.exports.countPlace = tryCatch(async(req,res)=>{
    const place = await prisma.place.count()
    res.json({places:place})
})

module.exports.createPlaces = tryCatch(async(req,res)=>{
    const {name,description,placeImage,lat,lng,categoryId,destinationId} = req.body
if(!name || !lat || !lng || !categoryId || !destinationId){
    createError(400, 'All fields are required')
}
const haveFile = !!req.file
let uploadedFile ={}

if(haveFile){
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        public_id: path.parse(req.file.path).name
    })
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('File deleted ');
    });
}

const newPlace = await prisma.place.create({
    data:{
        name,
        description,
        placeImage: uploadedFile.secure_url || '',
        lat:Number(lat),
        lng:Number(lng),
        categoryId:Number(categoryId),
        destinationId:Number(destinationId)
    }
})

res.json({place:newPlace})

})

module.exports.editPlaces = tryCatch(async(req,res)=>{
    const {placeId} = req.params
    const {name,description,placeImage,lat,lng,categoryId,destinationId} = req.body
    const haveFile = !!req.file
let uploadedFile ={}

if(haveFile){
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        overwrite:true,
        public_id: path.parse(req.file.path).name
    })
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('File deleted');
    });
}
    const updatePlace = await prisma.place.update({
        where:{
            id:Number(placeId)
        },
        data:{
            name,
            description,
            placeImage: uploadedFile.secure_url || '',
            lat:Number(lat),
            lng:Number(lng),
            categoryId:categoryId ? Number(categoryId) : undefined,
            destinationId:destinationId ? Number(destinationId) : undefined
        }
    })

    res.json({place:updatePlace})
})

module.exports.deletePlaces = tryCatch(async(req,res)=>{
    const {placeId} = req.params
    const deletedPlace = await prisma.place.delete({
        where:{
            id:Number(placeId)
        }
    })
    res.json({place:deletedPlace})
})
