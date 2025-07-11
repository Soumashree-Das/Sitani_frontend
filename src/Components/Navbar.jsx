import React, { useState } from "react";
import { ChevronRight, Menu, X, Hammer, Link } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Hammer className="w-6 h-6 text-stone-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white">
              MP SITANI AND SONS
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>
            
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  About
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Services
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Projects
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>
            
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Announcements
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `nav-item font-medium transition-colors relative ${
                  isActive
                    ? "text-amber-400"
                    : "text-white hover:text-amber-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Contact Us
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-amber-300 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-800 border-t border-stone-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/projects"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/news"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Announcements
            </NavLink>
            <NavLink
              to="/contact-us"
              className="block px-3 py-2 text-white hover:text-amber-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;