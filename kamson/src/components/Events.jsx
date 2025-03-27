import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { Calendar, MapPin, Clock, Ticket, Youtube } from "lucide-react";
import assets from "../assets/assets";

// Mock data for events
const upcomingEvents = [
  {
    id: 1,
    title: "Rhythmic Revolution Live",
    date: "2023-12-15",
    time: "20:00",
    venue: "The Sonic Dome, NYC",
    description:
      "An electrifying night of progressive fusion with special guests",
    image: assets.one,
    ticketLink:
      "https://wa.me/254797743366?text=I%20want%20tickets%20for%20Rhythmic%20Revolution",
    youtubeLink: null,
  },
  {
    id: 2,
    title: "Melodic Horizons Tour",
    date: "2024-01-20",
    time: "19:30",
    venue: "Harmony Hall, Chicago",
    description: "Experience our new avant-garde world music compositions",
    image: assets.one,
    ticketLink:
      "https://wa.me/254797743366?text=I%20want%20tickets%20for%20Melodic+Horizons",
    youtubeLink: null,
  },
];

const pastEvents = [
  {
    id: 3,
    title: "Sonic Metamorphosis Showcase",
    date: "2023-08-10",
    venue: "The Experimental Lab, LA",
    description: "Our groundbreaking debut performance",
    image: assets.one,
    youtubeLink: "https://youtube.com/watch?v=example1",
  },
  {
    id: 4,
    title: "Fusion Waves Festival",
    date: "2023-05-22",
    venue: "Beachside Arena, Miami",
    description: "Headlining the world fusion stage",
    image: assets.one,
    youtubeLink: "https://youtube.com/watch?v=example2",
  },
];

const Events = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    date: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `New Service Request:\n\nName: ${formData.name}\nEmail: ${formData.email}\nEvent Type: ${formData.eventType}\nDate: ${formData.date}\nDetails: ${formData.message}`;

    window.open(
      `https://wa.me/254797743366?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  };

  return (
    <div className="w-[95vw] mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/10 via-purple-800/10 to-blue-600/10">
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

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Tab.List className="flex space-x-1 rounded-xl bg-gradient-to-r from-purple-200/30 to-pink-200/30 p-1 max-w-2xl mx-auto">
            {["Our Events", "Previous Events", "Book/Request Services"].map(
              (tab) => (
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
              )
            )}
          </Tab.List>
        </motion.div>

        <Tab.Panels className="mt-8">
          {/* Upcoming Events Panel */}
          <Tab.Panel>
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                  }}
                  className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-purple-100 hover:border-pink-200 transition-all"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6 bg-gradient-to-br from-white to-purple-50">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-700">{event.description}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-2 text-purple-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                      >
                        <Ticket className="h-5 w-5 mr-2" />
                        Get Tickets
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Tab.Panel>

          {/* Past Events Panel */}
          <Tab.Panel>
            <div className="grid gap-8 md:grid-cols-2">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                  }}
                  className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-purple-100 hover:border-pink-200 transition-all"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6 bg-gradient-to-br from-white to-purple-50">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-700">{event.description}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {event.youtubeLink && (
                      <div className="mt-6">
                        <a
                          href={event.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                        >
                          <Youtube className="h-5 w-5 mr-2" />
                          Watch on YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
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
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Rest of the form remains the same, with some color adjustments */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-purple-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Other form fields with similar style adjustments */}

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
