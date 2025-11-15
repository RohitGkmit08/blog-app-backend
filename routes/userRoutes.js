const express = require('express');
const userRouter = express.Router();

const {
  registerUser,
  loginUser,
  updateEmailPreference,
} = require('../controllers/userController');

const auth = require('../middleware/auth');

// public
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// protected
userRouter.patch('/email-preference', auth, updateEmailPreference);

module.exports = userRouter;
