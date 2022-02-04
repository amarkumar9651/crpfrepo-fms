const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session')
const Vehicle=require('./models/vehicle')
const Mission=require('./models/missions')
const Fuel=require('./models/fuel')
const ExpressError=require('./utils/ExpressError')
const catchAsync=require('./utils/catchAsync')
const vehicleRoutes=require('./routes/vehicles.js')
const ObjectId=require('mongodb').ObjectID;
const { db } = require('./models/fuel');
const { LOADIPHLPAPI } = require('dns');
const vehicle = require('./models/vehicle');
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
   const vehicles=await Vehicle.find({category:category, isassigned:isassigned}).sort({name:1})
   console.log(vehicles);

   res.render('vehicles/index',{vehicles})
}
else{
res.redirect('/vehicles')
}
}))

app.post('/:id/search',catchAsync(async(req,res,next)=>{
    const day1=req.body.day1;
    const month1=req.body.month1;
    const year1=req.body.year1;
    const day2=req.body.day2;
    const month2=req.body.month2;
    const year2=req.body.year2;

    const {id}=req.params;
    const vehicles=await Vehicle.findById(id);
    
    let date1=new Date(year1,month1,day1-30,0-18,0-30,0,0).toISOString();
    let date2=new Date(year2,month2-1,day2,23+5,59+30,59,0).toISOString();
    

       const missionNew=await Mission.find({vehicle:ObjectId(vehicles).toString(), time:{$gte:date1,$lte:date2}});
        // console.log(missionNew);
       //console.log(ObjectId(vehicles).toString());
    
    // console.log(id);

    const missionBefore=await Mission.find({vehicle:id});

       const vehicleNew=await Vehicle.updateOne({_id:id},{ missions : missionNew});
        //  console.log(vehicleNew);

        const vehicle=await Vehicle.findById(id).populate({path: "missions", select:["time","distance","location"], options:{sort: {time:1}}});
         //console.log(vehicle);

        res.render('mission/index',{vehicle})

        const missionAfter=await Vehicle.updateOne({_id:id},{ missions : missionBefore});        

    }
    
    ))
    
app.post('/:id/searchFuel',catchAsync(async(req,res,next)=>{
    const day1=req.body.day1;
    const month1=req.body.month1;
    const year1=req.body.year1;
    const day2=req.body.day2;
    const month2=req.body.month2;
    const year2=req.body.year2;
    const {id}=req.params.id;
    const vehicles=await Vehicle.findById(req.params.id);
    
    let date1=new Date(year1,month1,day1-30,0-18,0-30,0,0).toISOString();
    let date2=new Date(year2,month2-1,day2,23+5,59+30,59,0).toISOString();

    // console.log(date1);
    // console.log(date2);
    
    // console.log(vehicles);
    // console.log(ObjectId(vehicles).toString());
        const fuelNew=await Fuel.find({vehicle:ObjectId(vehicles).toString(), time:{$gte:date1,$lte:date2}});
        // console.log(fuelNew);
        //console.log(ObjectId(vehicles).toString());
    

    const fuelBefore=await Fuel.find({vehicle:ObjectId(vehicles).toString()});

        const vehicleNew=await Vehicle.updateOne({_id:ObjectId(vehicles).toString()},{ fuels : fuelNew});
    // console.log(vehicleNew);

        const vehicle=await Vehicle.findById(ObjectId(vehicles).toString()).populate({path: "fuels", select:["time","volume"], options:{sort: {time:1}}});
     //console.log(vehicle);

        
        res.render('fuels/index',{vehicle})

        const fuelAfter=await Vehicle.updateOne({_id:ObjectId(vehicles).toString()},{ fuels : fuelBefore});        

    }
    
    ))


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
    