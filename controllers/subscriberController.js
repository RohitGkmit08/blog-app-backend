const Subscriber = require("../models/subscriber");
const { sendEmail } = require("../service/sendEmail");

exports.addSubscriber = async (req, res) => {
  
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    // Check duplicate
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res
        .status(200)
        .json({ success: true, message: "Already subscribed" });
    }

    // Create subscriber
    const newSubscriber = await Subscriber.create({ email });

    // Send confirmation email
    const emailResult = await sendEmail(
      email,
      "You're subscribed to BlogApp",
      `<p>Thanks for subscribing! You'll receive an email when new blogs are published.</p>`
    );

    // If email failed → rollback DB 
    if (!emailResult.success) {
      console.log("Welcome email failed:", emailResult.error);

      try {
        await Subscriber.findByIdAndDelete(newSubscriber._id);
      } catch (cleanupError) {
        console.error(
          "Failed to rollback subscriber after email failure:",
          cleanupError.message
        );
      }

      return res.status(500).json({
        success: false,
        message: "Could not send confirmation email. Please try again.",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Subscribed successfully" });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, subscribers });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
