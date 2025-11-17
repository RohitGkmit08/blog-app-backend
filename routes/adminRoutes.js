const express = require('express');
const adminRouter = express.Router();
const { notifySubscribers } = require('../controllers/adminController');

const {
  adminLogin,
  getSubscribedUsers,
} = require('../controllers/adminController');

const { moderateComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Admin login
adminRouter.post('/login', adminLogin);

// Comment moderation (approve/reject/delete)
adminRouter.put('/comments/moderate', auth, moderateComment);
adminRouter.post('/notify-subscribers', auth, notifySubscribers);

// to get all the subscribe users.
adminRouter.get('/subscribers', auth, getSubscribedUsers);

// to send mail to all the subscribers
adminRouter.post('/notify-subscribers', auth, notifySubscribers);

module.exports = adminRouter;
