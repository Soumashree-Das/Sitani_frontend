import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Element } from "react-scroll";
import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import AboutUsPage from "./Pages/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import Services from "./Pages/Services.jsx";
import Projects from "./Pages/Projects.jsx";
import AnnouncementPage from "./Pages/AnnouncementPage.jsx";
import ProjectsDashboard from "../dashboard/pages/Projects.jsx";
import ServicesDashboard from "../dashboard/pages/Services.jsx";
import AchievementsDashboard from "../dashboard/pages/Acheivements.jsx";
import CompanyInfoDashboard from "../dashboard/pages/CompanyInfo.jsx";
import AnnouncementsDashboard from "../dashboard/pages/News.jsx";
import Dashboard_home from "../dashboard/pages/Dashboard_home.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AllAcheivements from "./Components/AllAcheivements.jsx";

// Mobile scroll-based home page component - only includes scrollable sections
const MobileScrollHomePage = () => {
  return (
    <div>
      {/* Home Section */}
      <Element name="home" id="home">
        <Home />
      </Element>

      {/* About Section */}
      <Element name="about" id="about">
        <AboutUsPage />
      </Element>

      {/* Announcements Section */}
      <Element name="news" id="news">
        <AnnouncementPage />
      </Element>

      {/* Contact Section */}
      <Element name="contact-us" id="contact-us">
        <ContactUs />
      </Element>
    </div>
  );
};

// Component to detect screen size and render accordingly
const ResponsiveHomePage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // For mobile, render scroll-based layout (without Services and Projects)
  if (isMobile) {
    return <MobileScrollHomePage />;
  }
  
  // For desktop, render normal Home component
  return <Home />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home route - responsive behavior */}
        <Route path="/" element={<ResponsiveHomePage />} />
        
        {/* Individual pages - always separate routes */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<AnnouncementPage />} />
        
        {/* Other routes */}
        <Route path="/MP_sitani_and_sons_dashboard/admin/login" element={<LoginPage />} />
        <Route path="/achievements/all" element={<AllAcheivements />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard_home />} />
          <Route path="/admin/projects" element={<ProjectsDashboard />} />
          <Route path="/admin/services" element={<ServicesDashboard />} />
          <Route path="/admin/acheivements" element={<AchievementsDashboard />} />
          <Route path="/admin/companyInfo" element={<CompanyInfoDashboard />} />
          <Route path="/admin/news" element={<AnnouncementsDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;