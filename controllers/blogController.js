const fs = require("fs");
const Blog = require("../models/blog");
const imageKit = require("../config/imageKit");
const Comment = require("../models/comment");


// CREATE BLOG
exports.createBlog = async (req, res) => {
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

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
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
      status: "pending",     // moderation workflow
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



// GET APPROVED COMMENTS FOR A BLOG
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
