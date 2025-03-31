// controllers.js
const Media = require("../models/eventModels");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUtils");

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file was uploaded" });

    const fileUrl = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype
    );
    const { title, category, type } = req.body;

    const newMedia = new Media({
      title,
      category,
      type,
      src: fileUrl,
      thumbnail: type === "video" ? req.body.thumbnail || "" : fileUrl,
    });

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    await deleteFromCloudinary(media.src);
    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
