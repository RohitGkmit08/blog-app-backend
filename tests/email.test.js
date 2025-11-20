const { sendEmail } = require('../service/sendEmail');
const transporter = require('../config/nodeMailer');

// Mock nodemailer transporter
jest.mock('../config/nodeMailer', () => ({
  sendMail: jest.fn()
}));

describe('Email Service Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_FROM = 'test@example.com';
  });

  // TEST_CASE_13: Send email successfully
  test('TEST_CASE_13: Should send email with valid parameters', async () => {
    transporter.sendMail.mockResolvedValue({
      messageId: 'test-message-id',
      response: '250 OK'
    });

    const result = await sendEmail(
      'recipient@example.com',
      'Test Subject',
      '<p>Test HTML content</p>'
    );

    expect(result.success).toBe(true);

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),   // Accepts any sender string
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>'
      })
    );
  });

  // TEST_CASE_14: Handle email sending failure
  test('TEST_CASE_14: Should return error when email sending fails', async () => {
    transporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

    const result = await sendEmail(
      'recipient@example.com',
      'Test Subject',
      '<p>Test content</p>'
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('SMTP');
  });

  // TEST_CASE_15: Send email to multiple recipients
  test('TEST_CASE_15: Should send email to array of recipients', async () => {
    transporter.sendMail.mockResolvedValue({ messageId: 'test-id' });

    const recipients = ['user1@example.com', 'user2@example.com'];
    const result = await sendEmail(recipients, 'Test', '<p>Content</p>');

    expect(result.success).toBe(true);

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user1@example.com,user2@example.com'
      })
    );
  });
});


