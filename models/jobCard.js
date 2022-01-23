const mongoose=require('mongoose')
const Vehicle=require("./vehicle")
const Schema=mongoose.Schema

const jobCardSchema=new Schema({
    partName: String ,
    status:Boolean,
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'  //should refer vehicle
    }
   
})
module.exports=mongoose.model('jobCard',jobCardSchema)