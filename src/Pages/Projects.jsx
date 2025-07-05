import projectBg from "../assets/project_bg.avif";
import Footer from "../Components/Footer.jsx";
import constructionImage1 from "../assets/constructionImage1.jpeg";
import constructionImage2 from "../assets/constructionImage2.jpeg";
import constructionImage3 from "../assets/constructionImage3.jpeg";
import constructionImage4 from "../assets/constructionImage4.jpeg";
import constructionImage5 from "../assets/constructionImage5.jpeg";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMedia, setProjectMedia] = useState({ images: [], videos: [] });
  const [mediaLoading, setMediaLoading] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/v1/projects/featured`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let projectsArray;
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          projectsArray = data.data;
        } else if (data.projects && Array.isArray(data.projects)) {
          projectsArray = data.projects;
        } else if (data.results && Array.isArray(data.results)) {
          projectsArray = data.results;
        } else {
          projectsArray = Object.values(data);
        }

        setProjects(projectsArray.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        // Fallback data
        setProjects([
          {
            _id: 1,
            name: "Skyline Residential Complex",
            description:
              "A modern 25-story residential tower with premium amenities, sustainable design, and panoramic city views. Features include smart home technology and energy-efficient systems.",
            status: "ongoing",
            startDate: "2024-01-15",
            endDate: "2025-12-30",
            featured: true,
            teamMembers: [
              { name: "John Smith", role: "Project Manager" },
              { name: "Sarah Wilson", role: "Site Engineer" },
            ],
          },
          {
            _id: 2,
            name: "Metro Bridge Construction",
            description:
              "Construction of a major bridge spanning 500 meters across the river, designed to handle heavy traffic loads and withstand extreme weather conditions.",
            status: "completed",
            startDate: "2023-03-01",
            endDate: "2024-02-28",
            featured: true,
            teamMembers: [
              { name: "Mike Johnson", role: "Structural Engineer" },
              { name: "Lisa Brown", role: "Construction Supervisor" },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const extractFilename = (path) => {
    return path.split("/").pop(); // Extracts filename from path
  };

  const fetchProjectMedia = async (projectId) => {
    try {
      setMediaLoading(true);

      const [imagesResponse, videosResponse] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/projects/${projectId}/images`),
        fetch(`${BASE_URL}/api/v1/projects/${projectId}/videos`),
      ]);

      const imagesData = await imagesResponse.json();
      const videosData = await videosResponse.json();

      console.log("imagesData", imagesData);
      console.log("videosData", videosData);

      const imageURLs = imagesData.success
        ? imagesData.images.map((path) => {
            const filename = extractFilename(path);
            return `${BASE_URL}/api/v1/projects/media/image/${filename}`;
          })
        : [];

      const videoURLs = videosData.success
        ? videosData.videos.map((path) => {
            const filename = extractFilename(path);
            return `${BASE_URL}/api/v1/projects/media/video/${filename}`;
          })
        : [];

      console.log("imageURLs", imageURLs);
      console.log("videoURLs", videoURLs);

      setProjectMedia({
        images: imageURLs,
        videos: videoURLs,
      });
    } catch (err) {
      console.error("Error fetching project media:", err);
      setProjectMedia({ images: [], videos: [] });
    } finally {
      setMediaLoading(false);
    }
  };

  // Handle Learn More button click
  const handleLearnMore = async (project) => {
    setSelectedProject(project);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
    await fetchProjectMedia(project._id);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProject(null);
    setProjectMedia({ images: [], videos: [] });
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
  };

  // Navigate media slider
  const nextMedia = () => {
    const totalMedia = projectMedia.images.length + projectMedia.videos.length;
    if (totalMedia > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % totalMedia);
      setIsVideoPlaying(false);
    }
  };

  const prevMedia = () => {
    const totalMedia = projectMedia.images.length + projectMedia.videos.length;
    if (totalMedia > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
      setIsVideoPlaying(false);
    }
  };

  // Get current media item
  const getCurrentMedia = () => {
    const allMedia = [...projectMedia.images, ...projectMedia.videos];
    return allMedia[currentMediaIndex];
  };
  console.log("current media", getCurrentMedia());

  // Check if current media is video
  const isCurrentMediaVideo = () => {
    const currentMedia = getCurrentMedia();
    return currentMedia && currentMedia.includes(".mp4");
  };

  // Static images for project cards
  const getProjectImage = (projectName, index) => {
    const images = [
      constructionImage1,
      constructionImage2,
      constructionImage3,
      constructionImage4,
      constructionImage5,
    ];
    return images[index % images.length];
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "ongoing":
        return "bg-blue-500";
      case "planned":
        return "bg-yellow-500";
      case "on-hold":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-300 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Header */}
      <div
        className="relative h-96 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${projectBg})`,
        }}
      >
        <div className="absolute inset-0 bg-stone-900/85"></div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">PROJECTS</h1>
            <div className="flex items-center justify-center space-x-2 text-stone-300">
              <span>Home</span>
              <span>/</span>
              <span className="text-amber-400">Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div
        className="py-20 bg-stone-100"
        style={{ backgroundColor: "#FBFFF1" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-px bg-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-500 uppercase tracking-wide text-sm font-semibold mb-2">
              OUR PROJECTS
            </p>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              Building Excellence & Innovation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getProjectImage(project.name, index)}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getStatusColor(
                        project.status
                      )} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}
                    >
                      {project.status}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-3">
                    {project.name}
                  </h3>
                  <div className="max-w-full overflow-hidden mb-4">
                    <p className="text-stone-600 leading-relaxed break-words whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Start Date:</span>
                      <span className="text-stone-700 font-medium">
                        {formatDate(project.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">End Date:</span>
                      <span className="text-stone-700 font-medium">
                        {formatDate(project.endDate)}
                      </span>
                    </div>
                  </div>

                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-700 mb-2">
                        Team Members:
                      </h4>
                      <div className="space-y-1">
                        {project.teamMembers.slice(0, 2).map((member, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-stone-600">
                              {member.name}
                            </span>
                            <span className="text-stone-500">
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleLearnMore(project)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {selectedProject.name}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`${getStatusColor(
                      selectedProject.status
                    )} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}
                  >
                    {selectedProject.status}
                  </span>
                  {selectedProject.featured && (
                    <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-stone-500 hover:text-stone-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {/* Media Slider */}
              {mediaLoading ? (
                <div className="flex items-center justify-center h-96 bg-stone-800 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <div className="relative mb-6">
                  {projectMedia.images.length > 0 ||
                  projectMedia.videos.length > 0 ? (
                    <div className="relative h-96 bg-stone-800 rounded-lg overflow-hidden">
                      {isCurrentMediaVideo() ? (
                        <video
                          className="w-full h-full object-contain"
                          controls
                          src={getCurrentMedia()}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                        />
                      ) : (
                        <img
                          className="w-full h-full object-contain"
                          src={getCurrentMedia()}
                          alt={`${selectedProject.name} media`}
                        />
                      )}

                      {/* Navigation Arrows */}
                      {projectMedia.images.length + projectMedia.videos.length >
                        1 && (
                        <>
                          <button
                            onClick={prevMedia}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-amber-500 text-white p-2 rounded-full transition-colors z-10"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextMedia}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-amber-500 text-white p-2 rounded-full transition-colors z-10"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}

                      {/* Media Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentMediaIndex + 1} /{" "}
                        {projectMedia.images.length +
                          projectMedia.videos.length}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-stone-800 rounded-lg">
                      <p className="text-stone-300">
                        No media available for this project
                      </p>
                    </div>
                  )}

                  {/* Media Thumbnails */}
                  {projectMedia.images.length + projectMedia.videos.length >
                    1 && (
                    <div className="flex space-x-3 mt-4 overflow-x-auto py-2 px-1">
                      {[...projectMedia.images, ...projectMedia.videos].map(
                        (media, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                              currentMediaIndex === index
                                ? "border-amber-500 scale-105"
                                : "border-stone-700 hover:border-amber-400"
                            }`}
                          >
                            {media.includes(".mp4") ? (
                              <div className="w-full h-full bg-stone-700 flex items-center justify-center">
                                <Play size={16} className="text-amber-400" />
                              </div>
                            ) : (
                              <img
                                src={media}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Project Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Description Column */}
                <div className="break-words overflow-hidden">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Project Description
                  </h3>
                  <div className="bg-amber-500 p-4 rounded-lg border border-stone-700">
                    <p className="text-stone-700 whitespace-pre-wrap break-words">
                      {selectedProject.description ||
                        "No description available"}
                    </p>
                  </div>
                </div>

                {/* Project Details Column */}
                <div className="md:pl-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Project Details
                  </h3>
                  <div className="bg-amber-500 p-4 rounded-lg space-y-3 border border-stone-700">
                    <div className="flex items-start">
                      <Calendar
                        size={16}
                        className="text-stone-700 mt-0.5 flex-shrink-0"
                      />
                      <div className="ml-3">
                        <div className="text-sm text-stone-700">Start Date</div>
                        <div className="text-stone-700 font-medium">
                          {selectedProject.startDate
                            ? formatDate(selectedProject.startDate)
                            : "Not specified"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar
                        size={16}
                        className="text-stone-700 mt-0.5 flex-shrink-0"
                      />
                      <div className="ml-3">
                        <div className="text-sm text-stone-700">End Date</div>
                        <div className="text-stone-700 font-medium">
                          {selectedProject.endDate &&
                          selectedProject.endDate !== "Invalid Date"
                            ? formatDate(selectedProject.endDate)
                            : "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">API Error: Using fallback data</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
