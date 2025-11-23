const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');
const {
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Get all blogs (admin - includes unpublished)
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single blog by ID (admin)
router.get('/:blogId', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create blog (protected)
router.post('/', auth, upload.single('image'), createBlog);

// Update blog (protected)
router.put('/:blogId', auth, upload.single('image'), updateBlog);

// Delete blog (protected)
router.delete('/:blogId', auth, deleteBlog);

module.exports = router;

