import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  Music,
  Calendar,
  Mic,
  Guitar,
  Headphones,
  Star,
  Radio,
  Users,
} from "lucide-react";
import React, { forwardRef } from "react";

const MusicStars = ({ className = "" }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 30 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 5,
        animationDelay: `${Math.random() * 3}s`,
        color:
          Math.random() > 0.7
            ? "text-yellow-300"
            : Math.random() > 0.5
            ? "text-purple-300"
            : "text-white",
        pulse: Math.random() > 0.5 ? "animate-pulse" : "animate-ping",
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {stars.map((star) => (
        <Star
          key={star.id}
          className={`absolute ${star.pulse} ${star.color}`}
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

const AudioWave = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-16 flex items-end justify-center space-x-1 opacity-50">
      {Array.from({ length: 50 }).map((_, i) => {
        const height = Math.sin(i * 0.5) * 50 + 20;
        return (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-purple-500 to-blue-300"
            style={{
              height: `${height}%`,
              animation: `wave ${
                0.8 + Math.random() * 0.7
              }s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

const About = forwardRef((props, ref) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const genres = [
    {
      name: "Karaoke",
      description:
        "Interactive performances that transform audiences into performers, featuring cutting-edge sound systems and global hit selections that create unforgettable moments of shared musical joy.",
      icon: <Mic className="w-8 h-8 text-purple-500" />,
    },
    {
      name: "Reggae",
      description:
        "Authentic Caribbean rhythms blending roots, dancehall, and conscious lyrics that pulse with cultural energy, driving crowds to move with messages of unity and resilience.",
      icon: <Music className="w-8 h-8 text-green-500" />,
    },
    {
      name: "Mugithi",
      description:
        "Traditional Kenyan folk music reimagined with contemporary guitar techniques, bridging generational musical landscapes while preserving cultural heritage through modern interpretation.",
      icon: <Guitar className="w-8 h-8 text-orange-500" />,
    },
    {
      name: "Rhumba",
      description:
        "Sophisticated Congolese musical artistry featuring intricate guitar work and vibrant horn sections that define Central African sound, creating an irresistible groove that captivates all senses.",
      icon: <Headphones className="w-8 h-8 text-red-500" />,
    },
    {
      name: "Contemporary",
      description:
        "Boundary-pushing fusion of Afrobeats, pop, and electronic elements that redefines modern African sound. Her contemporary compositions blend digital production with organic instrumentation for a fresh, innovative sonic experience.",
      icon: <Radio className="w-8 h-8 text-blue-500" />,
    },
    {
      name: "Dance",
      description:
        "Dynamic choreographed performances that merge traditional African movements with modern dance styles. Her dance artistry is a physical manifestation of rhythm, telling stories through body language that amplifies the music's emotional impact.",
      icon: <Users className="w-8 h-8 text-pink-500" />,
    },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden"
    >
      <MusicStars />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/sound-wave.png')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column - Musical Narrative */}
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-1 bg-gradient-to-b from-purple-400 to-blue-400"></div>
              <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-200 sm:text-5xl">
                A Symphony of Journeys
              </h2>
            </div>

            <div className="space-y-5 text-lg text-gray-200 leading-relaxed backdrop-blur-sm bg-black/20 p-6 rounded-xl">
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
              <p>
                Her movements flow like liquid rhythm, a visual extension of the
                music itself. When she dances, the boundary between performer
                and performance dissolves—she becomes the living embodiment of
                each beat, each melody, each emotional crescendo.
              </p>
            </div>

            {/* Genre Tabs */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-5 flex items-center">
                <Music className="mr-2 h-6 w-6 text-purple-400" />
                Musical Territories
              </h3>
              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex flex-wrap gap-2 rounded-xl bg-gray-800/80 backdrop-blur-sm p-2">
                  {genres.map((genre) => (
                    <Tab
                      key={genre.name}
                      className={({ selected }) =>
                        `flex-1 min-w-[100px] py-2.5 text-sm font-semibold leading-5 rounded-xl transition-all
                        ${
                          selected
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
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
                      className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-purple-900/30"
                    >
                      <div className="flex items-start space-x-5">
                        <div className="flex-shrink-0 p-3 bg-gray-900/50 rounded-lg">
                          {genre.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-2">
                            {genre.name} Performance
                          </h4>
                          <p className="text-gray-200 text-base leading-relaxed">
                            {genre.description}
                          </p>
                        </div>
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-75 group-hover:opacity-100 animate-pulse blur-sm transition-all duration-1000"></div>
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
                  src="https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Artist in Musical Transcendence"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium tracking-wide opacity-80">
                      Sonic Storytelling
                    </p>
                  </div>
                  <h3 className="text-2xl font-extrabold mt-2 tracking-tight">
                    Nairobi International Festival
                  </h3>
                  <div className="mt-3 flex space-x-2">
                    {["Vocalist", "Performer", "Dancer", "Creator"].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Music visualizer below the image */}
            <div className="relative h-16 mt-4 bg-black/20 rounded-xl overflow-hidden backdrop-blur-sm">
              <AudioWave />
            </div>
          </div>
        </div>

        {/* CTA Section with Musical Energy */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-800 to-blue-800 rounded-3xl p-10 shadow-2xl overflow-hidden relative">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "7s" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "10s" }}
          />

          <div className="flex flex-col items-center relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
              <Music className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white sm:text-4xl mb-5">
              Let's Create Musical Magic
            </h3>
            <p className="text-xl text-purple-100 mb-7 max-w-2xl mx-auto">
              Transform your event from an ordinary gathering to an
              extraordinary musical journey filled with rhythm, movement, and
              emotion.
            </p>
            <a
              href="#booking"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white hover:text-purple-700 transition-all relative group"
            >
              <span className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
              <Calendar className="mr-3 h-6 w-6 relative z-10 group-hover:text-purple-700 transition-colors" />
              <span className="relative z-10 group-hover:text-purple-700 transition-colors">
                Orchestrate Your Experience
              </span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </section>
  );
});

About.displayName = "About";

export default About;
