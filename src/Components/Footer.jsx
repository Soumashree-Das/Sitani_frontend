

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LayoutDashboard } from "lucide-react";
import axios from "axios";
import LogoutButton from "../../dashboard/components/LogoutButton";
import footer_bg from "../assets/footer_bg.avif"
const BASE_URL = import.meta.env.VITE_SERVER_URL

function Footer() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (admin)
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/auth/verify`,
          {
            withCredentials: true,
          }
        );
        setIsAdmin(response.data.isAuthenticated);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div
      className="relative h-64 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${footer_bg})`,
      }}
    >
      <div className="absolute inset-0 bg-stone-900/80"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Vision?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/contact-us")}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
            >
              Contact Us
            </button>

            {isAdmin ? (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <LogoutButton className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold" />
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/30 transition-colors duration-300"
              >
                <Lock className="w-4 h-4" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;