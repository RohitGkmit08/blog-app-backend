const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");
const Blog = require("../models/blog");

const {
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// ADMIN GET ALL BLOGS
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN GET SINGLE BLOG
router.get("/:blogId", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN CREATE BLOG
router.post("/", auth, upload.single("image"), createBlog);

// ADMIN UPDATE BLOG
router.put("/:blogId", auth, upload.single("image"), updateBlog);

// ADMIN DELETE BLOG
router.delete("/:blogId", auth, deleteBlog);

module.exports = router;
