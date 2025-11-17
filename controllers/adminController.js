const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const { notifyAllSubscribers } = require('../service/subscriberService');

// admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate credentials
    if (email !== process.env.ADMIN_ID || password !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get subscribed user -> admin
exports.getSubscribedUsers = async (req, res) => {
  try {
    const subscribers = await User.find(
      { emailPreference: true },
      { name: 1, email: 1, createdAt: 1 },
    ).sort({ createdAt: -1 });

    return res.json({
      success: true,
      subscribers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// notify subscribers
exports.notifySubscribers = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.json({
        success: false,
        message: 'subject and message are required',
      });
    }

    const html = `<p>${message}</p>`;

    const result = await notifyAllSubscribers(subject, html);

    return res.json({
      success: true,
      message: 'Emails sent successfully',
      notifiedUsers: result.count,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
