const express = require('express');
const commentRouter = express.Router();

const { addComment } = require('../controllers/blogController');
const {
  getApprovedComments,
  getComments,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

// PUBLIC: Add comment
commentRouter.post('/comments', addComment);

// PUBLIC: Get approved comments only
commentRouter.get('/comments/:blogId/approved', getApprovedComments);

// ADMIN: Get comments by status
commentRouter.get('/admin/comments/:blogId/:status', auth, getComments);

module.exports = commentRouter;
