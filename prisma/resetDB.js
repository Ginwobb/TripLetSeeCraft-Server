require('dotenv').config()
const prisma = require('../config/prisma')

async function run(){
    await prisma.$executeRawUnsafe('DROP DATABASE trip_project')
    await prisma.$executeRawUnsafe('CREATE DATABASE trip_project')
}
console.log("resetDB")
run()