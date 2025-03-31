import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Music,
  Calendar,
  Phone,
  Home,
  Mic,
  Speaker,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const PyramidAnimation = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Rotating Pyramid 1 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 opacity-70"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{
          rotateY: 360,
          rotateX: 20,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Rest of the animation elements... */}
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // Existing LoginModal component code
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Modal content */}
    </div>
  ) : null;
};

const MobileEventHighlight = ({ onClick }) => {
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
          <button
            onClick={onClick}
            className="bg-purple-600 text-white rounded-full px-3 py-1 text-lg hover:bg-purple-700 transition-colors"
          >
            Events
          </button>
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ aboutRef, eventsRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Direct scroll method that uses a simple offset approach
  const scrollToEvents = () => {
    if (eventsRef && eventsRef.current) {
      // Get the element's position relative to the viewport
      const rect = eventsRef.current.getBoundingClientRect();

      // Calculate the position to scroll to:
      // Current scroll position + element's top position - offset
      const isMobile = window.innerWidth < 768;

      // Use pixel values instead of vh percentages for more reliable scrolling
      const mobileOffset = 70; // approximately equivalent to 0.9vh on most devices
      const desktopOffset = 100; // approximately equivalent to 0.12vh on most devices

      const offset = isMobile ? mobileOffset : desktopOffset;

      // Calculate final scroll position
      const scrollPosition = window.pageYOffset + rect.top - offset;

      // Perform the scroll
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Regular scroll for about section
  const scrollToAbout = () => {
    if (aboutRef && aboutRef.current) {
      const rect = aboutRef.current.getBoundingClientRect();
      const scrollPosition = window.pageYOffset + rect.top - 50; // Small offset for better positioning

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

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
    window.open(`https://wa.me/254715747992`, "_blank");
  };

  const navItems = [
    {
      icon: <Home size={20} />,
      text: "Home",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      icon: <Mic size={20} />,
      text: "About Us",
      onClick: () => scrollToAbout(),
    },
    {
      icon: <Calendar size={20} />,
      text: "Events & Services",
      onClick: () => scrollToEvents(),
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-2">
        {/* Event highlight positioned above navbar with negative margin */}
        {!hasScrolled && (
          <div className="md:hidden -mb-4 z-40 relative">
            <MobileEventHighlight onClick={() => scrollToEvents()} />
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
                  <button
                    key={item.text}
                    onClick={item.onClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </button>
                ))}

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                >
                  Admin Login
                </button>

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
                  <button
                    key={item.text}
                    onClick={() => {
                      item.onClick();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 px-3 py-3 rounded-lg transition-colors w-full text-left"
                  >
                    {item.icon}
                    <span className="text-lg">{item.text}</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    toggleMenu();
                    setShowLoginModal(true);
                  }}
                  className="flex items-center justify-center space-x-2 w-full bg-purple-600 text-white rounded-lg px-4 py-3 text-lg hover:bg-purple-700 transition-colors"
                >
                  <Lock size={16} />
                  <span>Admin Login</span>
                </button>

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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          navigate("/admin");
        }}
      />
    </>
  );
};

export default Navigation;
