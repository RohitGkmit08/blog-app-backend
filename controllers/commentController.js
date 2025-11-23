const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const Subscriber = require('../models/Subscriber');
const { sendEmail } = require('../service/sendEmail');


exports.addComment = async (req, res) => {
  try {
    const { blogId, comment, email } = req.body;

    if (!blogId || !comment || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: blogId, comment, and email',
      });
    }

    // Verify blog exists
    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: 'Invalid blogId',
      });
    }

    // Verify user is subscribed
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (!subscriber) {
      return res.status(403).json({
        success: false,
        message: 'Please subscribe to comment on blogs.',
      });
    }

    // Create comment with pending status
    const newComment = await Comment.create({
      blogId,
      userId: email, // Using email as userId identifier
      comment,
      status: 'pending',
    });

    // Notify admin about new comment
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'New Comment Submitted',
        `
        <h3>New Comment Pending Review</h3>
        <p><strong>Blog:</strong> ${blogExists.title}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Comment:</strong> ${comment}</p>
        <p><strong>Comment ID:</strong> ${newComment._id}</p>
      `
      );
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    return res.json({
      success: true,
      message: 'Comment submitted for review',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blogId,
      status: 'approved',
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .select('userId comment createdAt');

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

/**
 * Get comments by blog and status (admin)
 * GET /api/admin/comments/:blogId/:status
 */
exports.getCommentsByStatus = async (req, res) => {
  try {
    const { blogId, status } = req.params;

    if (!['pending', 'approved', 'rejected', 'deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

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

/**
 * Moderate comment (approve/reject/delete)
 * PUT /api/admin/comments/moderate
 */
exports.moderateComment = async (req, res) => {
  try {
    const { commentId, status } = req.body;

    if (!['approved', 'rejected', 'deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: approved, rejected, or deleted',
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Update comment status
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

