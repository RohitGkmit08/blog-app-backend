const fs = require('fs');
const Blog = require('../models/blog');
const imageKit = require('../config/imageKit');
const Comment = require('../models/comment');
const { notifyAllSubscribers } = require('../service/subscriberService');

// Create blog
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
      publishedAt,
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
        message: 'Missing required fields',
      });
    }

    // Upload image using buffer
    const uploadResponse = await imageKit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: '/blogs',
    });

    const optimizedImgUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' },
      ],
    });

    // create new blog
    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      slug,
      category,
      image: optimizedImgUrl,
      authorName,
      isPublished,
      publishedAt,
      wasNotified: false, //  important
    });

    // publish detection
    if (isPublished === true && newBlog.isNotified === false) {
      try {
        const subject = `Checkout this new blog published on : ${title}`;
        const message = `A new blog has been published!

        Title: ${title}
        Category: ${category}
        Visit the site to read it.`;

        notifyAllSubscribers(subject, message);

        // update flag
        newBlog.isNotified = true;
        await newBlog.save();
      } catch (err) {
        console.log('Email notification error:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Blog added successfully',
      blogId: newBlog._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
        folder: '/blogs',
      });

      blogData.image = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' },
        ],
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.json({ success: false, message: 'Blog not found' });
    }

    return res.json({ success: true, message: 'Blog updated', updatedBlog });
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
      return res.json({ success: false, message: 'Blog not found' });
    }

    return res.json({ success: true, message: 'Blog deleted' });
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
        message: 'Missing required fields',
      });
    }

    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.json({
        success: false,
        message: 'Invalid blogId',
      });
    }

    await Comment.create({
      blogId,
      userId,
      comment,
      status: 'pending',
      deletedAt: null,
    });

    return res.json({
      success: true,
      message: 'Comment submitted for review',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments based on status (public)
exports.getComments = async (req, res) => {
  try {
    const { blogId, status } = req.params;

    if (!blogId || !status) {
      return res.json({
        success: false,
        message: 'blogId and status are required',
      });
    }

    const comments = await Comment.find({
      blogId,
      status,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
