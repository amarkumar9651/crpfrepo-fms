const express= require('express')
const router=express.Router();
const ExpressError=require('../utils/ExpressError')
const Vehicle=require('../models/vehicle')
const catchAsync=require('../utils/catchAsync')
const {vehicleSchema}=require('../schemas.js')
const Fuel=require('../models/fuel')
const Mission=require('../models/missions');
const validateVehicle=(req,res,next)=>{
const {error}=vehicleSchema.validate(req.body);
if(error){
    const msg=error.details.map(el =>el.message).join(',');
    throw new ExpressError(msg,400);
}
    else
    {
    next();
    }
}
    

router.get('/',catchAsync( async(req,res)=>{
    const vehicles=await Vehicle.find({}).sort({name:1});
    //console.log(vehicles)
    res.render('vehicles/index',{vehicles});
}))
router.get('/new',(req,res)=>{
     res.render('vehicles/new');
})
router.post('/',validateVehicle,catchAsync(async (req,res,next)=>{
    const vehicle =new Vehicle(req.body.vehicle)
   // console.log(vehicle.category)
    // vehicle.isassigned=false;
    await vehicle.save()
    console.log(vehicle)
    res.redirect(`/vehicles/${vehicle._id}`)
}))
router.get('/:id',catchAsync(async (req,res)=>{
    const vehicle=await Vehicle.findById(req.params.id)
    // if(!vehicle)
    // {
    //     res.redirect('/vehicles')
    // }
    res.render('vehicles/show',{vehicle});
}))
router.get('/:id/assign',catchAsync( async(req,res)=>{
    const {id}=req.params
    const vehicle=await Vehicle.findById(id)
    res.render('vehicles/edit/assignmentForm',{vehicle})
}))
router.get('/:id/unassign',catchAsync(async(req,res)=>{
    const {id}=req.params
    const vehicle=await Vehicle.findById(id)
    res.render('vehicles/edit/unassignmentForm',{vehicle})
}))
router.put('/:id/assign',catchAsync(async(req,res)=>{
    const {id}=req.params;
    const {destination}=req.body;
    const mission=new Mission(destination);
    const vehicle=await Vehicle.findByIdAndUpdate(id,{...req.body.vehicle})
    vehicle.missions.push(mission);
    vehicle.isassigned=true;
  
    mission.vehicle=vehicle;
    await vehicle.save();
    await mission.save()
    res.redirect(`/vehicles/${vehicle._id}`)
}))
router.put('/:id/unassign',catchAsync( async(req,res,next)=>{
    const {id}=req.params;
  
  //  const init_vehicle=await Vehicle.findById(id);
    const vehicle=await Vehicle.findByIdAndUpdate(id,{...req.body.vehicle});
   // const mission= await Mission.findById(vehicle.missions[missions.length -1]._id);
    //mission.fuelgaugediff=init_vehicle.fuelatp-vehicle.fuelatp;
    vehicle.isassigned=false;
    //console.log(mission);
    await vehicle.save();
   //await mission.save();
    res.redirect(`/vehicles/${vehicle._id}`)
}))
router.get('/:id/fuels',catchAsync( async(req,res,next)=>{
     const {id}=req.params;
     const vehicle=await Vehicle.findById(id).populate('fuels');
     res.render('fuels/index',{vehicle})
}))
router.get('/:id/missions',catchAsync( async(req,res,next)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id).populate('missions');
    res.render('mission/index',{vehicle})
}))
router.get('/:id/fuels/new',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id);
    res.render('fuels/new',{vehicle})
}))
router.post('/:id/fuels',catchAsync( async (req,res,next)=>{
    const {id}=req.params;
    const vehicle=await Vehicle.findById(id);
    const {volume,time}=req.body;
    const fuel=new Fuel({volume,time});
    vehicle.fuels.push(fuel);
    fuel.vehicle=vehicle;
    await vehicle.save()
    await fuel.save()
    res.redirect(`/vehicles/${id}`)
}))

router.delete('/:id',catchAsync(async(req,res,next)=>{
    const { id } = req.params.id;
    await Vehicle.findByIdAndDelete(id);
    res.redirect('/vehicles');
}))

module.exports=router