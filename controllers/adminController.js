const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const { create } = require("../models/comment");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_ID || password !== process.env.ADMIN_KEY) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { email },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.json({
            success: true,
            token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.getAllBlogs = async(req , res) => {
    try{
        const blogs = await Blog.find({}).sort({createdAt:-1});
         return res.json({
            success: true,
            blogs
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getAllComments = async (req , res) => {
    try{
        let comments = await Comment.find({}).populate("blog").sort({createdAt:-1})
        return res.json({
            success: true,
            comments
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


exports.getDashboard = async(req , res)=>{
    try{
        const recentBlogs = await Blog.find({}).sort({createdAt:-1});
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const draft = await Blog.countDocuments({isPublished:false})

        const dashboardData = {
            blogs, comments, draft, recentBlogs
        }
        res.json({
            success: true,
            dashboardData
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


exports.deleteComment = async(req , res) => {
    try{
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);

        res.json({
            success:true,
            message:"comment deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.isApproved = async(req , res) => {
    try{
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved : true});

        res.json({
            success:true,
            message:"comment approved successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}