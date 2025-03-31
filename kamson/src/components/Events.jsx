import React, { useState, useEffect, useRef } from "react";
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
  Info,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

const Events = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [happeningToday, setHappeningToday] = useState([]);
  const [upcomingSoon, setUpcomingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showTodayBanner, setShowTodayBanner] = useState(true);
  const [showTodayDetails, setShowTodayDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const modalRef = useRef(null);
  const todayBannerRef = useRef(null);

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
        const response = await axios.get(
          "https://kamson-558z.vercel.app/api/events"
        );

        console.log("API Response:", response.data);

        if (response.data && response.data.data && response.data.data.events) {
          const eventsData = response.data.data.events;

          // Set the categorized events directly
          setUpcomingEvents(eventsData.upcoming || []);
          setPastEvents(eventsData.past || []);
          setHappeningToday(eventsData.happeningToday || []);

          // Find events happening in the next 2 days
          const soonEvents = (eventsData.upcoming || []).filter((event) => {
            if (!event.date) return false;
            try {
              const eventDate = new Date(event.date);
              const today = new Date();
              const timeDiff = eventDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
              return daysDiff > 0 && daysDiff <= 2;
            } catch {
              return false;
            }
          });
          setUpcomingSoon(soonEvents);

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
        setUpcomingSoon([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize countdown timers for upcoming events
  useEffect(() => {
    if (upcomingEvents.length === 0) return;

    const interval = setInterval(() => {
      const newCountdowns = {};

      upcomingEvents.forEach((event) => {
        if (event.date) {
          try {
            const eventDate = new Date(event.date);
            const now = new Date();

            // If event is in the past, skip
            if (eventDate < now) return;

            const diff = eventDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            newCountdowns[event._id || event.title] = {
              days,
              hours,
              minutes,
              seconds,
              formatted: `${days}d ${hours}h ${minutes}m`,
            };
          } catch {
            // Skip if date parsing fails
          }
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingEvents]);

  // Typing animation effect
  useEffect(() => {
    if (!showModal || !modalContent) return;

    let currentIndex = 0;
    const typingSpeed = 20; // milliseconds per character
    const joyfulMessages = [
      "🎉 Exciting news! 🎉",
      "✨ You're in for a treat! ✨",
      "🥳 Let's celebrate! 🥳",
      "🎶 Music magic incoming! 🎶",
    ];
    const randomMessage =
      joyfulMessages[Math.floor(Math.random() * joyfulMessages.length)];

    setTypingText(randomMessage);
    setIsTypingComplete(false);

    // Start with a joyful message
    const welcomeTimeout = setTimeout(() => {
      currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= modalContent.length) {
          setTypingText(modalContent.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }, 1500); // Short delay before starting

    return () => {
      clearTimeout(welcomeTimeout);
    };
  }, [showModal, modalContent]);

  // Play sound when modal opens
  const playJoyfulSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3"
    );
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  // Proper form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `New Service Request:\n\nName: ${formData.name}\nEmail: ${formData.email}\nEvent Type: ${formData.eventType}\nDate: ${formData.date}\nDetails: ${formData.message}`;
    window.open(
      `https://wa.me/254715747992?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Scroll to today's events
  const scrollToTodayEvents = () => {
    if (todayBannerRef.current) {
      window.scrollTo({
        top: todayBannerRef.current.offsetTop - 20,
        behavior: "smooth",
      });
      setShowTodayDetails(true);
    }
    setShowModal(false);
  };

  // Intersection Observer for modal trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && happeningToday.length > 0) {
            setModalContent(
              `We have ${happeningToday.length} amazing event${
                happeningToday.length > 1 ? "s" : ""
              } happening today! ${happeningToday
                .map((event) => event.title)
                .join(", ")}. Don't miss out on the fun! 🎶`
            );
            setShowModal(true);
            playJoyfulSound();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (modalRef.current) {
      observer.observe(modalRef.current);
    }

    return () => {
      if (modalRef.current) {
        observer.unobserve(modalRef.current);
      }
    };
  }, [happeningToday]);

  // Check for upcoming events in 2 days
  useEffect(() => {
    if (upcomingSoon.length > 0) {
      const message = `Heads up! You have ${upcomingSoon.length} event${
        upcomingSoon.length > 1 ? "s" : ""
      } coming up in the next 2 days: ${upcomingSoon
        .map((e) => e.title)
        .join(", ")}. Get ready!`;
      setModalContent(message);
      setShowModal(true);
      playJoyfulSound();
    }
  }, [upcomingSoon]);

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

  // Get image URL with fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") {
      return "https://via.placeholder.com/400x200?text=No+Image";
    }

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    return `https://kamson-558z.vercel.app/${imagePath.replace(/^\//, "")}`;
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
      {/* Happening Today Banner - Enhanced with more info and animation */}
      <div ref={todayBannerRef}>
        <AnimatePresence>
          {happeningToday.length > 0 && showTodayBanner && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-bold text-lg mr-2">
                      🎉 Happening Today:
                    </span>
                    <span className="font-semibold">
                      {happeningToday.map((event) => event.title).join(", ")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowTodayDetails(!showTodayDetails);
                      if (!showTodayDetails) {
                        setTimeout(() => {
                          window.scrollTo({
                            top: todayBannerRef.current.offsetTop - 20,
                            behavior: "smooth",
                          });
                        }, 100);
                      }
                    }}
                    className="mt-2 text-white/90 hover:text-white flex items-center text-sm underline"
                  >
                    <Info size={16} className="mr-1" />
                    {showTodayDetails ? "Hide details" : "View details"}
                  </button>
                </div>
                <button
                  onClick={() => setShowTodayBanner(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Expanded details section */}
              <AnimatePresence>
                {showTodayDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 pt-3 border-t border-white/30"
                  >
                    {happeningToday.map((event, index) => (
                      <div key={event._id || index} className="mb-3 last:mb-0">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Event Image */}
                          <div className="md:w-1/3">
                            <img
                              src={getImageUrl(event.image)}
                              alt={event.title || "Event image"}
                              className="w-full h-48 object-cover rounded-lg shadow-md"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x200?text=Event+Image";
                              }}
                            />
                          </div>

                          <div className="md:w-2/3">
                            <h4 className="font-bold text-white">
                              {event.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-white/80" />
                                <span>
                                  {formatTime(event.time, event.date)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-white/80" />
                                <span>{event.venue || "Venue TBA"}</span>
                              </div>
                              {event.ticketLink && (
                                <div>
                                  <a
                                    href={event.ticketLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-white text-emerald-700 hover:bg-white/90 transition-colors"
                                  >
                                    <Ticket className="h-3 w-3 mr-1" />
                                    Get Tickets
                                  </a>
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-white/80">
                              {event.description || "No description available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upcoming Soon Banner */}
      <AnimatePresence>
        {upcomingSoon.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="font-bold text-lg mr-2">Upcoming Soon:</span>
                  <span className="font-semibold">
                    {upcomingSoon.map((event) => event.title).join(", ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/90">
                  These events are happening in the next 2 days!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Joyful Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300/20 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    🎉 Exciting News!
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X size={20} className="text-purple-700" />
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 min-h-32">
                  <p className="text-gray-800 font-medium">
                    {typingText}
                    {!isTypingComplete && (
                      <span className="ml-1 inline-block w-2 h-5 bg-purple-500 animate-pulse"></span>
                    )}
                  </p>

                  {isTypingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 flex justify-center"
                    >
                      <button
                        onClick={scrollToTodayEvents}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                      >
                        Click here & scroll a bit to view event details
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
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

      {/* Modal trigger element (hidden) */}
      <div ref={modalRef} className="absolute top-0 h-1 w-full"></div>

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
                        {/* Countdown Badge */}
                        {event.date && countdowns[event._id || event.title] && (
                          <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            {countdowns[event._id || event.title].formatted}
                          </div>
                        )}

                        {/* Event Image with increased height */}
                        <div className="h-64 overflow-hidden">
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

                          <p className="mt-2 text-gray-700 line-clamp-3">
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
                    {/* Event Image with increased height */}
                    <div className="h-64 overflow-hidden">
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

                      <p className="mt-2 text-gray-700 line-clamp-3">
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
