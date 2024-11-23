const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')
const path = require('path')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

module.exports.getProfile = tryCatch(async(req,res)=>{
    const user = await prisma.user.findUnique({
        where:{
            id : req.user.id
        }
    })
    console.log('uiuiuiuiu',user)
    res.json({user:user})
    console.log("sdhsjkd",user)   
})

module.exports.editProfile = tryCatch(async(req,res)=>{
    const {firstName,lastName} = req.body
    const userId = req.user.id
    const haveFile = !!req.file
    console.log("ggggg", req.file)
    console.log(haveFile)
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
console.log('uploadedFile', uploadedFile)
    const updateUser = await prisma.user.update({
        where:{
            id: userId
        },
        data:{
            firstName,
            lastName,
            profileImage: uploadedFile.secure_url || '',
        }
    })
    res.json({user:updateUser})
})