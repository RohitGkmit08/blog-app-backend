const fs = require("fs");
const Blog = require("../models/blog");
const imageKit = require("../config/imageKit");
const Comment = require("../models/comment");

// Create blog
exports.createBlog = async (req, res) => {
  console.log("Incoming blog:", req.body.blog); 
  console.log("Incoming file:", req.file);
  try {
    const {
      title,
      subTitle,
      description,
      slug,
      category,
      authorName,
      isPublished,
      publishedAt
    } = JSON.parse(req.body.blog);

    const imageFile = req.file;

    if (
      !title ||
      !subTitle ||
      !description ||
      !slug ||
      !category ||
      !authorName ||
      isPublished === undefined ||
      !publishedAt ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

  const uploadResponse = await imageKit.upload({
  file: imageFile.buffer,   // use buffer directly
  fileName: imageFile.originalname,
  folder: "/blogs"
});

    const optimizedImgUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" }
      ]
    });

    await Blog.create({
      title,
      subTitle,
      description,
      slug,
      category,
      image: optimizedImgUrl,
      authorName,
      isPublished,
      publishedAt
    });

    return res.json({
      success: true,
      message: "Blog added successfully"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  

};


// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    let blogData = req.body;

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/blogs"
      });

      blogData.image = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" }
        ]
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true
    });

    if (!updatedBlog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, message: "Blog updated", updatedBlog });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, message: "Blog deleted" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment (public)
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Get approved comments
exports.fetchApprovedComments = async (req, res) => {
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

    return res.json({ success: true, comments });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};