import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Instagram,
  YoutubeIcon,
  FacebookIcon,
  Twitter,
  ChevronLeft,
  ChevronRight,
  TicketIcon,
  MusicIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import assets from "../assets/assets.js";

const EpicHeroSection = ({ onBookEvents }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);
  const carouselRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Artist Images with Rich Metadata
  const artistImages = [
    {
      src: assets.one,
      title: "Mugithi Magic",
      description: "Kikuyu's Favorite Musical Journey",
      genre: "Traditional Kikuyu",
      mood: "Cultural Celebration",
      videoSrc:
        "https://www.youtube.com/embed/zcA7Ru45PwQ?autoplay=1&mute=1?controls=1&modestbranding=1",
      color: {
        overlay: "rgba(0,0,0,0.5)",
        accent: "text-green-300",
      },
    },
    {
      src: assets.two,
      title: "Karaoke Nights",
      description: "Unleash Your Inner Rockstar",
      genre: "Interactive Music",
      mood: "Pure Entertainment",
      videoSrc:
        "https://www.youtube.com/embed/MCOFegfeVdM?autoplay=1&mute=1?controls=1&modestbranding=1",
      color: {
        overlay: "rgba(30,64,175,0.5)",
        accent: "text-indigo-300",
      },
    },
    {
      src: assets.three,
      title: "Rhumba Rhythms",
      description: "Dance to the Heartbeat of Africa",
      genre: "Afro-Caribbean",
      mood: "Sensational Groove",
      videoSrc:
        "https://www.youtube.com/embed/P51IvKAqaWo?autoplay=1&mute=1?controls=1&modestbranding=1",
      color: {
        overlay: "rgba(219,39,119,0.4)",
        accent: "text-pink-300",
      },
    },
  ];

  // Carousel Navigation
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % artistImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + artistImages.length) % artistImages.length
    );
  };

  // Automatic Carousel Progression
  useEffect(() => {
    const carouselInterval = setInterval(nextImage, 12000);
    return () => clearInterval(carouselInterval);
  }, []);

  // Toggle Video Mute
  const toggleVideoMute = () => {
    if (videoRef.current) {
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Scroll Effects
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div
      ref={carouselRef}
      className="relative w-screen h-[99vh] max-w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        {artistImages.map(
          (image, index) =>
            currentImage === index && (
              <motion.div
                key={`image-${index}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 1.5,
                    type: "spring",
                    stiffness: 50,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 1 },
                }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image.src})`,
                    backgroundColor: image.color.overlay,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Content */}
                <motion.div
                  style={{
                    opacity: textOpacity,
                    y: textTranslateY,
                  }}
                  className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4"
                >
                  <div className="max-w-4xl space-y-6">
                    <h1
                      className={`text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight ${image.color.accent}`}
                    >
                      {image.title}
                    </h1>
                    <p className="text-xl sm:text-xl md:text-2xl font-light max-w-2xl mx-auto">
                      {image.description}
                    </p>
                    <div className="flex justify-center space-x-4 mt-6">
                      <span
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border ${image.color.accent} border-opacity-50 text-sm sm:text-base`}
                      >
                        {image.genre}
                      </span>
                      <span
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border ${image.color.accent} border-opacity-50 text-sm sm:text-base`}
                      >
                        {image.mood}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <button
          onClick={prevImage}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 
            text-white bg-black/30 p-2 rounded-full 
            hover:bg-black/50 transition
            ${isHovering ? "opacity-100" : "opacity-0"}
            pointer-events-auto`}
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={nextImage}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 
            text-white bg-black/30 p-2 rounded-full 
            hover:bg-black/50 transition
            ${isHovering ? "opacity-100" : "opacity-0"}
            pointer-events-auto`}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Social Media Links */}
      <div className="absolute top-2/3 left-1/2  md:left-40 bottom-24 md:top-8/10 sm:bottom-1 transform -translate-x-1/2 flex space-x-6 z-30">
        {[
          {
            icon: Instagram,
            color: "text-pink-500 hover:text-pink-300",
            handle: "@artistjourney",
            link: "https://www.instagram.com/kamsonofficial?igsh=MWQyMGxoMWYwNW9iMA%3D%3D&utm_source=qr",
          },
          {
            icon: YoutubeIcon,
            color: "text-red-600 hover:text-red-400",
            handle: "ArtistChannel",
            link: "https://www.youtube.com/@KAMSONOFFICIAL",
          },
          {
            icon: FacebookIcon,
            color: "text-blue-600 hover:text-blue-400",
            handle: "ArtistOfficial",
            link: "https://www.facebook.com/share/1Es47DVu92/?mibextid=wwXIfr",
          },
          {
            icon: Twitter,
            color: "text-sky-500 hover:text-sky-300",
            handle: "@ArtistVoice",
            link: "https://x.com/kamson254?s=21",
          },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block group ${social.color} transition-all duration-300`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <social.icon
              size={36}
              className="transition-transform group-hover:rotate-6"
            />
          </motion.a>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {artistImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
              ${
                currentImage === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>

      {/* Musical Touchpoints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4 z-40">
        {/* Centered Small Video Player */}
        <div className="relative w-[50vw] md:w-[30vw] min-w-[200px] max-w-[300px] h-[22vh] md:h-[25vh] min-h-[100px] max-h-[300px] bg-black/30 rounded-lg overflow-hidden">
          <iframe
            ref={videoRef}
            src={artistImages[currentImage].videoSrc}
            title="Performance Clip"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            muted={isVideoMuted}
          />

          {/* Mute Toggle */}
          <button
            onClick={toggleVideoMute}
            className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1 z-50 hover:bg-black/70 transition"
          >
            {isVideoMuted ? (
              <VolumeXIcon size={16} color="white" />
            ) : (
              <Volume2Icon size={16} color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpicHeroSection;
