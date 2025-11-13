const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,           
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },


    authorName: {
      type: String,
      required: true,         // displayed on detailed blog page
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",       // supports user commenting feature
      },
    ],

    isPublished: {
      type: Boolean,
      required: true,
    },

    publishedAt: {
      type: Date,             
    },

  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
