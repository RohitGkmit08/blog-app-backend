const express = require("express");
const commentRouter = express.Router();

const {
  addComment,
  getBlogComment
} = require("../controllers/blogController");

// Add comment (public)
commentRouter.post("/comments", addComment);

// Get all comments for a blog (public)
commentRouter.get("/comments/:blogId", getBlogComment);

module.exports = commentRouter;
