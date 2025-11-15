const express = require("express");
const blogRouter = express.Router();

const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  fetchApprovedComments
} = require("../controllers/blogController");

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

// Public routes
blogRouter.get("/blogs", getBlogs);
blogRouter.post("/blogs/comments", fetchApprovedComments);

// Admin routes
blogRouter.post("/blogs", auth, upload.single("image"), createBlog);
blogRouter.put("/blogs/:blogId", auth, upload.single("image"), updateBlog);
blogRouter.delete("/blogs/:blogId", auth, deleteBlog);



module.exports = blogRouter;
