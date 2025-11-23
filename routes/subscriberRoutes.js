const express = require('express');
const router = express.Router();
const {
  addSubscriber,
  getSubscribers,
  deleteSubscriber,
} = require('../controllers/subscriberController');
const auth = require('../middleware/auth');

// Subscribe (public)
router.post('/subscribe', addSubscriber);

// Get all subscribers (admin - protected)
router.get('/admin/subscribers', auth, getSubscribers);

// Delete subscriber (admin - protected)
router.delete('/admin/subscribers/:id', auth, deleteSubscriber);

module.exports = router;

