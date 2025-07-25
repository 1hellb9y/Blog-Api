const express=require("express");
const { getPosts, createPost, getPostById, updatePostById, deletePostById, addComment, getAllComments, likePost, deleteComment } = require("../controllers/Post-Logic");
const {auth}=require("../middlewares/auth")
const checkRole  = require("../middlewares/checkRole");
const {validate}=require("../middlewares/validator")
const checkOwner = require("../middlewares/checkOwnerShip");
const { createPostValidator } = require("../validators/postValidator");
const router=express.Router();

router.get("/posts",getPosts);
router.post("/posts",auth,createPostValidator,validate,createPost);
router.get("/posts/:id",getPostById);
router.put("/posts/:id",auth,checkOwner,updatePostById);
router.delete("/posts/:id",auth,checkOwner,deletePostById);
router.post("/posts/:id/comments",auth,addComment);
router.get("/posts/:id/comments",auth,getAllComments);
router.delete("/posts/:id/comments",auth,checkOwner,deleteComment);
router.post("/posts/:id/likes",auth,likePost);

module.exports=router