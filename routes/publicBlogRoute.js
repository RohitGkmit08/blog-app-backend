const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  getApprovedComments,
} = require('../controllers/publicBlogController');

// Get all published blogs (public)
router.get('/', getBlogs);

// Get single blog by slug or ID (public)
router.get('/:identifier', getBlog);

// Get approved comments for a blog (public)
router.get('/:blogId/comments', getApprovedComments);

module.exports = router;

