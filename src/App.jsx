
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginPage from "./Pages/LoginPage.jsx"; // Add this import
import ProtectedRoute from "./auth/ProtectedRoute.jsx"; // Add this import
import AllAcheivements from "./Components/AllAcheivements.jsx";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<AnnouncementPage />} />
        <Route path="/MP_sitani_and_sons_dashboard/admin/login" element={<LoginPage />} /> {/* Add login route */}
        <Route path="/achievements/all" element={<AllAcheivements />} /> {/* Add login route */}

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