require("dotenv").config();
const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const authenticate = require("./middlewares/authenticate");
const tripRoute = require("./routes/trip-route");
const placeRoute = require("./routes/place-route");
const adminRoute = require("./routes/admin-route");
const destinationRoute = require("./routes/destination-route");
const categoryRoute = require("./routes/category-route");
const mapsRoute = require("./routes/maps-route");
const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth',authRoute)
app.use('/users',authenticate,userRoute)
app.use('/trips',authenticate,tripRoute)
app.use('/places',authenticate,placeRoute)
app.use('/destinations',authenticate,destinationRoute)
app.use('/categories',categoryRoute)
app.use('/admin',authenticate,adminRoute)
app.use('/maps',mapsRoute)


app.use(notFound)
app.use(errorMiddleware)


const port = process.env.PORT || 8000
app.listen(port,()=>console.log(`server running on port ${port}`))