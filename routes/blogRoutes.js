const express = require("express");
const blogRouter = express.Router();

const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  deleteBlogById, 
  togglePublish 
} = require("../controllers/blogController");

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

// Create blog
blogRouter.post("/add", auth, upload.single("image"), createBlog);

// Get all published blogs (public)
blogRouter.get("/all", getAllBlogs);

// Get blog by ID (public)
blogRouter.get("/:blogId", getBlogById);

// Delete blog (admin only)
blogRouter.delete("/delete/:id", auth, deleteBlogById);

// Toggle publish (admin only)
blogRouter.patch("/toggle/:id", auth, togglePublish);

module.exports = blogRouter;
