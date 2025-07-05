import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Hammer,
  Building,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom"; // Add this import for navigation
import constructionImage3 from "../assets/constrcution3.jpg";
import constructionImage2 from "../assets/constrcution2.jpg";
import constructionImage1 from "../assets/construction1.webp";

const BASE_URL = import.meta.env.VITE_SERVER_URL

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      title: "We Have Been Building",
      subtitle: "EXCELLENCE",
      tagline: "* SINCE 1985 *",
      description:
        "Premium construction services with over 35 years of experience",
      backgroundImage: `url(${constructionImage1})`
    },
    {
      title: "Creating Your Dream",
      subtitle: "PROJECTS",
      tagline: "* TRUSTED BUILDERS *",
      description: "From residential homes to commercial complexes",
      backgroundImage: `url(${constructionImage2})`
    },
    {
      title: "Quality & Innovation",
      subtitle: "GUARANTEED",
      tagline: "* AWARD WINNING *",
      description:
        "Delivering exceptional results with cutting-edge techniques",
      backgroundImage: `url(${constructionImage3})`
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Navigation - Keep exactly as is */}

      {/* Hero Section - Now with text content above background */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: slide.backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Text Content Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
          <div className="relative z-20 text-center px-4 max-w-6xl">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <p className="text-amber-400 text-xl md:text-2xl font-medium mb-4 tracking-wide">
                {slides[currentSlide].title}
              </p>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-none">
                {slides[currentSlide].subtitle}
              </h1>

              <p className="text-white text-lg md:text-xl font-medium mb-8 tracking-widest">
                {slides[currentSlide].tagline}
              </p>

              <p className="text-stone-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact-us"
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center"
                >
                  Contact Us
                </Link>
                <Link 
                  to="/projects"
                  className="border-2 border-white hover:bg-white hover:text-stone-900 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-block text-center"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-amber-500 w-8"
                  : "bg-stone-600 hover:bg-stone-500"
              }`}
            />
          ))}
        </div>
      </section>

      

  
    </div>
  );
};

export default Home;