const express = require('express');
const router = express.Router();

const {
  addComment,
  getApprovedComments
} = require('../controllers/commentController');

// PUBLIC: Add comment
router.post('/add', addComment);

// PUBLIC: Get approved comments
router.get('/:blogId/approved', getApprovedComments);

module.exports = router;
