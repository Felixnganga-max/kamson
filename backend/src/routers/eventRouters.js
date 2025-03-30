const express = require("express");
const eventController = require("../controllers/eventControllers");
const { upload } = require("../utils/cloudinaryUtils"); // Import multer configuration

const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(upload.single("image"), eventController.createEvent); // ✅ Use multer for image uploads

router
  .route("/:id")
  .get(eventController.getEventById)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
