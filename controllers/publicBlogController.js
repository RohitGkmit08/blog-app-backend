const Blog = require("../models/blog");
const Comment = require("../models/comment");

// PUBLIC — Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLIC — Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUBLIC — Get only approved comments for a blog
exports.getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blogId,
      status: "approved",
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .select("userId comment createdAt");

    return res.json({
      success: true,
      comments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
