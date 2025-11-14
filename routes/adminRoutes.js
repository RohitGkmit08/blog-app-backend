const express = require("express");
const adminRouter = express.Router();

const { adminLogin } = require("../controllers/adminController");
const { moderateComment } = require("../controllers/commentController");
const auth = require("../middleware/auth");

// Admin login
adminRouter.post("/login", adminLogin);

// Comment moderation (single endpoint for approve/reject/delete)
adminRouter.put("/comments/moderate", auth, moderateComment);

module.exports = adminRouter;
