const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')

module.exports.getDestinations = tryCatch(async(req,res)=>{
    const getDestinations = await prisma.destination.findMany()
    res.json({destinations:getDestinations})
})

module.exports.getDestinationById = tryCatch(async(req,res)=>{
    const {destinationId} = req.params
    const foundDestination = await prisma.destination.findUnique({
        where:{
            id:Number(destinationId)
        }, 
        include:{
            places:true,
        }
    })
    if(!foundDestination){
        createError(404, 'Destination not found')
    }
    res.json({destination:foundDestination})
})