const fs = require("fs");
const Blog = require("../models/blog");
const imageKit = require("../config/imageKit");
const { notifyAllSubscribers } = require("../service/subscriberService");

// ADMIN — Create blog
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

        notifyAllSubscribers(subject, message);

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
    let blogData = req.body;

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);

      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
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

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    return res.json({
      success: true,
      message: "Blog updated",
      updatedBlog,
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
