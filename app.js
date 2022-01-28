const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session')
const ExpressError=require('./utils/ExpressError')
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
    