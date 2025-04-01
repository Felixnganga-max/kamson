const Media = require("../models/media");
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
      req.file.mimetype,
      "media" // Store in a "media" folder
    );

    const { title, category, type } = req.body;

    // Validate required fields
    if (!title || !category || !type) {
      return res.status(400).json({
        message:
          "Missing required fields. Please provide title, category, and type",
      });
    }

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
    console.error("Media upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMedia = async (req, res) => {
  try {
    const { category, type } = req.query;
    const query = {};

    if (category) query.category = category;
    if (type) query.type = type;

    const media = await Media.find(query).sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Update fields
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.thumbnail) updates.thumbnail = req.body.thumbnail;

    const updatedMedia = await Media.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Delete from cloudinary first
    await deleteFromCloudinary(media.src);

    // If media is a video and has a separate thumbnail, delete that too
    if (
      media.type === "video" &&
      media.thumbnail &&
      media.thumbnail !== media.src
    ) {
      await deleteFromCloudinary(media.thumbnail);
    }

    // Then delete from database
    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
