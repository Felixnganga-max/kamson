import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { FaTiktok } from "react-icons/fa6";
import {
  Instagram,
  YoutubeIcon,
  FacebookIcon,
  Twitter,
  ChevronLeft,
  ChevronRight,
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
  const audioRef = useRef(null);
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
        "https://www.youtube.com/embed/zcA7Ru45PwQ?autoplay=1&mute=1&controls=1&modestbranding=1",
      audioSrc: "/music/traditional-background.mp3", // Add your music files here
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
        "https://www.youtube.com/embed/MCOFegfeVdM?autoplay=1&mute=1&controls=1&modestbranding=1",
      audioSrc: "/music/karaoke-background.mp3", // Add your music files here
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
        "https://www.youtube.com/embed/P51IvKAqaWo?autoplay=1&mute=1&controls=1&modestbranding=1",
      audioSrc: "/music/rhumba-background.mp3", // Add your music files here
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

  // Play background music when slide changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = artistImages[currentImage].audioSrc;
      audioRef.current.volume = 0.3;
      if (!isVideoMuted) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentImage, isVideoMuted]);

  // Toggle Video and Background Music Mute
  const toggleMute = () => {
    setIsVideoMuted(!isVideoMuted);
    if (audioRef.current) {
      if (isVideoMuted) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Scroll Effects
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Animation variants for text elements
  const titleAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const descriptionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
      },
    },
  };

  const tagsAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.7,
        duration: 0.5,
      },
    },
  };

  // Letter animation for title
  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-screen h-[99vh] max-w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Audio Player */}
      <audio ref={audioRef} loop />

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
                {/* Background Image with Musical Pulse Animation */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image.src})`,
                    backgroundColor: image.color.overlay,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>

                {/* Content */}
                <motion.div
                  style={{
                    opacity: textOpacity,
                    y: textTranslateY,
                  }}
                  className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4"
                >
                  <div className="max-w-4xl space-y-6">
                    {/* Animated Title with Letter Animation */}
                    <motion.h1
                      className={`text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight ${image.color.accent}`}
                      initial="hidden"
                      animate="visible"
                      variants={titleAnimation}
                    >
                      {image.title.split("").map((char, i) => (
                        <motion.span
                          key={`char-${i}`}
                          custom={i}
                          variants={letterAnimation}
                          className="inline-block"
                          whileHover={{
                            scale: 1.2,
                            rotate: [-5, 5, 0],
                            transition: { duration: 0.3 },
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </motion.h1>

                    {/* Animated Description */}
                    <motion.p
                      className="text-xl sm:text-xl md:text-2xl font-light max-w-2xl mx-auto"
                      initial="hidden"
                      animate="visible"
                      variants={descriptionAnimation}
                    >
                      {image.description}
                    </motion.p>

                    {/* Animated Tags */}
                    <motion.div
                      className="flex justify-center space-x-4 mt-6"
                      initial="hidden"
                      animate="visible"
                      variants={tagsAnimation}
                    >
                      <motion.span
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border ${image.color.accent} border-opacity-50 text-sm sm:text-base`}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {image.genre}
                      </motion.span>
                      <motion.span
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border ${image.color.accent} border-opacity-50 text-sm sm:text-base`}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {image.mood}
                      </motion.span>
                    </motion.div>

                    {/* Music Notes Animation */}
                    <div className="relative h-12">
                      {!isVideoMuted && (
                        <>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={`note-${i}`}
                              className="absolute"
                              style={{
                                left: `${10 + i * 15}%`,
                                top: "0px",
                              }}
                              initial={{ opacity: 0, y: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                y: [-10, -60],
                                x: [0, i % 2 === 0 ? 20 : -20],
                                rotate: [0, i % 2 === 0 ? 20 : -20],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.4,
                                repeatType: "loop",
                              }}
                            >
                              {i % 2 === 0 ? (
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="white"
                                >
                                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                              ) : (
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="white"
                                >
                                  <path d="M6 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H6z" />
                                </svg>
                              )}
                            </motion.div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Controls with Improved Animation */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <motion.button
          onClick={prevImage}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 
            text-white bg-black/30 p-2 rounded-full 
            hover:bg-black/50 transition
            ${isHovering ? "opacity-100" : "opacity-0"}
            pointer-events-auto`}
          whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.6)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={32} />
        </motion.button>

        <motion.button
          onClick={nextImage}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 
            text-white bg-black/30 p-2 rounded-full 
            hover:bg-black/50 transition
            ${isHovering ? "opacity-100" : "opacity-0"}
            pointer-events-auto`}
          whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.6)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size={32} />
        </motion.button>
      </div>

      {/* Social Media Links with Enhanced Animations */}
      <motion.div
        className="absolute top-2/3 left-1/2 md:left-auto md:right-8 bottom-24 md:top-32 transform -translate-x-1/2 md:translate-x-0 flex md:flex-col space-x-6 md:space-x-0 md:space-y-6 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
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
          {
            Component: FaTiktok,
            color: "text-white hover:text-gray-300",
            handle: "@ArtistTikTok",
            link: "https://www.tiktok.com/@kamson254?_t=ZM-8v9F7bLaOBh&_r=1",
          },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block group ${social.color} transition-all duration-300`}
            whileHover={{
              scale: 1.2,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.8 + index * 0.1, duration: 0.5 },
            }}
          >
            {social.Component ? (
              <social.Component
                size={36}
                className="transition-transform group-hover:rotate-6"
              />
            ) : (
              <social.icon
                size={36}
                className="transition-transform group-hover:rotate-6"
              />
            )}
          </motion.a>
        ))}
      </motion.div>

      {/* Pagination Dots with Animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {artistImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
              ${
                currentImage === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            animate={
              currentImage === index
                ? {
                    scale: [1, 1.2, 1],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                    },
                  }
                : {}
            }
          />
        ))}
      </motion.div>

      {/* Musical Touchpoints with Improved Video Player */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {/* Centered Small Video Player with Pulsar Effect */}
        <motion.div
          className="relative w-[50vw] md:w-[30vw] min-w-[200px] max-w-[300px] h-[22vh] md:h-[25vh] min-h-[100px] max-h-[300px] bg-black/30 rounded-lg overflow-hidden"
          animate={{
            boxShadow: isVideoMuted
              ? "0 0 0 rgba(255,255,255,0.3)"
              : [
                  "0 0 0 rgba(255,255,255,0.3)",
                  "0 0 15px rgba(255,255,255,0.7)",
                  "0 0 0 rgba(255,255,255,0.3)",
                ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <iframe
            ref={videoRef}
            src={`${artistImages[currentImage].videoSrc}&mute=1`}
            title="Performance Clip"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          />

          {/* Mute Toggle with Animation */}
          <motion.button
            onClick={toggleMute}
            className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2 z-50 hover:bg-black/70 transition"
            whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.8)" }}
            whileTap={{ scale: 0.9 }}
            animate={
              !isVideoMuted
                ? {
                    scale: [1, 1.2, 1],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                    },
                  }
                : {}
            }
          >
            {isVideoMuted ? (
              <VolumeXIcon size={16} color="white" />
            ) : (
              <Volume2Icon size={16} color="white" />
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile-Friendly Mute Button */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-50 hover:bg-black/70 transition md:hidden"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {isVideoMuted ? (
          <VolumeXIcon size={20} color="white" />
        ) : (
          <Volume2Icon size={20} color="white" />
        )}
      </motion.button>
    </div>
  );
};

export default EpicHeroSection;
