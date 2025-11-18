const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

const {
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const {
  getCommentsByStatus,
  moderateComment,
} = require("../controllers/commentController");

// Admin: Create blog
router.post("/blogs", auth, upload.single("image"), createBlog);

// Admin: Update blog
router.put("/blogs/:blogId", auth, upload.single("image"), updateBlog);

// Admin: Delete blog
router.delete("/blogs/:blogId", auth, deleteBlog);

// Admin: Get comments by status (pending/approved/rejected)
router.get("/comments/:blogId/:status", auth, getCommentsByStatus);

// Admin: Moderate comment (approve/reject/delete)
router.post("/comments/moderate", auth, moderateComment);

module.exports = router;
