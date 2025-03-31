const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dfuv6m4va",
  api_key: process.env.CLOUDINARY_API_KEY || "528637913152672",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "kyLOb0R45nMaH-3c2AgxoDwRw1A",
});

// Multer Storage (Memory)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG, GIF, WEBP images, and MP4 videos are allowed!"),
      false
    );
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 800 * 1024 * 1024 }, // 20MB limit
});

// For large video uploads, use stream-based approach instead of base64
const uploadToCloudinary = async (
  fileBuffer,
  mimetype,
  folder = "products"
) => {
  try {
    if (!fileBuffer) throw new Error("No file provided");

    const fileType = mimetype.startsWith("video/") ? "video" : "image";

    // Create a promise to handle the upload
    return new Promise((resolve, reject) => {
      // For video uploads, use a more efficient approach
      if (fileType === "video") {
        // Create a Readable stream from the buffer
        const streamifier = require("streamifier");
        const stream = streamifier.createReadStream(fileBuffer);

        // Use Cloudinary's upload_stream API
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: fileType,
            chunk_size: 6000000, // 6MB chunks
            timeout: 120000, // Longer timeout for videos (120s)
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.pipe(uploadStream);
      } else {
        // For images, base64 is fine
        const base64File = `data:${mimetype};base64,${fileBuffer.toString(
          "base64"
        )}`;
        cloudinary.uploader.upload(
          base64File,
          {
            folder: folder,
            resource_type: fileType,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
      }
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};
// Delete from Cloudinary
const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) throw new Error("No file URL provided");

    const match = fileUrl.match(/\/v\d+\/(.+)\.(jpg|png|gif|webp|mp4)$/);
    if (!match) throw new Error("Invalid Cloudinary URL");

    const publicId = match[1];
    const resourceType = fileUrl.includes(".mp4") ? "video" : "image";

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    throw new Error("File deletion failed");
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
