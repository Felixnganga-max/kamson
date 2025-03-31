const express = require("express");
const { upload } = require("../utils/cloudinaryUtils");
const {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} = require("../controllers/media");

const router = express.Router();

router.post("/upload", upload.single("src"), uploadMedia); // Changed "file" -> "src"
router.get("/media", getAllMedia);
router.delete("/media/:id", deleteMedia);

module.exports = router;
