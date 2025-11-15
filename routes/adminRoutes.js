const express = require("express");
const adminRouter = express.Router();

const { adminLogin } = require("../controllers/adminController");
const { moderateComment } = require("../controllers/commentController");
const auth = require("../middleware/auth");

// Admin login
adminRouter.post("/login", adminLogin);

// Comment moderation (approve/reject/delete)
console.log("moderateComment is:", moderateComment);
adminRouter.put("/comments/moderate", auth, moderateComment);
console.log("moderateComment is:", moderateComment);

module.exports = adminRouter;
