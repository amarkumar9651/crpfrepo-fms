const mongoose=require('mongoose')
const Fuel=require('./fuel')
const Schema=mongoose.Schema

const vehicleSchema=new Schema({
   name: String,
   registration: Number,
   isassigned:{ 
      type:Boolean,
      default:false
 },
   //id
   type:String,
   Wheeler:Number,
   dop:Date,
   totalkilom:{
      type:Number,
   default:0},
   costofvehicle:Number,
   destination:String,
   fuelatp:Number,
   category:{type:String,default:'LMV'},
   fuels:[{
      type: Schema.Types.ObjectId,
      ref:'Fuel'
   }],
   missions:[{
      type: Schema.Types.ObjectId,
      ref:'Mission'
   }]
   
})
module.exports=mongoose.model('Vehicle',vehicleSchema)