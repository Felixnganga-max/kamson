import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React from "react";
import { BrowserRouter } from "react-router-dom"; // ✅ Import BrowserRouter
import "./App.css";
import EpicHeroSection from "./components/EpicHeroSection";
import Navigation from "./components/Navigation";
import Events from "./components/Events";
import About from "./components/About";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Wrap Navigation inside BrowserRouter */}
      <Navigation />
      <div className="w-full">
        <EpicHeroSection />
      </div>
      <Gallery />
      <Events />
      <About />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
