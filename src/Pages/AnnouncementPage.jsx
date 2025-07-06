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
      <div className="min-h-screen" style={{ backgroundColor: "#FBFFF1" }}>
        {/* Hero Section */}
        <div
          className="relative h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold block text-orange-400 leading-tight">
                  ANNOUNCEMENTS
                </h1>
                <div className="w-20 h-1 bg-orange-500 rounded-full" />
              </div>
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Building Excellence & Innovation
              </p>
              <p className="text-gray-300 leading-relaxed max-w-lg">
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
        <div className="container mx-auto px-6 py-16">
          {/* Announcements Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <span className="text-amber-600 text-sm font-semibold tracking-wider uppercase">
                Latest Updates
              </span>
              <h2 className="text-4xl font-bold text-stone-900 mt-2 mb-4">
                Announcements
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <p className="text-stone-600 mt-4">Loading announcements...</p>
              </div>
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`bg-white rounded-lg p-6 border-l-4 ${getPriorityColor(
                      announcement.priority
                    )} hover:bg-stone-50 transition-colors duration-300 shadow-md hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-stone-900 pr-4">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center text-stone-600 text-sm whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(announcement.publishDate)}
                      </div>
                    </div>
                    <p className="text-stone-700 leading-relaxed mb-4">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-stone-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Priority:{" "}
                        {announcement.priority === 1
                          ? "High"
                          : announcement.priority === 2
                          ? "Medium"
                          : "Low"}
                      </div>
                      {announcement.expiryDate && (
                        <div className="flex items-center text-stone-600 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Expires: {formatDate(announcement.expiryDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-6 text-center text-red-600">{error}</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AnnouncementPage;
