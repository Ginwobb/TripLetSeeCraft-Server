const createError = require('../utils/createError')
const tryCatch = require('../utils/tryCatch')
const prisma = require('../config/prisma')

module.exports.getCategories = tryCatch(async(req,res)=>{
    const getCategories = await prisma.category.findMany()
    res.json({categories:getCategories})
})

module.exports.getCategoriesById = tryCatch(async(req,res)=>{
    const {categoryId} = req.params
    const foundCategory = await prisma.category.findUnique({
        where:{
            id:Number(categoryId)
        }, 
        include:{
            places:true,
        }
    })
    if(!foundCategory){
        createError(404, 'Category not found')
    }
    res.json({category:foundCategory})
})