const mongoose=require('mongoose')
const Vehicle=require("./vehicle")
const Schema=mongoose.Schema

const missionSchema=new Schema({
    distance:Number,
    time:Date,
    location:String,
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    startfuel:Number,
    endfuel:Number,
    fuelgaugediff:Number,//omit
    kmgaugediff:Number
   
})
module.exports=mongoose.model('Mission',missionSchema)