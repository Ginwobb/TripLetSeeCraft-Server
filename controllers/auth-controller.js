const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const checkIdentityKey = (identity) => {
    let identityKey = ''
    
    if (/^[a-zA-Z0-9_]{3,15}$/.test(identity.trim())) {
        identityKey = 'username'
    } 
    else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity.trim())) {
        identityKey = 'email'
    }

    if (!identityKey) {
        throw createError(400, 'Only a valid username or email is allowed');
    }

    return identityKey
}

module.exports.register = tryCatch(async(req,res)=>{
    console.log('req-body',req.body)
    const {identity,firstName,lastName,password} = req.input

    const identityKey = checkIdentityKey(identity)
    const findIdentity = await prisma.user.findUnique({
        where:{
            [identityKey]:identity.trim()
        }
    })

    if(findIdentity){
        createError(409, `Already have this ${identityKey}`)
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = {
        firstName,
        lastName,
        password:hashedPassword,
        role:'USER',
        [identityKey]:identity.trim()
    }
    const result = await prisma.user.create({data:newUser})

    res.json({message:'Register success',user:result})
})

module.exports.login = tryCatch(async(req,res)=>{
    const {identity,password} = req.input;
    const identityKey = checkIdentityKey(identity)
    const findUser = await prisma.user.findUnique({
        where:{
            [identityKey]:identity.trim()
        }
    })

    if(!findUser){
        createError(401, `Invalid ${identityKey}`)
    }
    const isMatch = await bcrypt.compare(password,findUser.password)
    if(!isMatch){
        createError(401, 'Invalid password')
    }
    const payload = {
        id:findUser.id,
        role:findUser.role,
        profileImage:findUser.profileImage,
    }
    
    const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:'30d'})
    res.json({message:'Login success',token,user: { ...payload } })
});