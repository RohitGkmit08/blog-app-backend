const Comment = require('../models/comment');

console.log('Loaded COMMENT CONTROLLER');

exports.getBlogComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    if (!blogId) {
      return res.json({
        success: false,
        message: 'blogId is required',
      });
    }

    const comments = await Comment.find({
      blogId,
      status: 'approved',
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return res.json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.moderateComment = async (req, res) => {
  try {
    const { commentId, status } = req.body;

    if (!commentId) {
      return res.json({
        success: false,
        message: 'commentId is required',
      });
    }

    if (!['approved', 'rejected', 'deleted'].includes(status)) {
      return res.json({
        success: false,
        message: 'Invalid status',
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.json({
        success: false,
        message: 'No comment found',
      });
    }

    if (status === 'deleted') {
      comment.status = 'deleted';
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
