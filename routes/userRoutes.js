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
router.post('/users/register', register);
router.post('/users/login', login);

// User subscription toggle
router.put('/users/toggle-subscription', auth, toggleSubscription);

// Admin: fetch all subscribers
router.get('/admin/subscribers', auth, getSubscribers);

module.exports = router;
