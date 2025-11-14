const express = require("express");
const blogRouter = express.Router();

const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

// Public routes
blogRouter.get("/blogs", getAllBlogs);
blogRouter.get("/blogs/:blogId", getSingleBlog);

// Admin routes
blogRouter.post("/blogs", auth, upload.single("image"), createBlog);
blogRouter.put("/blogs/:blogId", auth, upload.single("image"), updateBlog);
blogRouter.delete("/blogs/:blogId", auth, deleteBlog);

module.exports = blogRouter;
