const Blog = require('../models/Blog');
const imageKit = require('../config/imageKit');
const { notifyAllSubscribers } = require('../service/subscriberService');
const { ensureUniqueSlug } = require('../utils/slug');


exports.createBlog = async (req, res) => {
  try {
    const blogPayload = JSON.parse(req.body.blog);
    const {
      title,
      subTitle,
      description,
      category,
      authorName,
      isPublished,
      publishedAt,
    } = blogPayload;

    const imageFile = req.file;

    // Validate required fields
    if (
      !title ||
      !subTitle ||
      !description ||
      !category ||
      !authorName ||
      isPublished === undefined ||
      !imageFile
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Upload image to ImageKit
    const uploadResponse = await imageKit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: '/blogs',
    });

    // Generate optimized image URL
    const optimizedImgUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' },
      ],
    });

    // Generate unique slug
    const slugSource = blogPayload.slug || title;
    let slug;
    try {
      slug = await ensureUniqueSlug(Blog, slugSource);
    } catch (slugError) {
      return res.status(400).json({
        success: false,
        message: slugError.message,
      });
    }

    // Create blog
    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      slug,
      category,
      image: optimizedImgUrl,
      authorName,
      isPublished,
      publishedAt: isPublished ? (publishedAt || new Date()) : null,
      wasNotified: false,
    });

    // Notify subscribers if published
    if (isPublished && !newBlog.wasNotified) {
      try {
        const subject = `New blog published: ${title}`;
        const message = `A new blog is live!<br/><br/><strong>Title:</strong> ${title}<br/><strong>Category:</strong> ${category}`;

        await notifyAllSubscribers(subject, message);

        newBlog.wasNotified = true;
        await newBlog.save();
      } catch (err) {
        console.error('Email notification error:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Blog created successfully',
      blogId: newBlog._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    let blogData = req.body.blog ? JSON.parse(req.body.blog) : req.body;

    // Handle isPublished boolean conversion
    if (blogData.isPublished !== undefined) {
      const isPublished =
        typeof blogData.isPublished === 'string'
          ? blogData.isPublished === 'true'
          : Boolean(blogData.isPublished);

      blogData.isPublished = isPublished;
      blogData.publishedAt = isPublished
        ? blogData.publishedAt || new Date()
        : null;
    }

    // Handle image upload if new image provided
    if (req.file) {
      const uploadResponse = await imageKit.upload({
        file: req.file.buffer,
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

    // Handle slug update
    let slugNeedsUpdate = false;
    let slugSource = null;

    if (typeof blogData.slug === 'string') {
      if (blogData.slug.trim()) {
        const normalizedIncoming = require('../utils/slug').normalizeSlugInput(
          blogData.slug
        );
        if (!normalizedIncoming) {
          return res.status(400).json({
            success: false,
            message: 'Invalid slug provided.',
          });
        }

        if (normalizedIncoming !== existingBlog.slug) {
          slugNeedsUpdate = true;
          slugSource = blogData.slug;
        }
      }
      delete blogData.slug;
    }

    // Update slug if title changed
    if (!slugNeedsUpdate && blogData.title && blogData.title !== existingBlog.title) {
      slugNeedsUpdate = true;
      slugSource = blogData.title;
    }

    // Update blog data
    Object.assign(existingBlog, blogData);

    // Update slug if needed
    if (slugNeedsUpdate && slugSource) {
      try {
        existingBlog.slug = await ensureUniqueSlug(
          Blog,
          slugSource,
          existingBlog._id
        );
      } catch (slugError) {
        return res.status(400).json({
          success: false,
          message: slugError.message,
        });
      }
    }

    // Check if we should notify subscribers
    const shouldNotify =
      existingBlog.isPublished && existingBlog.wasNotified === false;

    await existingBlog.save();

    // Notify subscribers if newly published
    if (shouldNotify) {
      try {
        const subject = `New blog published: ${existingBlog.title}`;
        const message = `A new blog is live!<br/><br/><strong>Title:</strong> ${existingBlog.title}<br/><strong>Category:</strong> ${existingBlog.category}`;
        await notifyAllSubscribers(subject, message);
        existingBlog.wasNotified = true;
        await existingBlog.save();
      } catch (err) {
        console.error('Email notification error:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Blog updated successfully',
      updatedBlog: existingBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    return res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

