import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Music, Calendar, Mic, Guitar, Headphones, Star } from "lucide-react";
import React from "react";

const MusicStars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 20 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 5,
        animationDelay: `${Math.random() * 3}s`,
        color: Math.random() > 0.5 ? "text-yellow-300" : "text-white",
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <Star
          key={star.id}
          className={`absolute animate-pulse ${star.color}`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

const About = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Precise genre content
  const genres = [
    {
      name: "Karaoke",
      description:
        "Interactive performances that transform audiences into performers, featuring cutting-edge sound systems and global hit selections.",
      icon: <Mic className="w-8 h-8 text-purple-500" />,
    },
    {
      name: "Reggae",
      description:
        "Authentic Caribbean rhythms blending roots, dancehall, and conscious lyrics that pulse with cultural energy.",
      icon: <Music className="w-8 h-8 text-green-500" />,
    },
    {
      name: "Mugithi",
      description:
        "Traditional Kenyan folk music reimagined with contemporary guitar techniques, bridging generational musical landscapes.",
      icon: <Guitar className="w-8 h-8 text-orange-500" />,
    },
    {
      name: "Rhumba",
      description:
        "Sophisticated Congolese musical artistry featuring intricate guitar work and vibrant horn sections that define Central African sound.",
      icon: <Headphones className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden">
      <MusicStars />
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column - Musical Narrative */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200 sm:text-5xl mb-6">
              A Symphony of Journeys
            </h2>

            <div className="space-y-5 text-lg text-gray-200 leading-relaxed">
              <p>
                Music isn't just what she does—it's her language, her pulse, her
                very breath. From the electric energy of Nairobi's underground
                clubs to international stages that pulse with multicultural
                rhythms, her musical odyssey is a testament to the
                transformative power of sound.
              </p>
              <p>
                Each performance is an intimate conversation, a musical dialogue
                that transcends linguistic and cultural boundaries. With vocal
                techniques that can whisper like a gentle breeze or roar like an
                untamed storm, she doesn't just sing songs—she conjures entire
                emotional landscapes.
              </p>
            </div>

            {/* Genre Tabs */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-5">
                Musical Territories
              </h3>
              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex space-x-2 rounded-xl bg-gray-800 p-1.5">
                  {genres.map((genre) => (
                    <Tab
                      key={genre.name}
                      className={({ selected }) =>
                        `w-full py-2.5 text-sm font-semibold leading-5 rounded-xl transition-all
                        ${
                          selected
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`
                      }
                    >
                      {genre.name}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-5">
                  {genres.map((genre, idx) => (
                    <Tab.Panel
                      key={idx}
                      className="bg-gray-800 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex items-start space-x-5">
                        <div className="flex-shrink-0">{genre.icon}</div>
                        <p className="text-gray-200 text-base leading-relaxed">
                          {genre.description}
                        </p>
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>

          {/* Right Column - Image with Cinematic Effect */}
          <div className="lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-75"
                src="https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Artist in Musical Transcendence"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <p className="text-sm font-medium tracking-wide opacity-80">
                  Sonic Storytelling
                </p>
                <h3 className="text-2xl font-extrabold mt-2 tracking-tight">
                  Nairobi International Festival
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section with Musical Energy */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-800 to-blue-800 rounded-3xl p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

          <h3 className="text-3xl font-black text-white sm:text-4xl mb-5 relative z-10">
            Let's Create Musical Magic
          </h3>
          <p className="text-xl text-purple-100 mb-7 max-w-2xl mx-auto relative z-10">
            Transform your event from an ordinary gathering to an extraordinary
            musical journey.
          </p>
          <button
            onClick={() => (window.location.href = "#booking")}
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white hover:text-purple-700 transition-all relative z-10"
          >
            <Calendar className="mr-3 h-6 w-6" />
            Orchestrate Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
