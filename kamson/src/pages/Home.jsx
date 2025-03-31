import React, { useRef } from "react";
import Navigation from "../components/Navigation";
import EpicHeroSection from "../components/EpicHeroSection";
import Events from "../components/Events";
import Gallery from "../components/Gallery";
import About from "../components/About";
import Footer from "../components/Footer";

const Home = () => {
  // Create refs for each section you want to scroll to
  const aboutRef = useRef(null);
  const eventsRef = useRef(null);
  const galleryRef = useRef(null);

  return (
    <>
      {/* Pass the refs to Navigation */}
      <Navigation
        aboutRef={aboutRef}
        eventsRef={eventsRef}
        galleryRef={galleryRef}
      />

      <EpicHeroSection />

      {/* Attach the refs to the corresponding components */}
      <Events ref={eventsRef} />
      <Gallery ref={galleryRef} />
      <About ref={aboutRef} />

      {/* <Footer /> */}
    </>
  );
};

export default Home;
