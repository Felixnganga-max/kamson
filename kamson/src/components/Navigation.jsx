import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Music,
  Calendar,
  Phone,
  Home,
  Mic,
  Speaker,
} from "lucide-react";
import { Link } from "react-router-dom";

const MobileEventHighlight = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-4 rounded-t-2xl shadow-lg mx-4 -mt-4">
      <div className="flex items-center space-x-3">
        <Speaker className="text-purple-600 animate-pulse" size={24} />
        <div>
          <h4 className="text-lb font-bold text-gray-800">Upcoming Events</h4>
          <p className="text-[16px] text-white">
            Join us for our next big musical experience!
          </p>
        </div>
        <div className="ml-auto">
          <Link
            to="/events"
            className="bg-purple-600 text-white rounded-full px-3 py-1 text-lg hover:bg-purple-700 transition-colors"
          >
            Events
          </Link>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 1;
      setHasScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/254797743366`, "_blank");
  };

  const navItems = [
    {
      icon: <Home size={20} />,
      text: "Home",
      path: "/",
    },
    {
      icon: <Mic size={20} />,
      text: "About Us",
      path: "/about",
    },
    {
      icon: <Calendar size={20} />,
      text: "Events & Services",
      path: "/events",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-2">
      {/* Event highlight positioned above navbar with negative margin */}
      {!hasScrolled && (
        <div className="md:hidden -mb-4 z-40 relative">
          <MobileEventHighlight />
        </div>
      )}

      {/* Main navbar container with rounded edges */}
      <div
        className={`${
          hasScrolled ? "backdrop-blur-md bg-white/80" : "bg-white/90"
        } 
                      rounded-b-2xl mx-2 shadow-sm transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex justify-between items-center py-3">
            {/* Logo - always visible */}
            <Link
              to="/"
              className="flex items-center text-xl md:text-2xl font-bold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Kamson Entertainment
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              ))}

              <button
                onClick={openWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Phone size={16} />
                <span>Get Tickets</span>
              </button>
            </div>

            {/* Mobile Menu Button - always visible */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-purple-600 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-30 mt-16">
          <div className="px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 px-3 py-3 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span className="text-lg">{item.text}</span>
                </Link>
              ))}

              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center space-x-2 w-full bg-green-500 text-white rounded-lg px-4 py-3 text-lg hover:bg-green-600 transition-colors mb-2"
              >
                <Phone size={16} />
                <span>Get Tickets</span>
              </button>
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center space-x-2 w-full bg-purple-600 text-white rounded-lg px-4 py-3 text-lg hover:bg-purple-700 transition-colors"
              >
                <Phone size={16} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
