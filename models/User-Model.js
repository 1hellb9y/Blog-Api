const mongoose=require("mongoose");
const UserShema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      "Please fill a valid email address",
    ],
        lowercase:true,
        trim:true,
        unique:[true,"Email must be not used"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:8,
       
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },

})
const UserModel=mongoose.model("User",UserShema);
module.exports=UserModel;