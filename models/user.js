const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    emailPreference: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// hashing password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// comparing  password
userSchema.methods.comparePassword = async function (plain) {
  return await bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
