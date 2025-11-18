const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'Email already exists',
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      emailPreference: false,
    });

    return res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: 'user',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle email subscription
exports.toggleSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    user.emailPreference = !user.emailPreference;
    await user.save();

    return res.json({
      success: true,
      message: user.emailPreference
        ? 'Subscribed successfully'
        : 'Unsubscribed successfully',
      subscribed: user.emailPreference,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch all subscribed users (admin)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await User.find({ emailPreference: true })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      subscribers,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
