import React from "react";
import Navigation from "../components/Navigation";
import EpicHeroSection from "../components/EpicHeroSection";
import Events from "../components/Events";
import Gallery from "../components/Gallery";
import About from "../components/About";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navigation />
      <EpicHeroSection />
      <Events />
      <Gallery />
      <About />
      <Footer />
    </>
  );
};

export default Home;
