const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Vehicle=require('./models/vehicle')
const Fuel=require('./models/fuel');
const jobCard = require('./models/jobCard');
const defectMemo =require('./models/defectMemo');

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
    //vehicle.totalkilom=vehicle.totalkilom+res.vehicle[totalkilom];
    
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
app.post('/newJobCard/:id',async(req,res)=>{
    const {id}=req.params;

    const newParts=req.body.newParts;
    const dateOfCreation=req.body.dateOfJobCard;
   
    const defMemo= await defectMemo.findById(id);
    console.log(defMemo);
    const vehicleId=defMemo.vehicle;
    
    const vehicle=await Vehicle.findById(vehicleId);
    console.log(vehicle);
    
    const newCard=new jobCard;
    newCard.partName=newParts;
    newCard.dateOfJobCard=dateOfCreation;
    newCard.status=false;
    newCard.vehicle=vehicle;
    
    
    
    console.log(vehicle);
    console.log(newCard);
    
    defMemo.status=true;
    defMemo.jobCard=newCard;
    newCard.defectMemo=defMemo;
    vehicle.jobCards.push(newCard);
    await vehicle.save();
    await defMemo.save();
    
     console.log(defMemo);
   
     
    res.send("<h1>JobCard Created</h1>");
})
app.get('/jobCard/:id',async(req,res)=>{
    const {id}=req.params;
    const defMemo=await defectMemo.findById(id);
    res.render('jobCard/jobCardForm',{defMemo});
})
app.get('/jobCardAllVehicles',async(req,res)=>{
    const vehicles=await Vehicle.find({});
   res.render('jobCard/showVehicle',{vehicles});
});
app.get('/jobCardPending',async(req,res)=>{
    const allJobCards=await jobCard.find({status:"false"});
    //console.log(allJobCards);
   // res.send("<h1>JobCard Created</h1>");
    res.render('jobCard/pendingJobCards',{allJobCards});
})
app.get('/jobCardIssued',async(req,res)=>{
    const allJobCards=await jobCard.find({status:"true"});
    //console.log(allJobCards);
   // res.send("<h1>JobCard Created</h1>");
    res.render('jobCard/issuedJobCards',{allJobCards});
})
app.get('/issueParts/:id',async(req,res)=>{
    const {id}=req.params;
    const cardToBeIssued= await jobCard.findById(id);
    cardToBeIssued.status=true;
    //console.log(cardToBeIssued);
     await cardToBeIssued.save();
    res.send("<h1>Parts Issued</h1>");
})
app.post('/newMemo/:id',async(req,res)=>{
    const {id}=req.params;
    const newDefect=req.body.newDefect;
    const dateOfMemo=req.body.dateOfDefect;
   
    const vehicle= await Vehicle.findById(id);
    const newMemo=new defectMemo;
    newMemo.defect=newDefect;
    newMemo.dateOfDefect=dateOfMemo;
    newMemo.status=false;
    newMemo.vehicle=vehicle;
    vehicle.defectMemos.push(newMemo);
    await vehicle.save();
    await newMemo.save();
    res.send("Memo Created");
    //res.redirect('/');
})
app.get('/createDefectMemo/:id',async(req,res)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id);
    res.render('defectMemo/createMemo',{vehicle});
})
app.get('/attendedDefectMemo',async(req,res)=>{
      const allDefectMemo=await defectMemo.find({status:true});
      res.render('defectMemo/attendedDefectMemo',{allDefectMemo});
})
app.get('/nonAttendedDefectMemo',async(req,res)=>{
    const allDefectMemo=await defectMemo.find({status:false});
    res.render('defectMemo/nonAttendedDefectMemo',{allDefectMemo});
})
app.get('/',(req,res)=>{
res.render('home')
})
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
    