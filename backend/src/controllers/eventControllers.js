const Event = require("../models/eventModels");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUtils");
const mongoose = require("mongoose");

exports.createEvent = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // 📝 Destructure and validate incoming data
    const {
      title,
      date,
      time,
      venue,
      description,
      ticketLink = "",
      youtubeLink = "",
      eventType = "upcoming",
    } = req.body;

    // 🚨 Validate required fields
    if (!title || !date || !time || !venue || !description) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        missingFields: {
          title: !title,
          date: !date,
          time: !time,
          venue: !venue,
          description: !description,
        },
      });
    }

    // 📅 Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Invalid date format",
      });
    }

    let mediaUrl = ""; // ✅ Initialize mediaUrl

    // 🌄 Upload image/video if provided
    if (req.file) {
      try {
        const isVideo = req.file.mimetype.startsWith("video/");
        mediaUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype,
          isVideo
        );
      } catch (uploadError) {
        console.error("Media Upload Error:", uploadError);
        return res.status(500).json({
          status: "error",
          message: "Media upload failed",
        });
      }
    }

    // 🎟️ Create new event
    const newEvent = new Event({
      title,
      date: parsedDate,
      time,
      venue,
      description,
      ticketLink,
      youtubeLink,
      eventType,
      image: mediaUrl, // Stores image or video URL
    });

    // 💾 Save event
    const savedEvent = await newEvent.save();
    console.log("Saved Event:", savedEvent);

    // ✅ Respond with success
    res.status(201).json({
      status: "success",
      data: savedEvent,
    });
  } catch (error) {
    console.error("Event Creation Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // Find existing event to handle image replacement
    const existingEvent = await Event.findById(req.params.id);

    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Upload new image if provided
    let imageUrl = existingEvent.image;
    if (req.file) {
      try {
        // Delete old image from Cloudinary if it exists and is not the default
        if (
          existingEvent.image &&
          existingEvent.image !== "https://example.com/default-event.jpg"
        ) {
          await deleteFromCloudinary(existingEvent.image);
        }

        // Upload new image
        imageUrl = await uploadToCloudinary(req.file.path);
      } catch (uploadError) {
        console.error("Image Update Error:", uploadError);
        // Optional: Keep existing image or handle error
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      image: imageUrl,
    };

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    // Find event to get image URL before deletion
    const eventToDelete = await Event.findById(req.params.id);

    if (!eventToDelete) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Delete image from Cloudinary if it exists and is not the default
    if (
      eventToDelete.image &&
      eventToDelete.image !== "https://example.com/default-event.jpg"
    ) {
      try {
        await deleteFromCloudinary(eventToDelete.image);
      } catch (deleteError) {
        console.error("Image Deletion Error:", deleteError);
        // Optional: Continue with event deletion
      }
    }

    // Delete event from database
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering (for date ranges, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Event.find(JSON.parse(queryStr));

    // 3) Sorting (default by date ascending)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("date");
    }

    // 4) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // exclude version key by default
    }

    // 5) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const events = await query;

    // Calculate current status for each event
    const now = new Date();
    const eventsWithStatus = events.map((event) => {
      const eventDate = new Date(event.date);
      const today = new Date(now.setHours(0, 0, 0, 0));
      const compareDate = new Date(eventDate.setHours(0, 0, 0, 0));

      let status;
      if (compareDate.getTime() === today.getTime()) {
        status = "happening today";
      } else if (eventDate < now) {
        status = "past";
      } else {
        status = "upcoming";
      }

      return {
        ...event.toObject(),
        currentStatus: status,
      };
    });

    // Group events by status
    const groupedEvents = {
      upcoming: eventsWithStatus.filter((e) => e.currentStatus === "upcoming"),
      happeningToday: eventsWithStatus.filter(
        (e) => e.currentStatus === "happening today"
      ),
      past: eventsWithStatus.filter((e) => e.currentStatus === "past"),
    };

    res.status(200).json({
      status: "success",
      results: events.length,
      data: {
        events: groupedEvents,
        // Pagination info
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: await Event.countDocuments(JSON.parse(queryStr)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    // Validate the ID parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid event ID format",
      });
    }

    const event = await Event.findById(req.params.id).select("-__v"); // Exclude version key

    if (!event) {
      return res.status(404).json({
        status: "fail",
        message: "No event found with that ID",
      });
    }

    // Check if event date has passed and update status if needed
    const now = new Date();
    const eventDate = new Date(event.date);
    const today = new Date(now.setHours(0, 0, 0, 0));
    const compareDate = new Date(eventDate.setHours(0, 0, 0, 0));

    let status;
    if (compareDate.getTime() === today.getTime()) {
      status = "happening today";
    } else if (eventDate < now) {
      status = "past event";
    } else {
      status = "upcoming";
    }

    res.status(200).json({
      status: "success",
      data: {
        ...event.toObject(),
        currentStatus: status,
      },
    });
  } catch (error) {
    // Handle specific Mongoose errors
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid event ID",
      });
    }

    // Pass other errors to the global error handler
    next(error);
  }
};
