const express = require('express');
const router = express.Router();
const {
  addComment,
  getApprovedComments,
} = require('../controllers/commentController');

// Add comment (public - requires subscription)
router.post('/add', addComment);

// Get approved comments (public)
router.get('/:blogId/approved', getApprovedComments);

module.exports = router;

