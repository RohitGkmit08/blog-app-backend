const jwt = require('jsonwebtoken');
require('dotenv').config();

// ADMIN LOGIN
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

// get subscribed users.
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
