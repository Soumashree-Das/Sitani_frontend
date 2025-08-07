import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, Hammer } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === "/";

  // Define navigation items with both scroll and route properties
  const navItems = [
    { name: "Home", to: "home", route: "/", isScrollable: true },
    { name: "About", to: "about", route: "/about", isScrollable: true },
    { name: "Services", to: "services", route: "/services", isScrollable: false },
    { name: "Projects", to: "projects", route: "/projects", isScrollable: false },
    { name: "News", to: "news", route: "/news", isScrollable: true },
    { name: "Contact", to: "contact-us", route: "/contact-us", isScrollable: true },
  ];

  const handleMobileNavClick = (item) => {
    setIsMenuOpen(false);
    
    if (isHomePage && item.isScrollable) {
      // If on home page and item is scrollable, use scroll
      const element = document.getElementById(item.to);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Otherwise navigate to the route
      navigate(item.route);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Hammer className="w-6 h-6 text-stone-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white">
              MP SITANI AND SONS
            </h1>
          </NavLink>

          {/* Desktop Navigation - Traditional Routing */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
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
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
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
            {navItems.map((item) => {
              return (
                <button
                  key={item.to}
                  onClick={() => handleMobileNavClick(item)}
                  className="block w-full text-left px-3 py-2 text-white hover:text-amber-300 cursor-pointer transition-colors"
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;