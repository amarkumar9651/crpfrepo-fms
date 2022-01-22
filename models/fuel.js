const mongoose=require('mongoose')
const Vehicle=require("./vehicle")
const Schema=mongoose.Schema

const fuelSchema=new Schema({
    volume:Number,
    time:Date,
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
    }
   
})
module.exports=mongoose.model('Fuel',fuelSchema)