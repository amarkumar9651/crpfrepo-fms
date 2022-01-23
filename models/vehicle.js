const mongoose=require('mongoose')
const Fuel=require('./fuel')
const Schema=mongoose.Schema

const vehicleSchema=new Schema({
   name: String,
   registration: Number,  //  provide validation and type mixture of number and letter change datatype
   isassigned: Boolean,
   //id
   type:String,
   Wheeler:Number,   //provide validation else server crashes
   dop:Date,  //date of purchase
   totalkilom:{type:Number,default:0},  //validate and provide a default value of zero
   costofvehicle:Number,
    destination:String, //it will be an array of objects date and destination
   fuelatp:Number,
   fuels:[{
      type: Schema.Types.ObjectId,
      ref:'Fuel'
   }]
   
})
module.exports=mongoose.model('Vehicle',vehicleSchema)