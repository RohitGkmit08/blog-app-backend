const Blog = require("../models/blog");
const imageKit = require("../config/imageKit");
const { notifyAllSubscribers } = require("../service/subscriberService");
const {
  ensureUniqueSlug,
  normalizeSlugInput,
} = require("../utils/slug");

// ADMIN — Create blog
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

    if (
      !title ||
      !subTitle ||
      !description ||
      !category ||
      !authorName ||
      isPublished === undefined ||
      !publishedAt ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const uploadResponse = await imageKit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImgUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

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
      wasNotified: false,
    });

    // Notify subscribers
    if (isPublished && !newBlog.wasNotified) {
      try {
        const subject = `New blog published: ${title}`;
        const message = `A new blog is live!\n\nTitle: ${title}\nCategory: ${category}`;

        await notifyAllSubscribers(subject, message);

        newBlog.wasNotified = true;
        await newBlog.save();
      } catch (err) {
        console.log("Email notification error:", err.message);
      }
    }

    return res.json({
      success: true,
      message: "Blog added successfully",
      blogId: newBlog._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN — Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    let blogData = req.body.blog ? JSON.parse(req.body.blog) : req.body;

    if (blogData.isPublished !== undefined) {
      const isPublished =
        typeof blogData.isPublished === "string"
          ? blogData.isPublished === "true"
          : Boolean(blogData.isPublished);

      blogData.isPublished = isPublished;
      blogData.publishedAt = isPublished
        ? blogData.publishedAt || new Date()
        : null;
    }

    if (req.file) {
      const uploadResponse = await imageKit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/blogs",
      });

      blogData.image = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    let slugNeedsUpdate = false;
    let slugSource = null;

    if (typeof blogData.slug === "string") {
      if (blogData.slug.trim()) {
        const normalizedIncoming = normalizeSlugInput(blogData.slug);
        if (!normalizedIncoming) {
          return res.status(400).json({
            success: false,
            message: "Invalid slug provided.",
          });
        }

        if (normalizedIncoming !== existingBlog.slug) {
          slugNeedsUpdate = true;
          slugSource = blogData.slug;
        }
      }

      delete blogData.slug;
    }

    if (!slugNeedsUpdate && blogData.title && blogData.title !== existingBlog.title) {
      slugNeedsUpdate = true;
      slugSource = blogData.title;
    }

    Object.assign(existingBlog, blogData);

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
    const shouldNotify =
      existingBlog.isPublished && existingBlog.wasNotified === false;

    await existingBlog.save();

    if (shouldNotify) {
      try {
        const subject = `New blog published: ${existingBlog.title}`;
        const message = `A new blog is live!\n\nTitle: ${existingBlog.title}\nCategory: ${existingBlog.category}`;
        await notifyAllSubscribers(subject, message);
        existingBlog.wasNotified = true;
        await existingBlog.save();
      } catch (err) {
        console.log("Email notification error:", err.message);
      }
    }

    return res.json({
      success: true,
      message: "Blog updated",
      updatedBlog: existingBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN — Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
