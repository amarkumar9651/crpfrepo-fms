const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session')
const Vehicle=require('./models/vehicle')
const ExpressError=require('./utils/ExpressError')
const catchAsync=require('./utils/catchAsync')
const vehicleRoutes=require('./routes/vehicles.js')
mongoose.connect('mongodb://localhost:27017/fleet-managment', 
{ useNewUrlParser: true, 
  useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
})
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: Date.now() + 1000*60*60*24*7,
    }
}
app.use(session(sessionConfig))



app.use('/vehicles',vehicleRoutes)
app.post('/search/index',catchAsync(async(req,res,next)=>{
const category=req.body.category;
const isassigned=req.body.assign;
console.log(category);
if(category!='')
{
   const vehicles=await Vehicle.find({category:category, isassigned:isassigned})
   console.log(vehicles);
   res.render('vehicles/index',{vehicles})
}
else{
res.redirect('/vehicles')
}
}))
app.get('/',(req,res)=>{
res.render('home')
})
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message)
    err.message="Something went wrong"
    res.status(statusCode).render('error',{err});
})



app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
    