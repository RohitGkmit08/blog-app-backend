const express = require('express');
const router = express.Router();

const {
  register,
  login,
  toggleSubscription,
  getSubscribers,
} = require('../controllers/userController');

const auth = require('../middleware/auth');

// User auth
router.post('/register', register);
router.post('/login', login);

// User subscription toggle
router.put('/toggle-subscription', auth, toggleSubscription);

// Admin: fetch all subscribers
router.get('/subscribers', auth, getSubscribers);

module.exports = router;
