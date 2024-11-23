const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controllers/category-controller')

categoryRoute.get('/',categoryController.getCategories)
categoryRoute.get('/:categoryId',categoryController.getCategoriesById)


module.exports = categoryRoute