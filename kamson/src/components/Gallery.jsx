import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Camera, X } from "lucide-react";
import assets from "../assets/assets";

// Mock Data
const mediaItems = [
  {
    id: 1,
    type: "video",
    title: "Nairobi Jazz Festival",
    src: "https://example.com/video1.mp4",
    thumbnail: assets.three,
    category: "performance",
  },
  {
    id: 2,
    type: "image",
    title: "Studio Vocal Session",
    src: assets.two,
    category: "behind-the-scenes",
  },
  {
    id: 3,
    type: "video",
    title: "Acoustic Live Stream",
    src: "https://example.com/video2.mp4",
    thumbnail: assets.two,
    category: "performance",
  },
  {
    id: 4,
    type: "image",
    title: "Soundcheck Moments",
    src: assets.three,
    category: "behind-the-scenes",
  },
  {
    id: 5,
    type: "video",
    title: "Crowd Interaction",
    src: "https://example.com/video3.mp4",
    thumbnail: assets.two,
    category: "performance",
  },
  {
    id: 6,
    type: "image",
    title: "Makeup Prep",
    src: assets.three,
    category: "behind-the-scenes",
  },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("performance");
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filteredItems = mediaItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  // Musical entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header with Musical Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            damping: 10,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            The Art Behind The Artist
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Captured moments from the stage and private creative spaces
          </p>
        </motion.div>

        {/* Minimalist Filter with Bounce Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-800 rounded-full p-1">
            {["performance", "behind-the-scenes"].map((filter) => (
              <motion.button
                key={filter}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeFilter === filter
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {filter === "performance" ? (
                  <Play size={16} />
                ) : (
                  <Camera size={16} />
                )}
                {filter.split("-").join(" ")}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid Gallery with Musical Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                {/* Media Card with Always Visible Elements */}
                <div className="aspect-square overflow-hidden rounded-xl bg-gray-900 relative">
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Always Visible Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4">
                    {/* Play/View Button */}
                    <div className="self-end">
                      {item.type === "video" ? (
                        <div className="bg-white p-3 rounded-full shadow-xl">
                          <Play className="text-purple-600" size={24} />
                        </div>
                      ) : (
                        <div className="bg-white/90 px-4 py-2 rounded-full">
                          <span className="font-medium text-black">View</span>
                        </div>
                      )}
                    </div>

                    {/* Floating Label */}
                    <div>
                      <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                          {item.category === "performance" ? (
                            <>
                              <Play size={12} />
                              <span>Live Performance</span>
                            </>
                          ) : (
                            <>
                              <Camera size={12} />
                              <span>Behind The Scenes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute -top-12 right-0 z-10 text-white hover:text-pink-400 transition-colors"
                >
                  <X size={28} />
                </button>

                {selectedMedia.type === "video" ? (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      poster={selectedMedia.thumbnail}
                    >
                      <source src={selectedMedia.src} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <div className="max-h-[90vh] flex justify-center">
                    <img
                      src={selectedMedia.src}
                      alt={selectedMedia.title}
                      className="object-contain rounded-xl"
                    />
                  </div>
                )}

                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-white">
                    {selectedMedia.title}
                  </h3>
                  <p className="text-purple-300 mt-1">
                    {selectedMedia.category.split("-").join(" ").toUpperCase()}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
