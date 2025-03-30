const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    time: {
      type: String,
      required: [true, "Please provide an event time"],
    },
    venue: {
      type: String,
      required: [true, "Please provide an event venue"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    ticketLink: {
      type: String,
      default: "",
    },
    youtubeLink: {
      type: String,
      default: "",
    },
    eventType: {
      type: String,
      enum: ["upcoming", "past", "today"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for current status (not stored in DB)
EventSchema.virtual("status").get(function () {
  const now = new Date();
  const eventDate = new Date(this.date);

  // Reset time components for date comparison
  const today = new Date(now.setHours(0, 0, 0, 0));
  const compareDate = new Date(eventDate.setHours(0, 0, 0, 0));

  if (compareDate.getTime() === today.getTime()) {
    return "today";
  } else if (this.date < now) {
    return "past";
  } else {
    return "upcoming";
  }
});

// Middleware to update eventType before saving
EventSchema.pre("save", function (next) {
  const now = new Date();
  const eventDate = new Date(this.date);

  // Compare dates without time components
  const today = new Date(now.setHours(0, 0, 0, 0));
  const compareDate = new Date(eventDate.setHours(0, 0, 0, 0));

  if (compareDate.getTime() === today.getTime()) {
    this.eventType = "today";
  } else if (this.date < now) {
    this.eventType = "past";
  } else {
    this.eventType = "upcoming";
  }

  next();
});

// Add a static method to update past events in bulk
EventSchema.statics.updatePastEvents = async function () {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));

  return this.updateMany(
    {
      date: { $lt: today },
      eventType: { $ne: "past" },
    },
    {
      $set: { eventType: "past" },
    }
  );
};

module.exports = mongoose.model("Event", EventSchema);
