import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  Building2,
  Wrench,
  Users,
} from "lucide-react";
import backgroundImage from "../assets/construction1.webp";
import Footer from "../Components/Footer";
import { api } from "../lib/api";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get("/announcements/get");
        if (data.success) {
          setAnnouncements(data.data);
        } else {
          setError("Failed to fetch announcements");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Showing demo announcements.");
        setAnnouncements([
          {
            _id: "1",
            title: "New Project Guidelines Released",
            content:
              "We have updated our project management guidelines to ensure better coordination and efficiency across all departments.",
            publishDate: new Date().toISOString(),
            priority: 2,
            isActive: true,
          },
          {
            _id: "2",
            title: "Team Meeting - Q2 Review",
            content:
              "Join us for the quarterly review meeting to discuss project progress and upcoming milestones.",
            publishDate: new Date(Date.now() - 86400000).toISOString(),
            priority: 1,
            isActive: true,
          },
          {
            _id: "3",
            title: "Safety Protocol Update",
            content:
              "Important updates to our safety protocols. All team members must review the new guidelines before starting any construction work.",
            publishDate: new Date(Date.now() - 172800000).toISOString(),
            priority: 3,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "border-l-red-500";
      case 2:
        return "border-l-amber-500";
      case 3:
        return "border-l-green-500";
      default:
        return "border-l-stone-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[#FBFFF1] md:mt-16">
        {/* Hero Section */}
        <div
          className="relative h-96 bg-cover bg-center bg-no-repeat "
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold block text-orange-400 leading-tight">
                  ANNOUNCEMENTS
                </h1>
                <div className="w-20 h-1 bg-orange-500 rounded-full" />
              </div>
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-md sm:max-w-lg mx-auto">
                Building Excellence & Innovation
              </p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md sm:max-w-lg mx-auto">
                Stay updated with our latest construction projects, company
                announcements, and industry developments that shape our
                commitment to excellence.
              </p>
            </div>
          </div>

          {/* Decorative wave bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full h-16 fill-[#FBFFF1]"
            >
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="w-full min-h-screen bg-stone-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
            {/* Announcements Section */}
            <div className="mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <span className="text-amber-600 text-sm font-semibold tracking-wider uppercase">
                  Latest Updates
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mt-2 mb-4">
                  Announcements
                </h2>
                <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  <p className="text-stone-600 mt-4">
                    Loading announcements...
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 w-full">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className={`bg-white rounded-lg p-4 sm:p-6 border-l-4 ${getPriorityColor(
                        announcement.priority
                      )} hover:bg-stone-50 transition-colors duration-300 shadow-md hover:shadow-lg w-full`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-stone-900 break-words flex-1">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center text-stone-600 text-sm flex-shrink-0">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="whitespace-nowrap">
                            {formatDate(announcement.publishDate)}
                          </span>
                        </div>
                      </div>

                      <p className="text-stone-700 leading-relaxed mb-4 break-words text-sm sm:text-base">
                        {announcement.content}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center text-stone-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>
                            Priority:{" "}
                            {announcement.priority === 1
                              ? "High"
                              : announcement.priority === 2
                              ? "Medium"
                              : "Low"}
                          </span>
                        </div>
                        {announcement.expiryDate && (
                          <div className="flex items-center text-stone-600 text-sm">
                            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              Expires: {formatDate(announcement.expiryDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-6 text-center text-red-600 px-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </>
  );
};

export default AnnouncementPage;
