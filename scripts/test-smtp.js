require('dotenv').config();
const transporter = require('../config/nodeMailer');

transporter
  .verify()
  .then(() => {
    console.log('SMTP transporter OK');
    process.exit(0);
  })
  .catch((err) => {
    console.error('SMTP transporter error:', err.message || err);
    process.exit(1);
  });
