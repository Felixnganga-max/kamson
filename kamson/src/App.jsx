import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  const location = useLocation();
  
  // Array of routes where navigation and footer should be hidden
  const hiddenLayoutRoutes = ['/admin', '/admin/*']; // You can add more routes here
  
  // Check if current route matches any of the hidden layout routes
  const shouldHideLayout = hiddenLayoutRoutes.some(route => {
    if (route.endsWith('/*')) {
      return location.pathname.startsWith(route.replace('/*', ''));
    }
    return location.pathname === route;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Navigation />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          {/* Add other routes here */}
        </Routes>
      </main>
      
      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;