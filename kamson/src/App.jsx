import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  const location = useLocation();

  // Hide layout for admin routes
  const shouldHideLayout = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Navigation />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              localStorage.getItem("authToken") ? (
                <Admin />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Add a catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;
