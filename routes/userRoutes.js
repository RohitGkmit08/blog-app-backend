const express = require('express');
const router = express.Router();
const {
  register,
  login,
  toggleSubscription,
  getSubscribers,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// User registration (public)
router.post('/register', register);

// User login (public)
router.post('/login', login);

// Toggle subscription preference (protected)
router.put('/toggle-subscription', auth, toggleSubscription);

// Get all subscribers (admin - protected)
router.get('/subscribers', auth, getSubscribers);

module.exports = router;

