const Post = require("../models/Post-Model");

const checkOwner = async (req, res, next) => {
  const postId = req.params.id; 
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (post.author.toString() !== userId && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only owner or admin can perform this action" });
  }

  req.post = post;
  next();
};

module.exports = checkOwner;
