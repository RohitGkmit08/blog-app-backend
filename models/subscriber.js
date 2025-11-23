const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
subscriberSchema.index({ email: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);

