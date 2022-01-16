const mongoose=require('mongoose')
const Schema=mongoose.Schema

const fuelSchema=new Schema({
   name: String,
   registration: Number,
   isassigned: Boolean,
   //id
   type:String,
   Wheeler:Number,
   dop:Date,
   totalkilom:Number,
   costofvehicle:Number
   
})
module.exports=mongoose.model('Vehicle',vehicleSchema)