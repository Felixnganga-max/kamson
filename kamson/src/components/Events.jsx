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
  const [showTodayDetails, setShowTodayDetails] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [hasShownModal, setHasShownModal] = useState(false);
  const modalRef = useRef(null);
  const todayBannerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

        if (response.data?.data?.events) {
          const eventsData = response.data.data.events;
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
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load events");
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
              formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
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

  // FIX: Typing animation effect
  useEffect(() => {
    // Only run if modal is showing and we have content
    if (!showModal || !modalContent) return;

    // Clear any existing timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset typing states before starting new animation
    setTypingText("");
    setIsTypingComplete(false);

    const joyfulMessages = [
      "🎉 Exciting news! 🎉",
      "✨ You're in for a treat! ✨",
      "🥳 Let's celebrate! 🥳",
      "🎶 Music magic incoming! 🎶",
    ];
    const welcomeMessage =
      joyfulMessages[Math.floor(Math.random() * joyfulMessages.length)];
    const typingSpeed = 30;
    let currentIndex = 0;
    let phase = 0; // 0 = welcome, 1 = pause, 2 = main content

    const typeCharacter = () => {
      if (phase === 0) {
        // Typing welcome message
        if (currentIndex <= welcomeMessage.length) {
          setTypingText(welcomeMessage.substring(0, currentIndex));
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeCharacter, typingSpeed);
        } else {
          // Pause after welcome message is complete
          phase = 1;
          typingTimeoutRef.current = setTimeout(typeCharacter, 1000);
        }
      } else if (phase === 1) {
        // Clear welcome message
        setTypingText("");
        currentIndex = 0;
        phase = 2;
        typingTimeoutRef.current = setTimeout(typeCharacter, 300);
      } else {
        // Typing main content
        if (currentIndex <= modalContent.length) {
          setTypingText(modalContent.substring(0, currentIndex));
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeCharacter, typingSpeed);
        } else {
          setIsTypingComplete(true);
        }
      }
    };

    // Start the typing animation
    typeCharacter();

    // Clean up when component unmounts or modal is closed
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `New Service Request:\n\nName: ${formData.name}\nEmail: ${formData.email}\nEvent Type: ${formData.eventType}\nDate: ${formData.date}\nDetails: ${formData.message}`;
    window.open(
      `https://wa.me/254715747992?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
    setFormData({
      name: "",
      email: "",
      eventType: "",
      date: "",
      message: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Scroll to today's events
  const scrollToTodayEvents = () => {
    if (todayBannerRef.current) {
      todayBannerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowModal(false);
  };

  // FIX: Show modal for testing regardless of events
  useEffect(() => {
    // Add a slight delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      if (happeningToday.length > 0) {
        setModalContent(
          `We have ${happeningToday.length} amazing event${
            happeningToday.length > 1 ? "s" : ""
          } happening today! ${happeningToday
            .map((event) => event.title)
            .join(", ")}. Don't miss out! 🎶`
        );
      } else {
        // For testing: Show modal even if no events today
        setModalContent(
          "We have some amazing events coming up soon! Check out our schedule and don't miss out! 🎶"
        );
      }
      setShowModal(true);
      playJoyfulSound();
      setHasShownModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [happeningToday]);

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

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

  const getImageUrl = (imagePath) => {
    if (!imagePath?.trim())
      return "https://via.placeholder.com/400x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://kamson-558z.vercel.app/${imagePath.replace(/^\//, "")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <span className="ml-2 text-purple-600">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg text-center">
          <p className="font-bold">Error loading events</p>
          <p>{error}</p>
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
      <div ref={todayBannerRef}>
        {happeningToday.length > 0 && showTodayBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
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
                  onClick={() => setShowTodayDetails(!showTodayDetails)}
                  className="mt-2 text-white/90 hover:text-white flex items-center text-sm underline"
                >
                  <Info size={16} className="mr-1" />
                  {showTodayDetails ? "Hide details" : "Show details"}
                </button>
              </div>
              <button
                onClick={() => setShowTodayBanner(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {showTodayDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-white/30"
              >
                {happeningToday.map((event, index) => (
                  <div key={event._id || index} className="mb-3 last:mb-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <img
                          src={getImageUrl(event.image)}
                          alt={event.title || "Event"}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Event+Image";
                          }}
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="font-bold text-white">{event.title}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-white/80" />
                            <span>{formatTime(event.time, event.date)}</span>
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
          </motion.div>
        )}
      </div>

      {/* Upcoming Soon Banner */}
      {upcomingSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
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

      {/* Joyful Modal - FIXED */}
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
              ref={modalRef}
            >
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
                  <p className="text-gray-800 font-medium min-h-[4rem]">
                    {typingText}
                    {!isTypingComplete && typingText.length > 0 && (
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
                        View Event Details
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
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
        <Tab.List className="flex space-x-1 rounded-xl bg-gradient-to-r from-purple-200/30 to-pink-200/30 p-1 max-w-2xl mx-auto">
          {["Upcoming Events", "Past Events", "Book Services"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300 ${
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
                        {event.date && countdowns[event._id || event.title] && (
                          <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            {countdowns[event._id || event.title].formatted}
                          </div>
                        )}

                        <div className="h-64 overflow-hidden">
                          <img
                            src={getImageUrl(event.image)}
                            alt={event.title || "Event"}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x200?text=Event+Image";
                            }}
                          />
                        </div>

                        <div className="p-6 bg-gradient-to-br from-white to-purple-50 flex-grow">
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                            {event.title || "Untitled Event"}
                          </h3>

                          <p className="mt-2 text-gray-700 line-clamp-3">
                            {event.description || "No description available"}
                          </p>

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
                    <div className="h-64 overflow-hidden">
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.title || "Event"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x200?text=Event+Image";
                        }}
                      />
                    </div>

                    <div className="p-6 bg-gradient-to-br from-white to-purple-50 flex-grow">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                        {event.title || "Untitled Event"}
                      </h3>

                      <p className="mt-2 text-gray-700 line-clamp-3">
                        {event.description || "No description available"}
                      </p>

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
