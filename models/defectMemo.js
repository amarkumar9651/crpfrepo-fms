const mongoose=require('mongoose')
const Vehicle=require("./vehicle")
const jobCard =require("./jobCard")
const Schema=mongoose.Schema

const defectMemoSchema=new Schema({
    defect: String,
    status:Boolean, //default false
    dateOfDefect:Date,
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'  
    },
   jobCard:{
    type: Schema.Types.ObjectId,
    ref: 'jobCard' 
   }
})
module.exports=mongoose.model('defectMemo',defectMemoSchema)