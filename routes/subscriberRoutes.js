const express = require("express");
const router = express.Router();
const {
  addSubscriber,
  getSubscribers,
  deleteSubscriber,
} = require("../controllers/subscriberController");
const auth = require("../middleware/auth");

// Public: subscribe
router.post("/subscribe", addSubscriber);

// Admin routes (protected)
router.get("/admin/subscribers", auth, getSubscribers);
router.delete("/admin/subscribers/:id", auth, deleteSubscriber);

module.exports = router;
