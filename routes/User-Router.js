const express=require("express");
const { registerUser, loginUser, getMe } = require("../controllers/User-Logic");
const router=express.Router();
const {auth}=require("../middlewares/auth");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",auth,getMe);

module.exports=router;