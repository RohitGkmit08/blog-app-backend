const express = require("express");
const blogRouter = express.Router();

const { createBlog } = require("../controllers/blogController");
const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

blogRouter.post("/add", auth, upload.single("image"), createBlog);

module.exports = blogRouter;
