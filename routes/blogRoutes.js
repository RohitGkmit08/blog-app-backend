const express = require("express");
const blogRouter = express.Router();

const {
  createBlog,
  addComment,
  getBlogComment,
  getAllBlogs,
  getBlogBySlug,
} = require("../controllers/blogController");

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

// POST routes
blogRouter.post("/add", auth, upload.single("image"), createBlog);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comment", getBlogComment);

// GET routes (ORDER MATTERS)
blogRouter.get("/all", getAllBlogs); 
blogRouter.get("/:slug", getBlogBySlug);        
console.log("Loaded routes:", blogRouter.stack.map(r => r.route.path));

module.exports = blogRouter;
