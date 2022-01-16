const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Vehicle=require('./models/vehicle')
const Fuel=require('./models/fuel')
mongoose.connect('mongodb://localhost:27017/fleet-managment', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
    
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/vehicles', async(req,res)=>{
    const vehicles=await Vehicle.find({});
    //console.log(vehicles)
    res.render('vehicles/index',{vehicles});
})
app.get('/vehicles/new',(req,res)=>{
     res.render('vehicles/new');
})
app.post('/vehicles',async (req,res)=>{
    const vehicle =new Vehicle(req.body.vehicle)
    vehicle.isassigned=false;
    await vehicle.save()
    console.log(vehicle)
    res.redirect(`/vehicles/${vehicle._id}`)
})
app.get('/vehicles/:id',async (req,res)=>{
    const vehicle=await Vehicle.findById(req.params.id)
    // if(!vehicle)
    // {
    //     res.redirect('/vehicles')
    // }
    res.render('vehicles/show',{vehicle});
})
app.get('/vehicles/:id/assign',async(req,res)=>{
    const {id}=req.params
    const vehicle=await Vehicle.findById(id)
    res.render('vehicles/edit/assignmentForm',{vehicle})
})
app.get('/vehicles/:id/unassign',async(req,res)=>{
    const {id}=req.params
    const vehicle=await Vehicle.findById(id)
    res.render('vehicles/edit/unassignmentForm',{vehicle})
})
app.put('/vehicles/:id/assign',async(req,res)=>{
    const {id}=req.params;
    
  //  console.log(id)
  const vehicle=await Vehicle.findByIdAndUpdate(id,{...req.body.vehicle})
   vehicle.isassigned=true;
    
   // vehicle.isassigned=!(vehicle.isassigned);
    await vehicle.save();
    res.redirect(`/vehicles/${vehicle._id}`)
})
app.put('/vehicles/:id/unassign',async(req,res)=>{
    const {id}=req.params;
    
  //  console.log(id)
  const vehicle=await Vehicle.findByIdAndUpdate(id,{...req.body.vehicle})
  vehicle.isassigned=false;
    
    
   // vehicle.isassigned=!(vehicle.isassigned);
    await vehicle.save()
    res.redirect(`/vehicles/${vehicle._id}`)
})
app.get('/vehicles/:id/fuels', async(req,res)=>{
     const {id}=req.params;
     const vehicle=await Vehicle.findById(id).populate('fuels');
     res.render('fuels/index',{vehicle})
})
app.get('/vehicles/:id/fuels/new',async(req,res)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id);
    res.render('fuels/new',{vehicle})
})
app.post('/vehicles/:id/fuels',async (req,res)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id);
    const {volume,time}=req.body;
    const fuel=new Fuel({volume,time});
    vehicle.fuels.push(fuel);
    fuel.vehicle=vehicle;
    await vehicle.save()
    await fuel.save()
    res.redirect(`/vehicles/${id}`)
})

app.delete('/vehicles/:id',async(req,res)=>{
    const { id } = req.params.id;
    await Vehicle.findByIdAndDelete(id);
    res.redirect('/vehicles');
})


app.get('/',(req,res)=>{
res.render('home')
})
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
    