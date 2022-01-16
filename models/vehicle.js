const mongoose=require('mongoose')
const Fuel=require('./fuel')
const Schema=mongoose.Schema

const vehicleSchema=new Schema({
   name: String,
   registration: Number,
   isassigned: Boolean,
   //id
   type:String,
   Wheeler:Number,
   dop:Date,
   totalkilom:Number,
   costofvehicle:Number,
   destination:String,
   fuelatp:Number,
   fuels:[{
      type: Schema.Types.ObjectId,
      ref:'Fuel'
   }]
   
})
module.exports=mongoose.model('Vehicle',vehicleSchema)