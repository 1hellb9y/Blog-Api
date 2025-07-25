exports.checkRole=(roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(400).json({msg:"you dont have the role for this action"})
        };
        next();
    };
};
