const express = require('express');
const adminRouter = express.Router();
const {
  adminLogin,
  getSubscribedUsers,
  notifySubscribers,
} = require('../controllers/adminController');

const { moderateComment, getCommentsByStatus } = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Admin login
adminRouter.post('/login', adminLogin);

// Comment moderation (approve/reject/delete)
adminRouter.put('/comments/moderate', auth, moderateComment);
adminRouter.get('/comments/:blogId/:status', auth, getCommentsByStatus);

// Subscriber management + notifications
adminRouter.get('/subscribers', auth, getSubscribedUsers);
adminRouter.post('/notify-subscribers', auth, notifySubscribers);

module.exports = adminRouter;
