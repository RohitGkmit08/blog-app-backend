const express = require("express");
const blogRouter = express.Router();

const { createBlog, addComment, getBlogComment } = require("../controllers/blogController");
const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

blogRouter.post("/add", auth, upload.single("image"), createBlog);
blogRouter.post("/add-comment", addComment)
blogRouter.post("/comment", getBlogComment)

module.exports = blogRouter;
