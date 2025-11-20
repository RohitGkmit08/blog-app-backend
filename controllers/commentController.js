const Comment = require("../models/comment");
const Blog = require("../models/blog");
const Subscriber = require("../models/subscriber");

// PUBLIC — Add comment (always goes to pending)
exports.addComment = async (req, res) => {
  try {
    const { blogId, userId, comment, email } = req.body;

    if (!blogId || !comment || !email) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.json({
        success: false,
        message: "Invalid blogId",
      });
    }

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(403).json({
        success: false,
        message: "Please subscribe to comment on blogs.",
      });
    }

    await Comment.create({
      blogId,
      userId: userId || email,
      comment,
      status: "pending",
      deletedAt: null,
    });

    return res.json({
      success: true,
      message: "Comment submitted for review",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PUBLIC — Get only approved comments
exports.getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blogId,
      status: "approved",
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .select("userId comment createdAt");

    return res.json({
      success: true,
      comments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ADMIN — Get comments by blog + status
exports.getCommentsByStatus = async (req, res) => {
  try {
    const { blogId, status } = req.params;

    const comments = await Comment.find({
      blogId,
      status,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN — Moderate (approve/reject/delete)
exports.moderateComment = async (req, res) => {
  try {
    const { commentId, status } = req.body;

    if (!["approved", "rejected", "deleted"].includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.json({
        success: false,
        message: "Comment not found",
      });
    }

    if (status === "deleted") {
      comment.status = "deleted";
      comment.deletedAt = new Date();
    } else {
      comment.status = status;
      comment.deletedAt = null;
    }

    comment.updatedAt = new Date();
    await comment.save();

    return res.json({
      success: true,
      message: `Comment ${status}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
