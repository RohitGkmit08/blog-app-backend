const express = require('express');
const adminRouter = express.Router();

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

// to get all the subscribe users.
adminRouter.get('/subscribers', auth, getSubscribedUsers);

module.exports = adminRouter;
