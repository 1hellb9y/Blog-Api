const mongoose=require("mongoose");

async function connectToDb(){
    await mongoose.connect("mongodb://localhost:27017/blogapi").then(()=>{console.log("Connected")}).catch((err)=>{console.log("Error",err.message)});
    console.log("/");
};
module.exports=connectToDb;