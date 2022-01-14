<<<<<<< HEAD
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/vehicles", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Fill this"]
      },
      number: {
        type: Number,
        required: [true, "Fill this"]
      }
    }
  );

const Item = mongoose.model("Item", itemsSchema);

app.get("/",function(req,res){
    res.render("list", {});
});



app.post("/",function(req,res)
{
 let VName =req.body.nameVehicle;
 let Rno=req.body.regNO;

 const item = new Item({
   name: VName,
   number:Rno

 });

 item.save();

 Item.find({}, function(err, foundItems){
     res.render("show", {vehicleList: foundItems});
 });

});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server starting on port 3000");
  });
=======
const express=require('express')
>>>>>>> 7bf3d1cf1a615e526d322f4e2d29da8a56158c73
