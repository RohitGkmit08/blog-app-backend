const express = require("express");
const commentRouter = express.Router();


const { addComment } = require("../controllers/blogController");


const { getBlogComment } = require("../controllers/commentController");

// Add comment (public)
commentRouter.post("/comments", addComment);


// Get approved comments for a blog
commentRouter.get("/comments/:blogId", getBlogComment);

module.exports = commentRouter;
