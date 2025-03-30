import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Youtube,
  Loader2,
  Edit2,
  Trash2,
  Plus,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageEvents = () => {
  // State management
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [happeningToday, setHappeningToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    image: "",
    ticketLink: "",
    youtubeLink: "",
    isUpcoming: true,
  });

  // Fetch events from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://kamson-558z.vercel.app/api/events"
        );

        console.log("API Response:", response.data);

        // Extract events data from nested structure
        if (response.data && response.data.data && response.data.data.events) {
          const eventsData = response.data.data.events;

          // Set the categorized events directly
          setUpcomingEvents(eventsData.upcoming || []);
          setPastEvents(eventsData.past || []);
          setHappeningToday(eventsData.happeningToday || []);

          console.log("Upcoming events:", eventsData.upcoming);
          console.log("Past events:", eventsData.past);
          console.log("Happening today:", eventsData.happeningToday);

          setError(null);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load events");
        setUpcomingEvents([]);
        setPastEvents([]);
        setHappeningToday([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      time: event.time || "",
      venue: event.venue || "",
      image: event.image || "",
      ticketLink: event.ticketLink || "",
      youtubeLink: event.youtubeLink || "",
      isUpcoming: event.isUpcoming || true,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setCurrentEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      image: "",
      ticketLink: "",
      youtubeLink: "",
      isUpcoming: true,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && typeof formData[key] !== "string") {
          if (formData[key]) formDataToSend.append("image", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (isEditing && currentEvent) {
        response = await axios.put(
          `https://kamson-558z.vercel.app/api/events/${currentEvent._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event updated successfully!");
      } else {
        response = await axios.post(
          "https://kamson-558z.vercel.app/api/events",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event created successfully!");
      }

      // Refetch events to update all categories
      const refreshResponse = await axios.get(
        "https://kamson-558z.vercel.app/api/events"
      );
      if (
        refreshResponse.data &&
        refreshResponse.data.data &&
        refreshResponse.data.data.events
      ) {
        const eventsData = refreshResponse.data.data.events;
        setUpcomingEvents(eventsData.upcoming || []);
        setPastEvents(eventsData.past || []);
        setHappeningToday(eventsData.happeningToday || []);
      }

      closeModal();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentEvent) return;

    try {
      setLoading(true);
      await axios.delete(
        `https://kamson-558z.vercel.app/api/events/${currentEvent._id}`
      );

      // Refetch events to update all categories
      const refreshResponse = await axios.get(
        "https://kamson-558z.vercel.app/api/events"
      );
      if (
        refreshResponse.data &&
        refreshResponse.data.data &&
        refreshResponse.data.data.events
      ) {
        const eventsData = refreshResponse.data.data.events;
        setUpcomingEvents(eventsData.upcoming || []);
        setPastEvents(eventsData.past || []);
        setHappeningToday(eventsData.happeningToday || []);
      }

      toast.success("Event deleted successfully!");
      closeModal();
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(err.response?.data?.message || "Failed to delete event");
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  // Format time safely
  const formatTime = (timeString, dateString) => {
    if (timeString) {
      if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        const [hours, minutes] = timeString.split(":");
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        return time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return timeString;
    }

    if (dateString) {
      try {
        return new Date(dateString).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Time not available";
      }
    }

    return "Time not available";
  };

  // Get image URL with fallback - handles Cloudinary URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") {
      return "https://via.placeholder.com/400x200?text=No+Image";
    }

    // If it's already a full URL (http/https) or a Cloudinary URL
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    // Fallback for local development (you can remove this if not needed)
    return `https://kamson-558z.vercel.app/${imagePath.replace(/^\//, "")}`;
  };

  // Combine all events for display in the management view
  const allEvents = [...happeningToday, ...upcomingEvents, ...pastEvents];

  // Loading state
  if (loading && allEvents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <span className="ml-2 text-purple-600">Loading events...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg text-center">
          <p className="font-bold">Error loading events</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Check the console for more details.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/5 via-purple-800/5 to-blue-600/5 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 sm:text-4xl">
            Manage Events
          </h2>
          <p className="mt-2 text-xl text-gray-700">
            Create, edit, and delete events
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Event
        </motion.button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allEvents.map((event, index) => (
          <motion.div
            key={event._id || index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-purple-100 hover:border-pink-200 transition-all relative h-full flex flex-col group"
          >
            {/* Status Badge */}
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                happeningToday.some((e) => e._id === event._id)
                  ? "bg-blue-100 text-blue-800"
                  : upcomingEvents.some((e) => e._id === event._id)
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {happeningToday.some((e) => e._id === event._id)
                ? "Happening Today"
                : upcomingEvents.some((e) => e._id === event._id)
                ? "Upcoming"
                : "Past"}
            </div>

            {/* Event Image */}
            <div className="aspect-video overflow-hidden">
              <img
                src={getImageUrl(event.image)}
                alt={event.title || "Event image"}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Event+Image";
                }}
              />
            </div>

            {/* Event Content */}
            <div className="p-6 bg-gradient-to-br from-white to-purple-50 flex-grow">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                {event.title || "Untitled Event"}
              </h3>

              <p className="mt-2 text-gray-700 line-clamp-2">
                {event.description || "No description available"}
              </p>

              {/* Event Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="text-sm">
                    {formatTime(event.time, event.date)}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="text-sm line-clamp-1">
                    {event.venue || "Venue TBA"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setCurrentEvent(event);
                    setIsDeleting(true);
                    setShowModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {allEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No events found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Create your first event
          </button>
        </div>
      )}

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">
                    {isDeleting
                      ? "Confirm Deletion"
                      : isEditing
                      ? "Edit Event"
                      : "Create New Event"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {isDeleting ? (
                  <div className="text-center">
                    <p className="text-lg mb-6">
                      Are you sure you want to delete{" "}
                      <span className="font-bold">"{currentEvent?.title}"</span>
                      ? This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-5 w-5 mr-2" />
                        )}
                        Delete Event
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        rows="3"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <input
                          type="text"
                          name="time"
                          placeholder="e.g. 19:00 or 7:00 PM"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue *
                      </label>
                      <input
                        type="text"
                        name="venue"
                        required
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ticket Link
                        </label>
                        <input
                          type="url"
                          name="ticketLink"
                          placeholder="https://..."
                          value={formData.ticketLink}
                          onChange={handleInputChange}
                          className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube Link (for past events)
                        </label>
                        <input
                          type="url"
                          name="youtubeLink"
                          placeholder="https://..."
                          value={formData.youtubeLink}
                          onChange={handleInputChange}
                          className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Image
                      </label>
                      {typeof formData.image === "string" && formData.image && (
                        <div className="mb-2">
                          <img
                            src={getImageUrl(formData.image)}
                            alt="Current event"
                            className="h-32 object-cover rounded-md"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Current image
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isUpcoming"
                          checked={formData.isUpcoming}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isUpcoming: e.target.checked,
                            })
                          }
                          className="rounded border-purple-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          This is an upcoming event
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-colors flex items-center"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                          <Save className="h-5 w-5 mr-2" />
                        )}
                        {isEditing ? "Update Event" : "Create Event"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEvents;
