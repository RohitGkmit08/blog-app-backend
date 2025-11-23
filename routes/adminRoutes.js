const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getSubscribedUsers,
  notifySubscribers,
} = require('../controllers/adminController');
const {
  moderateComment,
  getCommentsByStatus,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Admin login (public)
router.post('/login', adminLogin);

// Comment moderation (protected)
router.put('/comments/moderate', auth, moderateComment);
router.get('/comments/:blogId/:status', auth, getCommentsByStatus);

// Subscriber management (protected)
router.get('/subscribers', auth, getSubscribedUsers);
router.post('/notify-subscribers', auth, notifySubscribers);

module.exports = router;

