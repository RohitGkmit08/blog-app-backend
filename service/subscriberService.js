const Subscriber = require("../models/subscriber");
const { sendEmail } = require("../service/sendEmail");

exports.notifyAllSubscribers = async (subject, html) => {
  try {
    const subscribers = await Subscriber.find({}, "email");

    if (!subscribers.length) {
      return { success: false, message: "No subscribers found" };
    }

    const emails = subscribers.map((s) => s.email);

    const result = await sendEmail(emails, subject, html);

    if (!result.success) {
      throw new Error(result.error || "Email sending failed");
    }

    return { success: true, count: subscribers.length };
  } catch (error) {
    console.log("Notify Subscribers Error:", error.message);
    return { success: false, message: "Email sending failed" };
  }
};
