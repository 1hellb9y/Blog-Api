const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const SECRET_KEY=process.env.SECRET_KEY;
const REFRESH_KEY=process.env.REFRESH_KEY;
const User=require("../models/User-Model");
exports.registerUser=asyncHandler(async(req,res)=>{
    const {name ,email,password}=req.body;
    if(!name||!email || !password){
        return res.status(400).json({msg:"Please Fill All The Data"});
    }
    const existUser=await User.findOne({email});
    if(existUser){
        return res.status(400).json({msg:"this user is already exist"});
    };
    const hashedPasswrod=await bcrypt.hash(password,10);
    const newUser=new User({
        name,
        email,
        password:hashedPasswrod,
    });
    await newUser.save();
    return res.status(200).json({msg:"New User Is Registered",user:newUser.name})
})

exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || ! password){
        return res.status(400).json({msg:"Missing fields"});
    };
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({msg:"no user found "})
    }
    const matchPassword=await bcrypt.compare(password,user.password);
    if(!matchPassword){
        return res.status(400).json({msg:"password incorrect"});
    };
    const payload={
        id:user._id,
        name:user.name,
        role:user.role,
    }
    const token=jwt.sign(payload,SECRET_KEY,{expiresIn:"2h"});
    return res.status(200).json({msg:"you loggin in successfully",token});
})
exports.getMe=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const user=await User.findById(userId);
    if(!user){
        return res.status(400).json({msg:"you need to login first"});
    };
    return res.status(200).json({msg:`Welcome to your profile ${user.name}`});
})