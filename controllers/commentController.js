const Comment = require("../models/comment");


exports.moderateComment = async (req, res) => {
    try {
        const { commentId, status } = req.body;

        // Validate inputs
        if (!commentId) {
            return res.json({
                success: false,
                message: "commentId is required"
            });
        }

        if (!["approved", "rejected", "deleted"].includes(status)) {
            return res.json({
                success: false,
                message: "Invalid status"
            });
        }

        // Fetch comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.json({
                success: false,
                message: "No comment found"
            });
        }

        // Apply changes
        if (status === "deleted") {
            comment.status = "deleted";
            comment.deletedAt = new Date();
        } else {
            comment.status = status;
            comment.deletedAt = null;
        }

        await comment.save();

        return res.json({
            success: true,
            message: `Comment ${status}`
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
