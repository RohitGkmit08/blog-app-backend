const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'all fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: 'email already registered',
      });
    }

    const user = await User.create({ name, email, password });

    return res.json({
      success: true,
      message: 'user registered',
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update preference
exports.updateEmailPreference = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { subscribe } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { emailPreference: subscribe },
      { new: true },
    );

    return res.json({
      success: true,
      message: subscribe ? 'Subscribed to emails' : 'Unsubscribed from emails',
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
