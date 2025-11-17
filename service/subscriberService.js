const User = require('../models/user');
const { sendEmail } = require('./emailService');

exports.notifyAllSubscribers = async (subject, html) => {
  // Get only users who have enabled emailPreference
  const subscribers = await User.find({ emailPreference: true }).select(
    'email',
  );

  if (!subscribers.length) {
    return { success: false, message: 'No subscribers found' };
  }

  for (const sub of subscribers) {
    await sendEmail(sub.email, subject, html);
  }

  return { success: true, count: subscribers.length };
};
