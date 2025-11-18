const express = require("express");
const router = express.Router();

const {
  getBlogs,
  getBlogById,
  getApprovedComments,
} = require("../controllers/publicBlogController");

router.get("/", getBlogs);
router.get("/:blogId", getBlogById);
router.get("/:blogId/comments", getApprovedComments);

module.exports = router;
