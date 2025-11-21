const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const { isValidObjectId } = mongoose;

const findPublishedBlog = async (identifier) => {
  if (!identifier) return null;

  const slugMatch = await Blog.findOne({
    slug: identifier,
    isPublished: true,
  });

  if (slugMatch) {
    return slugMatch;
  }

  if (!isValidObjectId(identifier)) {
    return null;
  }

  return Blog.findOne({ _id: identifier, isPublished: true });
};

// PUBLIC — Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLIC — Get single blog (by slug or id)
exports.getBlog = async (req, res) => {
  try {
    const blog = await findPublishedBlog(req.params.identifier);

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
