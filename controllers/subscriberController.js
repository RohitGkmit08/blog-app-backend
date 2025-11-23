const Subscriber = require('../models/Subscriber');
const { sendEmail } = require('../service/sendEmail');


exports.addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if already subscribed
    const exists = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(200).json({
        success: true,
        message: 'Already subscribed',
      });
    }

    // Create new subscriber
    const newSubscriber = await Subscriber.create({
      email: email.toLowerCase(),
    });

    // Send confirmation email
    const emailResult = await sendEmail(
      email,
      "You're subscribed to BlogApp",
      `<p>Thanks for subscribing! You'll receive updates soon.</p>`
    );

    // If email failed, remove subscriber
    if (!emailResult.success) {
      await Subscriber.findByIdAndDelete(newSubscriber._id);
      return res.status(500).json({
        success: false,
        message: 'Could not send confirmation email.',
      });
    }

    // Notify admin about new subscriber
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'New Subscriber Joined',
        `<p>A new user subscribed:</p><p><strong>${email}</strong></p>`
      );
    } catch (adminEmailError) {
      console.error('Failed to notify admin:', adminEmailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .select('email createdAt');

    return res.status(200).json({
      success: true,
      subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

