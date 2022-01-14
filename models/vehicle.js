const mongoose=require('mongoose')
const Schema=mongoose.Schema

const vehicleSchema=new Schema({
   name: String,
   registration: Number,
   isassigned: Boolean
})
module.exports=mongoose.model('Vehicle',vehicleSchema)