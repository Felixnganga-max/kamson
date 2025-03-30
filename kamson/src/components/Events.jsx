import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "@headlessui/react";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Youtube,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";

const Events = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [happeningToday, setHappeningToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showTodayBanner, setShowTodayBanner] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    date: "",
    message: "",
  });

  // Fetch events from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/events");

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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `New Service Request:\n\nName: ${formData.name}\nEmail: ${formData.email}\nEvent Type: ${formData.eventType}\nDate: ${formData.date}\nDetails: ${formData.message}`;
    window.open(
      `https://wa.me/254797743366?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
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
    // First try using the time field if available
    if (timeString) {
      // Handle "HH:MM" format
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
      return timeString; // Return as-is if not standard format
    }

    // Fallback to date field's time
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

  // Get image URL with fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") {
      return "https://via.placeholder.com/400x200?text=No+Image";
    }

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    // Handle local paths
    return `http://localhost:5000/${imagePath.replace(/^\//, "")}`;
  };

  // Loading state
  if (loading) {
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
    <div className="w-[95vw] mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/10 via-purple-800/10 to-blue-600/10 relative">
      {/* Happening Today Banner */}
      <AnimatePresence>
        {happeningToday.length > 0 && showTodayBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg shadow-lg z-10 flex justify-between items-center"
          >
            <div className="flex items-center">
              <span className="font-bold mr-2">🎉 Happening Today:</span>
              {happeningToday.map((event) => event.title).join(", ")}
            </div>
            <button
              onClick={() => setShowTodayBanner(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 sm:text-4xl">
          Our Events & Services
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-700 sm:mt-4">
          Experience our music live or book us for your special event
        </p>
      </motion.div>

      {/* Tab Interface */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Tab.List className="flex space-x-1 rounded-xl bg-gradient-to-r from-purple-200/30 to-pink-200/30 p-1 max-w-2xl mx-auto">
            {["Upcoming Events", "Past Events", "Book Services"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300
                    ${
                      selected
                        ? "bg-white shadow-lg text-purple-900"
                        : "text-purple-700 hover:bg-white/[0.12] hover:text-purple-600"
                    }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
        </motion.div>

        <Tab.Panels className="mt-8">
          {/* Upcoming Events Panel */}
          <Tab.Panel>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No upcoming events scheduled. Check back soon!
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {upcomingEvents
                    .slice(0, showMore ? upcomingEvents.length : 4)
                    .map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-purple-100 hover:border-pink-200 transition-all relative h-full flex flex-col"
                      >
                        {/* Event Image */}
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={getImageUrl(event.image)}
                            alt={event.title || "Event image"}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
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
                              <span className="text-sm">
                                {formatDate(event.date)}
                              </span>
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

                          {/* Action Button */}
                          <div className="mt-6">
                            {event.ticketLink ? (
                              <a
                                href={event.ticketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                              >
                                <Ticket className="h-5 w-5 mr-2" />
                                Get Tickets
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Ticket info coming soon
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {upcomingEvents.length > 4 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="px-6 py-2 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      {showMore
                        ? "Show Less"
                        : `Show More (${upcomingEvents.length - 4})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </Tab.Panel>

          {/* Past Events Panel */}
          <Tab.Panel>
            {pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No past events to display.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-purple-100 hover:border-pink-200 transition-all relative h-full flex flex-col"
                  >
                    {/* Event Image */}
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.title || "Event image"}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
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
                          <span className="text-sm">
                            {formatDate(event.date)}
                          </span>
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
                            {event.venue || "Venue not specified"}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {event.youtubeLink && (
                        <div className="mt-6">
                          <a
                            href={event.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 transition-all duration-300"
                          >
                            <Youtube className="h-5 w-5 mr-2" />
                            Watch Recording
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Tab.Panel>

          {/* Booking Panel */}
          <Tab.Panel>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-2xl mx-auto border-2 border-purple-100"
            >
              <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-purple-50">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6">
                  Request Our Services
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      What type of event are you planning? *
                    </label>
                    <input
                      type="text"
                      name="eventType"
                      placeholder="e.g. Wedding, Corporate Event, Birthday Party"
                      required
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tell us more about your event
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Location, number of guests, special requests..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center px-4 py-3 border-2 border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                    >
                      Send Request via WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Events;
