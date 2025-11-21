const express = require("express");
const router = express.Router();

const {
  getBlogs,
  getBlog,
  getApprovedComments,
} = require("../controllers/publicBlogController");

// PUBLIC ROUTES
router.get("/", getBlogs);
router.get("/:identifier", getBlog);
router.get("/:blogId/comments", getApprovedComments);

module.exports = router;
