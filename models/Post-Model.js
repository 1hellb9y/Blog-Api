const mongoose=require("mongoose");
const PostShema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title for the post is required"],
        trim:true,
        minlength:3
    },
     content: {
      type: String,
      required: [true, "Post must have content"],
      minlength: 10,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    tags:{
        type:[String],
        default:[],
    },
    likes:[
    {   
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
    ],
    comments:[
        {
            body:{type:String,required:true},
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            createdAt:{type:Date,default:Date.now}
        }
    ],
},{timestamps:true});

const PostModel= mongoose.model("Post",PostShema);
module.exports=PostModel