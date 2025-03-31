import React, { useState, useEffect, useRef, forwardRef } from "react";
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

      {/* Rotating Pyramid 2 */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 opacity-70"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{
          rotateY: -360,
          rotateX: -20,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Circles */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
        animate={{
          y: [-10, 10, -10],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
        animate={{
          y: [10, -10, 10],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Triangles */}
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-80"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://kamson-558z.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      onClose();
      navigate("/admin");
      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Animated Background Section */}
        <div className="relative bg-gradient-to-br from-purple-50 to-blue-50">
          <PyramidAnimation />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        </div>

        {/* Login Form Section */}
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Logging in...
                </motion.span>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

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

const Navigation = ({ aboutRef, eventsRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
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
      onClick: () => scrollToSection(aboutRef),
    },
    {
      icon: <Calendar size={20} />,
      text: "Events & Services",
      onClick: () => scrollToSection(eventsRef),
    },
  ];

  return (
    <>
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
