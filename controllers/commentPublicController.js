const Comment = require("../models/comment");
const Blog = require("../models/blog");


// add comment
exports.addComment = async (req, res) => {
  try {
    const { blogId, userId, comment } = req.body;

    if (!blogId || !userId || !comment) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.json({
        success: false,
        message: "Invalid blogId"
      });
    }

    await Comment.create({
      blogId,
      userId,
      comment,
      status: "pending",
      deletedAt: null
    });

    return res.json({
      success: true,
      message: "Comment submitted for review"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get approved comment
exports.getCommentsByBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const comments = await Comment.find({
      blogId,
      status: "approved",
      deletedAt: null
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      comments
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
