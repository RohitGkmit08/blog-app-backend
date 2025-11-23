const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const { notifyAllSubscribers } = require('../service/subscriberService');


exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Validate admin credentials from environment variables
    if (email !== process.env.ADMIN_ID || password !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getSubscribedUsers = async (req, res) => {
  try {
    const subscribers = await User.find(
      { emailPreference: true },
      { name: 1, email: 1, createdAt: 1 }
    ).sort({ createdAt: -1 });

    return res.json({
      success: true,
      subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.notifySubscribers = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required',
      });
    }

    const html = `<p>${message}</p>`;

    const result = await notifyAllSubscribers(subject, html);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || 'Failed to send emails',
      });
    }

    return res.json({
      success: true,
      message: 'Emails sent successfully',
      notifiedUsers: result.count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

