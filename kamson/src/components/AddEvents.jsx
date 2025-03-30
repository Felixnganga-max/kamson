import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Upload,
  Check,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";

const FullPageLoader = () => {
  const loaderVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const messages = [
    "Creating your epic event...",
    "Uploading magical details...",
    "Preparing event awesomeness...",
    "Crafting your memorable moment...",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/80 via-blue-500/80 to-pink-500/80 backdrop-blur-lg">
      <div className="flex space-x-4 mb-6">
        {[1, 2, 3, 4].map((box) => (
          <motion.div
            key={box}
            variants={loaderVariants}
            initial="initial"
            animate="animate"
            className="w-16 h-16 bg-white/30 rounded-lg backdrop-blur-md"
            style={{
              animationDelay: `${box * 0.2}s`,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold text-white"
      >
        {currentMessage}
      </motion.p>
    </div>
  );
};

const AddEvents = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    image: null,
    ticketLink: "",
    youtubeLink: "",
    eventType: "upcoming",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (submitStatus?.type === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.venue ||
      !formData.description ||
      !formData.image
    ) {
      setSubmitStatus({
        type: "error",
        message: "All fields including image are required",
      });
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);
      setUploadProgress(0);

      // Create FormData object
      const formDataToSend = new FormData();

      // Append all fields including the image file
      formDataToSend.append("title", formData.title);
      formDataToSend.append(
        "date",
        new Date(`${formData.date}T${formData.time}:00.000Z`).toISOString()
      );
      formDataToSend.append("time", formData.time);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image); // This is the file
      formDataToSend.append("ticketLink", formData.ticketLink || "");
      formDataToSend.append("youtubeLink", formData.youtubeLink || "");
      formDataToSend.append("eventType", formData.eventType);

      // Send everything to your backend
      const response = await axios.post(
        "https://kamson-558z.vercel.app/api/events",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Success handling
      setSubmitStatus({
        type: "success",
        message: "Event added successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        venue: "",
        description: "",
        image: null,
        ticketLink: "",
        youtubeLink: "",
        eventType: "upcoming",
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to add event. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border-4 border-purple-100"
        >
          <div className="p-6 sm:p-10 bg-gradient-to-br from-white to-purple-50/30">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Add New Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="date"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Calendar className="mr-2 text-purple-500" size={18} />
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Clock className="mr-2 text-purple-500" size={18} />
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label
                  htmlFor="venue"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <MapPin className="mr-2 text-purple-500" size={18} />
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  id="venue"
                  required
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  placeholder="Enter event venue"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  placeholder="Describe your event"
                ></textarea>
              </div>

              {/* Event Type and Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="eventType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    id="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                  >
                    <option value="upcoming">Upcoming Event</option>
                    <option value="past">Past Event</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer flex items-center px-4 py-2 border-2 border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 transition duration-300">
                      <Upload className="mr-2" size={18} />
                      Upload Image
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="ml-4 h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {loading && uploadProgress > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="ticketLink"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ticket Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="ticketLink"
                    id="ticketLink"
                    value={formData.ticketLink}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                    placeholder="https://tickets.com/event"
                  />
                </div>
                <div>
                  <label
                    htmlFor="youtubeLink"
                    className="block text-sm font-medium text-gray-700"
                  >
                    YouTube Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="youtubeLink"
                    id="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-2 border-purple-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                    placeholder="https://youtube.com/video"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadProgress < 100
                        ? "Uploading..."
                        : "Creating Event..."}
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>

            {/* Submission Status */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 p-4 rounded-lg text-center ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <Check className="inline mr-2" />
                ) : (
                  <X className="inline mr-2" />
                )}
                {submitStatus.message}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddEvents;
