
const express = require("express")
const adminRouter = express.Router()

const {adminLogin} = require("../controllers/adminController")
const { approveComment,
  rejectComment,
  deleteComment
} = require("../controllers/commentController")

const auth = require("../middleware/auth");

// Admin login
adminRouter.post("/login", adminLogin);

// Comment moderation (protected)
adminRouter.post("/comment/approve", auth, approveComment);
adminRouter.post("/comment/reject", auth, rejectComment);
adminRouter.delete("/comment/delete", auth, deleteComment);

module.exports = adminRouter