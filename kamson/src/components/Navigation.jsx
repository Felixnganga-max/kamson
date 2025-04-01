import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  Phone,
  Home,
  Mic,
  Speaker,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication - replace with your actual auth logic
    if (email === "admin@example.com" && password === "password") {
      onLoginSuccess();
    } else {
      setError("Invalid credentials");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center py-2 px-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                required
                placeholder="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
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
            className="bg-purple-600 text-white rounded-full px-3 py-1 text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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

  const scrollToEvents = () => {
    if (eventsRef?.current) {
      const rect = eventsRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 70 : 100;
      const scrollPosition = window.pageYOffset + rect.top - offset;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    if (aboutRef?.current) {
      const rect = aboutRef.current.getBoundingClientRect();
      const scrollPosition = window.pageYOffset + rect.top - 50;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

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
      onClick: scrollToAbout,
    },
    {
      icon: <Calendar size={20} />,
      text: "Events & Services",
      onClick: scrollToEvents,
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 pt-2">
        {!hasScrolled && (
          <div className="md:hidden -mb-4 z-30 relative">
            <MobileEventHighlight onClick={scrollToEvents} />
          </div>
        )}

        <div
          className={`${
            hasScrolled ? "backdrop-blur-md bg-white/80" : "bg-white/90"
          } rounded-b-2xl mx-2 shadow-sm transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex justify-between items-center py-3">
              <Link
                to="/"
                className="flex items-center text-xl md:text-2xl font-bold text-purple-600 hover:text-purple-800 transition-colors"
              >
                Kamson Entertainment
              </Link>

              <div className="hidden md:flex space-x-6 items-center">
                {navItems.map((item) => (
                  <button
                    key={item.text}
                    onClick={item.onClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </button>
                ))}

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Admin Login
                </button>

                <button
                  onClick={openWhatsApp}
                  className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Phone size={16} />
                  <span>Get Tickets</span>
                </button>
              </div>

              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-purple-600 focus:outline-none"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-30 mt-16 overflow-y-auto">
            <div className="px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.text}
                    onClick={() => {
                      item.onClick();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 px-3 py-3 rounded-lg transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                  className="flex items-center justify-center space-x-2 w-full bg-purple-600 text-white rounded-lg px-4 py-3 text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <Lock size={16} />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={openWhatsApp}
                  className="flex items-center justify-center space-x-2 w-full bg-green-500 text-white rounded-lg px-4 py-3 text-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Phone size={16} />
                  <span>Get Tickets</span>
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
