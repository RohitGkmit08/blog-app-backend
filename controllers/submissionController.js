const { sendEmail } = require('../service/sendEmail');

const TARGET_EMAIL =
  process.env.GUEST_SUBMISSION_TARGET || 'sinharohit96690@gmail.com';

/**
 * Build HTML email content for guest submission
 */
const buildHtml = (payload) => {
  const {
    title,
    subTitle,
    category,
    description,
    authorName,
    socialLinks,
    contactEmail,
  } = payload;

  return `
    <h2>New Guest Blog Submission</h2>
    <p><strong>Title:</strong> ${title}</p>
    ${subTitle ? `<p><strong>Subtitle:</strong> ${subTitle}</p>` : ''}
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Author:</strong> ${authorName}</p>
    <p><strong>Contact Email:</strong> ${contactEmail}</p>
    ${socialLinks ? `<p><strong>Social Links:</strong><br/>${socialLinks}</p>` : ''}
    <p><strong>Description / Content:</strong></p>
    <div>${description.replace(/\n/g, '<br/>')}</div>
  `;
};


exports.submitGuestArticle = async (req, res) => {
  try {
    const {
      title,
      subTitle,
      category,
      description,
      authorName,
      socialLinks,
      contactEmail,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !category ||
      !description ||
      !authorName ||
      !contactEmail
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Title, category, description, author name, and contact email are required.',
      });
    }

    // Prepare attachments if image provided
    const attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    // Build email content
    const html = buildHtml({
      title,
      subTitle,
      category,
      description,
      authorName,
      socialLinks,
      contactEmail,
    });

    console.log(`[Guest Submission] Sending email to: ${TARGET_EMAIL}`);
    console.log(`[Guest Submission] Subject: Guest Submission: ${title}`);
    console.log(
      `[Guest Submission] Attachments: ${attachments.length} file(s)`
    );

    // Send email
    const emailResult = await sendEmail(
      TARGET_EMAIL,
      `Guest Submission: ${title}`,
      html,
      { attachments }
    );

    if (!emailResult.success) {
      console.error(
        `[Guest Submission] Email failed: ${emailResult.error}`
      );
      throw new Error(emailResult.error || 'Unable to send email');
    }

    console.log(
      `[Guest Submission] Email sent successfully to ${TARGET_EMAIL}`
    );

    return res.json({
      success: true,
      message: 'Submission sent successfully. We will review it shortly.',
    });
  } catch (error) {
    console.error('submitGuestArticle error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send submission. Please try again later.',
    });
  }
};

