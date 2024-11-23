const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')
const jwt = require('jsonwebtoken')

module.exports = tryCatch(async(req,res,next)=>{
    const authorization = req.headers.authorization
    if(!authorization || !authorization.startsWith('Bearer ')){
        createError(401, 'Unauthorized1')
    }
    const token = authorization.split(' ')[1]
    if(!token){
        createError(401, 'Unauthorized2')
    }
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    const foundUser = await prisma.user.findUnique({
        where:{
            id:payload.id
        }
    })
    if(!foundUser){
        createError(401, 'Unauthorized3')
    }
    const {password,createAt,updateAt,role,...userData} = foundUser
    req.user = userData
    next()
})