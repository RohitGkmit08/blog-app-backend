
const Comment = require("../models/comment")


// Approve comment
exports.approveComments = async (req , res) => {
    try{
        const {commentId} = req.body;

        if(!commentId){
            return res.json({
                success:false,
                message:"commentId is required"
            })
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.json({
                success:false,
                message:"No comment found"
            })
        }

        comment.status = "approved"
        await comment.save()

        return res.json({
            success:true,
            message:"Comment approved"
        })
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

// Reject comment 
exports.rejectComment = async (req , res) => {

    const {commentId} = req.body

    try{
        if (!commentId) {
        return res.json({
        success: false,
        message: "commentId is required"
      });
    }

    const comment = await Comment.findById(commentId);
        if (!comment) {
        return res.json({
        success: false,
        message: "Comment not found"
        });
    } 

     comment.status = "rejected"
     await comment.save()

     return res.json({
        success:true,
        message:"comment rejected"
     })
    }

    catch(err){
        return res.status(500).json({
        success: false,
        message: err.message
    });
    }
}

// Delete Comment
exports.deleteComment = async (req , res) => {
    try{
        const {commentId} = req.body;
        if(!commentId){
            return res.json({
                success:false,
                message:"Comment ID is required"
            })
        }

        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.json({
                success:false,
                message:"no comment found"
            })
        } 

        comment.deletedAt = new Date();
        await comment.save();

        return res.json({
            success:true,
            message:"comment deleted"
        })
    }

    catch(err){
        return res.status(500).json({
        success: false,
        message: err.message
    });

    }
}