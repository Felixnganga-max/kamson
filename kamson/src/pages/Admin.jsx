import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Sun, Moon, Coffee, Sunrise, Sunset } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManageEvents from "../components/ManageEvents";
import AddEvents from "../components/AddEvents";
import AddVideos from "../components/AddVideos";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get user data from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    const verifyToken = async () => {
      setIsLoading(true);
      try {
        // Verify token with backend in a real app
        const decoded = JSON.parse(atob(token.split(".")[1]));

        // Check token expiration
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        setUser({
          name: decoded.name || "Admin",
          role: decoded.role || "Administrator",
        });
      } catch (err) {
        console.error("Authentication error:", err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  // Set time greeting based on East Africa Time (EAT)
  useEffect(() => {
    const getEATTime = () => {
      const options = {
        timeZone: "Africa/Nairobi",
        hour: "numeric",
        hour12: false,
      };

      return {
        hours: parseInt(new Date().toLocaleString("en-US", options), 10),
        timeString: new Date().toLocaleTimeString("en-US", {
          timeZone: "Africa/Nairobi",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    };

    const updateTime = () => {
      const { hours, timeString } = getEATTime();
      setCurrentTime(timeString);

      if (hours >= 5 && hours < 9) setTimeOfDay("dawn");
      else if (hours < 12) setTimeOfDay("morning");
      else if (hours === 12) setTimeOfDay("noon");
      else if (hours < 17) setTimeOfDay("afternoon");
      else if (hours < 19) setTimeOfDay("dusk");
      else if (hours < 22) setTimeOfDay("evening");
      else setTimeOfDay("night");
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const getGreeting = () => {
    if (!user) return "Loading...";
    const name = user.name || "Admin";
    switch (timeOfDay) {
      case "dawn":
        return `Rise and shine, ${name}!`;
      case "morning":
        return `Good morning, ${name}`;
      case "noon":
        return `Good afternoon, ${name}`;
      case "afternoon":
        return `Good afternoon, ${name}`;
      case "dusk":
        return `Good evening, ${name}`;
      case "evening":
        return `Good evening, ${name}`;
      case "night":
        return `Good night, ${name}`;
      default:
        return `Welcome, ${name}`;
    }
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "dawn":
        return <Sunrise className="h-5 w-5 text-amber-500" />;
      case "morning":
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case "noon":
        return <Sun className="h-5 w-5 text-orange-500" />;
      case "afternoon":
        return <Sun className="h-5 w-5 text-amber-600" />;
      case "dusk":
        return <Sunset className="h-5 w-5 text-red-500" />;
      case "evening":
        return <Moon className="h-5 w-5 text-indigo-500" />;
      case "night":
        return <Moon className="h-5 w-5 text-blue-700" />;
      default:
        return <Coffee className="h-5 w-5 text-amber-800" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Authentication Required
          </h2>
          <p className="mt-2 text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden sm:flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {getTimeIcon()}
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:inline">
                {currentTime} EAT
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[120px] md:max-w-none">
                  {getGreeting()}
                </p>
                <p className="text-xs text-gray-500 hidden md:block">
                  {user.role}
                </p>
              </div>

              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab("manage")}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === "manage"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === "add"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Add New Event
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === "video"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Add Video
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {activeTab === "manage" && <ManageEvents />}
          {activeTab === "add" && <AddEvents />}
          {activeTab === "video" && <AddVideos />}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
