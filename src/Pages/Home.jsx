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

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();
  const foundingYear = 1963;
  const yearsOfExperience = currentYear - foundingYear;
  const slides = [
    {
      title: "We Have Been Building",
      subtitle: "EXCELLENCE",
      tagline: "* SINCE 1963 *",
      description: `Premium construction services with over ${yearsOfExperience} years of experience`,
      backgroundImage: `url(${constructionImage1})`,
    },
    {
      title: "Creating Your Dream",
      subtitle: "PROJECTS",
      tagline: "* TRUSTED BUILDERS *",
      description: "From residential homes to commercial complexes",
      backgroundImage: `url(${constructionImage2})`,
    },
    {
      title: "Quality & Innovation",
      subtitle: "GUARANTEED",
      tagline: "* AWARD WINNING *",
      description:
        "Delivering exceptional results with cutting-edge techniques",
      backgroundImage: `url(${constructionImage3})`,
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

      {/* Hero Section - Fully Responsive */}
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
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* Text Content Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
          <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Title - Responsive text sizing */}
              <p className="text-amber-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-2 sm:mb-3 md:mb-4 tracking-wide">
                {slides[currentSlide].title}
              </p>

              {/* Main Heading - Highly responsive with proper scaling */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-none px-2">
                {slides[currentSlide].subtitle}
              </h1>

              {/* Tagline - Responsive spacing and sizing */}
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 md:mb-8 tracking-widest">
                {slides[currentSlide].tagline}
              </p>

              {/* Description - Proper line height and responsive sizing */}
              <p className="text-stone-300 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-12 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
                {slides[currentSlide].description}
              </p>

              {/* Buttons - Fully responsive with proper touch targets */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 justify-center items-center px-4 sm:px-0">
                <Link
                  to="/contact-us"
                  className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 min-w-[160px] lg:py-2 lg:px-4 lg:min-w-[120px] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center text-sm sm:text-base"
                >
                  Contact Us
                </Link>
                <Link
                  to="/projects"
                  className="w-full lg:w-auto border-2 border-white hover:bg-white hover:text-stone-900 text-white font-bold py-4 px-8 min-w-[160px] lg:py-2 lg:px-4 lg:min-w-[120px] rounded-lg transition-all duration-300 inline-block text-center text-sm sm:text-base"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Responsive positioning and sizing */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Slide Indicators - Responsive sizing and positioning */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentSlide
                  ? "bg-amber-500 w-6 sm:w-8"
                  : "bg-stone-600 hover:bg-stone-500 w-2.5 sm:w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Optional: Scroll indicator for larger screens */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
