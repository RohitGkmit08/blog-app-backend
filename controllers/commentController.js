const Comment = require("../models/comment");

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
