// controllers/adminController.js

const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
require("dotenv").config();


// ADMIN LOGIN
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


// GET ALL BLOGS (ADMIN)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        return res.json({
            success: true,
            blogs
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// GET ALL COMMENTS (ADMIN)
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({})
            .populate("blog")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            comments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ADMIN DASHBOARD DATA
exports.getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 });
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const draft = await Blog.countDocuments({ isPublished: false });

        const dashboardData = { blogs, comments, draft, recentBlogs };

        return res.json({
            success: true,
            dashboardData
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// DELETE COMMENT
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.body;

        await Comment.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "comment deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// APPROVE COMMENT
exports.isApproved = async (req, res) => {
    try {
        const { id } = req.body;

        await Comment.findByIdAndUpdate(id, { isApproved: true });

        return res.json({
            success: true,
            message: "comment approved successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
