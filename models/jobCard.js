const mongoose=require('mongoose')
const Vehicle=require("./vehicle")
const defectMemo= require("./defectMemo")
const Schema=mongoose.Schema

const jobCardSchema=new Schema({
    partName: String,
    status:Boolean, //default false
    dateOfJobCard:Date,
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'  //should refer vehicle
    },
    defectMemo:{
        type: Schema.Types.ObjectId,
        ref: 'defectMemo' 
    }
   
})
module.exports=mongoose.model('jobCard',jobCardSchema)