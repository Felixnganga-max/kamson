// models.js
const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "image"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
