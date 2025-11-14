// controllers/blogController.js

const fs = require("fs");
const Blog = require("../models/blog");
const imageKit = require("../config/imageKit");
const Comment = require("../models/comment");

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    // 1. blog JSON required
    if (!req.body.blog) {
      return res.status(400).json({
        success: false,
        message: "Missing blog JSON"
      });
    }

    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON in 'blog' field"
      });
    }

    const {
      title,
      subTitle,
      description,
      slug,
      category,
      authorName,
      isPublished,
      publishedAt
    } = blogData;

    // 2. Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // 3. Upload image to ImageKit
    const uploadResponse = await imageKit.upload({
      file: req.file.buffer,
      fileName: `blog-${Date.now()}-${req.file.originalname}`,
      folder: "/blogs"
    });

    // 4. Optimized URL
    console.log("UPLOAD RESPONSE:", uploadResponse);

    const optimizedImgUrl = imageKit.url({
      src: uploadResponse.url,
      src: uploadResponse.url,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" }
      ]
    });

    // 5. Create blog
    await Blog.create({
      title,
      subTitle,
      description,
      slug,
      category,
      image: optimizedImgUrl,
      authorName,
      isPublished: isPublished === true || isPublished === "true",
      publishedAt:
        isPublished === true || isPublished === "true"
          ? publishedAt || new Date()
          : null
    });

    return res.json({
      success: true,
      message: "Blog added successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD COMMENT
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

// GET APPROVED COMMENTS
exports.getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.json({
        success: false,
        message: "blogId is required"
      });
    }

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


// GET ALL BLOGS (only published)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      publishedAt: -1
    });

    return res.json({
      success: true,
      blogs
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// GET BLOG BY SLUG
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required"
      });
    }

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.json({
      success: true,
      blog
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


