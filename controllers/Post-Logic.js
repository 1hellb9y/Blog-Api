const { totalmem } = require("os");
const Post=require("../models/Post-Model");
const { create } = require("../models/User-Model");
const {  post, options } = require("../routes/User-Router");
const asyncHandler = require("../utils/asyncHandler");

exports.getPosts=asyncHandler(async(req,res)=>{
    const {page=1,limit=10,sort="-createdAt",search,tags,author}=req.query;
    page=parseInt(page);
    limit=parseInt(limit);
    let query={};
    if(search){
        query.$or=[
            {title:{$regex:search,options:"i"}},
            {content:{$regex:search,options:"i"}}
        ];
    };
    if(tags){
        query.tags={$in:tags.split(",")};
    };
    if(author){
        query.author=author
    };
    const posts=await Post.find(query).populate("author","name email").sort(sort).skip((page-1)*limit).limit(limit);
    const totalPosts=await Post.countDocuments(query);

    return res.status(200).json({
        page,
        totalPages:Math.ceil(totalPosts/limit),
        totalPosts,
        posts
    });
    
})
exports.createPost=asyncHandler(async(req,res)=>{
    const {title,content}=req.body;
    if(!title ||!content){
        return res.status(400).json({msg:"Please fill all the information"});
    };
    const newPost=new Post({
        title,
        content,
        author:req.user.id
    });
    await newPost.save();
    return res.status(200).json({msg:"new post created",post:newPost.title})
    
})
exports.getPostById=asyncHandler(async(req,res)=>{
    const PostId=req.params.id;
    const post=await Post.findById(PostId);
    if(!post){
        return res.status(400).json({msg:"no post with this id ",id:PostId},)};
    return res.status(200).json({msg:"Post : ",post});
});
exports.updatePostById=asyncHandler(async(req,res)=>{
    const postId=req.params.id;
    const updatedData=req.body
    const post=await Post.findByIdAndUpdate(postId,updatedData,{new:true})  ;
    if(!post){
        return res.status(400).json({msg:"Cannot find this post with this id  ",id:postId})
    }
    await post.save();
    return res.status(200).json({msg:"post updated"},post)
})
exports.deletePostById=asyncHandler(async(req,res)=>{
    const postId=req.params.id;
    const post=await Post.findByIdAndDelete(postId);
    if(!post){
        return res.status(400).json({msg:"post is already deleted"});
    };
    return res.status(200).json({msg:"post deleted"});
});

exports.addComment=asyncHandler(async(req,res)=>{
    const postId=req.params.id;
    const {body}=req.body
    if(!body){
        return res.status(400).json({msg:"comment content is missing"});
    };
    const post=await Post.findById(postId);
    if(!post){
        return res.status(400).json({msg:"no post with this id"});
    };
    const comment={
        body,
        user:req.user.id,
        createdAt:new Date()
    };
    post.comments.push(comment);
    await post.save();
    const addedComment=post.comments[post.comments.length-1];

    res.status(201).json({ message: "Comment added", addedComment });

})

exports.getAllComments=asyncHandler(async(req,res)=>{
    const postId=req.params.id;
    const post=await Post.findById(postId).populate("comments.user","name email");
    if(!post){
        return res.status(400).json({msg:"no post with this id"});
    }
    const comments=post.comments;
    return res.status(200).json({msg:`Comments for post ${post.title}`,comments});
})
exports.deleteComment=asyncHandler(async(req,res)=>{
   const {postId,commentId}=req.params;
   const post=await Post.findById(postId);
   if(!post){
    return res.status(400).json({msg:"no post with this id "});
   };
   post.comments=post.comments.filter((comment)=>comment._id.toString()!==commentId);
   await post.save();
   return res.status(200).json({msg:"Comment deleted",comments:post.comments})
})
exports.likePost=asyncHandler(async(req,res)=>{
    const postId=req.params.id;
    const userId=req.user.id;
    const post=await Post.findById(postId);
    if(!post){
        return res.status(400).json({msg:"Cannot find this post"})
    };
    if(post.likes.includes(userId)){
        post.likes.pull(userId);
        await post.save();
        return res.status(200).json({msg:"You unliked this post ",likesCount:post.likes.length});
    }
    else{
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({msg:"you like this like ",likesCount:post.likes.length});
    };


});
