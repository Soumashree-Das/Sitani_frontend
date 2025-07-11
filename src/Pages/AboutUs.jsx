// import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import projectVideo1 from "../assets/project-1751351933840-532642380.mp4";
// import constructionImage3 from "../assets/constrcution3.jpg";
// import Footer from "../Components/Footer";

// const AboutUs = () => {
//   const [isMuted, setIsMuted] = useState(true);

//   const slides = [
//     {
//       type: "video",
//       src: projectVideo1,
//     },
//     {
//       type: "image",
//       src: constructionImage3,
//     },
//   ];

//   const BASE_URL = process.env.SERVER_URL;

//   const [companyInfo, setCompanyInfo] = useState(null);
//   const [achievements, setAchievements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [imageLoading, setImageLoading] = useState(true);
//   const [imageError, setImageError] = useState(false);

//   const [achievementsLoading, setAchievementsLoading] = useState(false);
//   const [achievementsError, setAchievementsError] = useState(null);
//   const [achievementImagesLoading, setAchievementImagesLoading] = useState({});
//   const [achievementImagesError, setAchievementImagesError] = useState({});

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);

//   const videoRefs = useRef([]);

//   const fetchCompanyInfo = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${BASE_URL}/api/v1/companyInfo/aboutus`
//       );
//       const data = await response.json();

//       if (data.success) {
//         setCompanyInfo(data.data);
//       } else {
//         setError("Failed to fetch company information");
//       }
//     } catch (err) {
//       setError("Error loading company information");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFeaturedAchievements = async () => {
//     try {
//       setAchievementsLoading(true);
//       setAchievementsError(null);

//       const response = await fetch(
//         `${BASE_URL}/api/v1/acheivements/featured`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
//       if (Array.isArray(result)) {
//         setAchievements(result);
//       } else if (result.data) {
//         setAchievements(result.data);
//       } else {
//         throw new Error("Unexpected API response format");
//       }
//     } catch (err) {
//       setAchievementsError(err.message);
//       setAchievements([]);
//     } finally {
//       setAchievementsLoading(false);
//     }
//   };

//   const getImageUrl = (dbPath) => {
//     if (!dbPath) return null;
//     const filename = dbPath.split("/").pop();
//     return `${BASE_URL}/api/v1/companyInfo/uploads/company-images/${filename}`;
//   };

//   const handleImageError = (e, originalPath) => {
//     setImageError(true);
//     setImageLoading(false);
//   };

//   const handleImageLoad = () => {
//     setImageLoading(false);
//     setImageError(false);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
//   const prevSlide = () =>
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCompanyInfo();
//     fetchFeaturedAchievements();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
//           <p className="text-stone-700 text-lg">Loading our story...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-stone-200">
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => {
//               fetchCompanyInfo();
//               fetchFeaturedAchievements();
//             }}
//             className="bg-amber-500 text-stone-900 px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FBFFF1]">
//       {/* <div className="relative w-full h-screen overflow-hidden">
//         <video
//           ref={(el) => (videoRefs.current[0] = el)}
//           src={projectVideo1}
//           autoPlay
//           muted={isMuted}
//           loop
//           playsInline
//           preload="auto"
//           className="w-full h-full object-cover"
//         />
//         <button
//           onClick={() => setIsMuted(!isMuted)}
//           className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
//         >
//           {isMuted ? (
//             <VolumeX className="w-6 h-6 text-amber-500" />
//           ) : (
//             <Volume2 className="w-6 h-6 text-amber-500" />
//           )}
//         </button>
//       </div> */}

//       <div className="relative w-full h-screen overflow-hidden">
//         <video
//           ref={(el) => (videoRefs.current[0] = el)}
//           src={projectVideo1}
//           autoPlay
//           muted={isMuted}
//           loop
//           playsInline
//           preload="auto"
//           className="w-full h-full object-contain" // <== Changed from object-cover to object-contain
//         />

//         {/* Bottom-Right Mute / Unmute Button */}
//         <button
//           onClick={() => setIsMuted(!isMuted)}
//           className="absolute bottom-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
//         >
//           {isMuted ? (
//             <VolumeX className="w-6 h-6 text-amber-500" />
//           ) : (
//             <Volume2 className="w-6 h-6 text-amber-500" />
//           )}
//         </button>
//       </div>

//       {/* Include the rest of your sections like Company Info, Vision, Achievements here */}
//       {/* Main Content Section */}
//       <div className="bg-[#FBFFF1] py-5">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Section Header */}
//           {/* <div className="text-center mb-16">
//             <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
//             <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
//               ABOUT US
//             </h2>
            
//           </div> */}
//           <div className="text-center mb-16">
//             <div className="w-16 h-px bg-amber-500 mx-auto mb-4"></div>
//             <p className="text-amber-500 uppercase tracking-wide text-sm font-semibold mb-2">
//               ABOUT US
//             </p>
//             <h3 className="text-5xl font-bold text-stone-800 mb-8">
//               {companyInfo?.title || "Serving Since 1950"}
//             </h3>
//           </div>
//           {/* Story and Vision Section */}
//           <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
//             {/* Our Story */}
//             <div className="space-y-6">
//               <h4 className="text-3xl font-bold text-stone-800 mb-6">
//                 Our Story
//               </h4>
//               <div className="text-stone-600 text-lg leading-relaxed space-y-4">
//                 {companyInfo?.mission ? (
//                   <p>{companyInfo.mission}</p>
//                 ) : (
//                   <>
//                     <p>
//                       For over seven decades, we have been crafting excellence
//                       in construction, bringing together traditional building
//                       methods with modern innovation.
//                     </p>
//                     <p>
//                       Our journey began in 1985 with a simple vision: to build
//                       exceptional structures that bring communities together and
//                       create lasting value.
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Company Image */}
//             <div className="relative">
//               <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-200">
//                 {companyInfo?.imageUrl && !imageError ? (
//                   <div className="relative">
//                     {imageLoading && (
//                       <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center z-10">
//                         <div className="text-stone-500">Loading image...</div>
//                       </div>
//                     )}

//                     <div className="w-full h-96 overflow-hidden">
//                       <img
//                         src={getImageUrl(companyInfo.imageUrl)}
//                         alt={`${companyInfo.title || "Company"} Image`}
//                         className="w-full h-full object-contain bg-white"
//                         onError={(e) =>
//                           handleImageError(e, companyInfo.imageUrl)
//                         }
//                         onLoad={handleImageLoad}
//                         style={{
//                           display: imageLoading ? "none" : "block",
//                           maxWidth: "90%",
//                           maxHeight: "90%",
//                           margin: "auto",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-96 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
//                     <div className="relative">
//                       <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-amber-500">
//                         <div className="w-24 h-24 bg-gradient-to-b from-amber-600 to-amber-500 rounded-full relative">
//                           <div className="absolute top-2 left-2 w-4 h-4 bg-amber-200 rounded-full opacity-60"></div>
//                         </div>
//                       </div>
//                     </div>

//                     {imageError && (
//                       <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-300 rounded p-2">
//                         <p className="text-red-700 text-sm text-center">
//                           Image could not be loaded
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Our Vision Section */}
//           <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
//             {/* Vision Content */}
//             <div className="lg:order-2 space-y-6">
//               <h4 className="text-3xl font-bold text-stone-800 mb-6">
//                 Our Vision
//               </h4>
//               <div className="text-stone-600 text-lg leading-relaxed space-y-4">
//                 {companyInfo?.vision ? (
//                   <p>{companyInfo.vision}</p>
//                 ) : (
//                   <p>
//                     To become the world's most trusted construction company by
//                     consistently delivering exceptional quality, fostering
//                     community connections, and inspiring architectural
//                     excellence across the globe.
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Location Info */}
//             <div className="lg:order-1">
//               <div className="bg-white rounded-lg shadow-2xl p-8 border border-stone-200">
//                 <h5 className="text-2xl font-bold text-stone-800 mb-6">
//                   Our Location
//                 </h5>
//                 {companyInfo?.location ? (
//                   <div className="space-y-4 text-stone-600">
//                     {companyInfo.location.address && (
//                       <p className="flex items-start space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>{companyInfo.location.address}</span>
//                       </p>
//                     )}
//                     {companyInfo.location.city && (
//                       <p className="flex items-center space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>
//                           {companyInfo.location.city},{" "}
//                           {companyInfo.location.country}
//                         </span>
//                       </p>
//                     )}
//                     {companyInfo.location.timezone && (
//                       <p className="flex items-center space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>Timezone: {companyInfo.location.timezone}</span>
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="space-y-4 text-stone-600">
//                     <p className="flex items-start space-x-3">
//                       <svg
//                         className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <span>123 Construction Street, Builder City</span>
//                     </p>
//                     <p className="flex items-center space-x-3">
//                       <svg
//                         className="w-5 h-5 text-amber-500 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <span>Construction Land, USA</span>
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Featured Achievements Section - Fixed condition and debug info */}
//           {achievements && achievements.length > 0 ? (
//             <div className="mb-20">
//               {/* Section Header */}
//               <div className="text-center mb-16">
//                 <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
//                 <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
//                   OUR ACHIEVEMENTS
//                 </h2>
//                 <h3 className="text-5xl font-bold text-stone-800 mb-8">
//                   Awards & Recognition
//                 </h3>
//                 <p className="text-stone-600 text-lg max-w-3xl mx-auto">
//                   We're proud of the recognition we've received for our
//                   commitment to excellence and innovation.
//                 </p>
//               </div>

//               {/* Achievements Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {achievements.map((achievement, index) => (
//                   <div
//                     key={achievement.id || index}
//                     className="bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
//                   >
//                     {/* Achievement Image */}
//                     <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden relative">
//                       {/* Fallback Icon */}
//                       <div
//                         className="fallback-icon absolute inset-0 flex items-center justify-center"
//                         // style={{ display: achievement.imageUrl ? 'none' : 'flex' }}
//                       >
//                         <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
//                           <svg
//                             className="w-10 h-10 text-white"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 4.2L15 8v10H5V8l5-3.8z"
//                               clipRule="evenodd"
//                             />
//                             <path d="M10 8l-2 6h1l.5-1.5h3L13 14h1l-2-6h-2zm0 2.5l.75 2.25h-1.5L10 10.5z" />
//                           </svg>
//                         </div>
//                       </div>

//                       {/* Category Badge */}
//                       {achievement.category && (
//                         <div className="absolute top-4 left-4">
//                           <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
//                             {achievement.category.replace(/"/g, "")}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Achievement Content */}
//                     <div className="p-6">
//                       <h4 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2">
//                         {achievement.title
//                           ? achievement.title.replace(/"/g, "")
//                           : "Achievement Title"}
//                       </h4>

//                       <p className="text-stone-600 mb-4 line-clamp-3">
//                         {achievement.description
//                           ? achievement.description.replace(/"/g, "")
//                           : "Achievement description not available."}
//                       </p>

//                       {/* Tags */}
//                       {achievement.tags && achievement.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {achievement.tags.slice(0, 3).map((tag, tagIndex) => (
//                             <span
//                               key={tagIndex}
//                               className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs"
//                             >
//                               {tag.replace ? tag.replace(/"/g, "") : tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       {/* Date */}
//                       <div className="flex items-center text-sm text-stone-500">
//                         <svg
//                           className="w-4 h-4 mr-2"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>
//                           {achievement.dateAchieved
//                             ? formatDate(achievement.dateAchieved)
//                             : "Date not available"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* View All Button */}
//               <div className="text-center mt-12">
//                 <button
//                   className="bg-amber-500 text-stone-900 px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium"
//                   onClick={() => navigate("/achievements/all")} // Using react-router navigation
//                 >
//                   View All Achievements
//                 </button>
//               </div>
//             </div>
//           ) : (
//             /* Show this when no achievements are found */
//             process.env.NODE_ENV === "development" && (
//               <div className="mb-20 p-8 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
//                 <h3 className="text-xl font-bold text-yellow-800 mb-4">
//                   No Achievements Found
//                 </h3>
//                 <p className="text-yellow-700 mb-4">
//                   The achievements section is not displaying because:
//                 </p>
//                 <ul className="text-left text-yellow-700 space-y-2 max-w-md mx-auto">
//                   <li>• No achievements data returned from API</li>
//                   <li>• API endpoint might be incorrect</li>
//                   <li>• Check console for API errors</li>
//                   <li>• Verify API is running on port 8090</li>
//                 </ul>
//                 <button
//                   onClick={fetchFeaturedAchievements}
//                   className="mt-4 bg-yellow-500 text-yellow-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
//                 >
//                   Retry Loading Achievements
//                 </button>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default AboutUs;


import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import projectVideo1 from "../assets/project-1751351933840-532642380.mp4";
import constructionImage3 from "../assets/constrcution3.jpg";
import Footer from "../Components/Footer";

// ✅ Use Vite‑style env var (falls back to "")
const BASE_URL = import.meta.env.VITE_SERVER_URL ?? "";

const AboutUs = () => {
  const [isMuted, setIsMuted] = useState(true);

  const slides = [
    { type: "video", src: projectVideo1 },
    { type: "image", src: constructionImage3 },
  ];

  const [companyInfo, setCompanyInfo] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementsError, setAchievementsError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const videoRefs = useRef([]);
  const navigate = useNavigate();

  /* ──────── data fetchers ──────── */
  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/v1/companyInfo/aboutus`);
      const data = await res.json();
      if (data.success) setCompanyInfo(data.data);
      else throw new Error("Failed to fetch company information");
    } catch (err) {
      setError(err.message || "Error loading company information");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedAchievements = async () => {
    try {
      setAchievementsLoading(true);
      const res = await fetch(`${BASE_URL}/api/v1/acheivements/featured`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const result = await res.json();
      setAchievements(Array.isArray(result) ? result : result.data ?? []);
    } catch (err) {
      setAchievementsError(err.message);
      setAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  };

  /* ──────── helpers ──────── */
  const getImageUrl = (dbPath) => {
    if (!dbPath) return null;
    const filename = dbPath.split("/").pop();
    return `${BASE_URL}/api/v1/companyInfo/uploads/company-images/${filename}`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ──────── lifecycle ──────── */
  useEffect(() => {
    fetchCompanyInfo();
    fetchFeaturedAchievements();
  }, []);

  /* ──────── early returns ──────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-amber-500"></div>
          <p className="text-lg text-stone-700">Loading our story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-lg">
          <p className="mb-4 text-lg text-red-600">{error}</p>
          <button
            onClick={() => {
              fetchCompanyInfo();
              fetchFeaturedAchievements();
            }}
            className="rounded-lg bg-amber-500 px-6 py-2 font-medium text-stone-900 transition-colors hover:bg-amber-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ──────── component ──────── */
  return (
    <div className="min-h-screen bg-[#FBFFF1]">
      {/* hero video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          ref={(el) => (videoRefs.current[0] = el)}
          src={projectVideo1}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-contain"
        />
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute bottom-6 right-6 rounded-full bg-white/20 p-3 backdrop-blur-sm transition hover:bg-white/30"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-amber-500" />
          ) : (
            <Volume2 className="h-6 w-6 text-amber-500" />
          )}
        </button>
      </div>

      {/* main content */}
      <div className="bg-[#FBFFF1] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* header */}
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-px w-16 bg-amber-500"></div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-500">
              ABOUT US
            </p>
            <h3 className="mb-8 text-5xl font-bold text-stone-800">
              {companyInfo?.title || "Serving Since 1950"}
            </h3>
          </div>

          {/* our story */}
          <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <h4 className="mb-6 text-3xl font-bold text-stone-800">
                Our Story
              </h4>
              <div className="space-y-4 text-lg leading-relaxed text-stone-600">
                {companyInfo?.mission ? (
                  <p>{companyInfo.mission}</p>
                ) : (
                  <>
                    <p>
                      For over seven decades, we have been crafting excellence
                      in construction, blending traditional methods with modern
                      innovation.
                    </p>
                    <p>
                      Our journey began in 1985 with a simple vision: to build
                      exceptional structures that unite communities and create
                      lasting value.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* company image */}
            <div className="relative">
              <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl">
                {companyInfo?.imageUrl && !imageError ? (
                  <div className="relative">
                    {imageLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center animate-pulse bg-stone-200">
                        <span className="text-stone-500">Loading image...</span>
                      </div>
                    )}
                    <img
                      src={getImageUrl(companyInfo.imageUrl)}
                      alt={companyInfo.title || "Company"}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                      className="mx-auto block h-96 w-full bg-white object-contain"
                      style={{ display: imageLoading ? "none" : "block" }}
                    />
                  </div>
                ) : (
                  <div className="relative flex h-96 w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <div className="relative">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
                        <div className="relative h-24 w-24 rounded-full bg-gradient-to-b from-amber-600 to-amber-500">
                          <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-amber-200 opacity-60"></div>
                        </div>
                      </div>
                    </div>
                    {imageError && (
                      <div className="absolute bottom-4 left-4 right-4 rounded border border-red-300 bg-red-100 p-2 text-center text-sm text-red-700">
                        Image could not be loaded
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* our vision */}
          <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 space-y-6 lg:order-2">
              <h4 className="mb-6 text-3xl font-bold text-stone-800">
                Our Vision
              </h4>
              <div className="space-y-4 text-lg leading-relaxed text-stone-600">
                {companyInfo?.vision ? (
                  <p>{companyInfo.vision}</p>
                ) : (
                  <p>
                    To become the world's most trusted construction company by
                    consistently delivering quality, fostering community
                    connections, and inspiring architectural excellence globally.
                  </p>
                )}
              </div>
            </div>

            {/* location */}
            <div className="order-1 lg:order-1">
              <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-2xl">
                <h5 className="mb-6 text-2xl font-bold text-stone-800">
                  Our Location
                </h5>
                {companyInfo?.location ? (
                  <div className="space-y-4 text-stone-600">
                    {companyInfo.location.address && (
                      <p className="flex items-start space-x-3">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{companyInfo.location.address}</span>
                      </p>
                    )}
                    {companyInfo.location.city && (
                      <p className="flex items-center space-x-3">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-amber-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {companyInfo.location.city},{" "}
                          {companyInfo.location.country}
                        </span>
                      </p>
                    )}
                    {companyInfo.location.timezone && (
                      <p className="flex items-center space-x-3">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-amber-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Timezone: {companyInfo.location.timezone}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-stone-600">
                    <p className="flex items-start space-x-3">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>123 Construction Street, Builder City</span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Construction Land, USA</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* achievements */}
          {achievements.length > 0 ? (
            <div className="mb-20">
              <div className="mb-16 text-center">
                <div className="mx-auto mb-6 h-16 w-1 bg-amber-500"></div>
                <h2 className="mb-4 text-lg font-medium uppercase tracking-wider text-amber-600">
                  OUR ACHIEVEMENTS
                </h2>
                <h3 className="mb-8 text-5xl font-bold text-stone-800">
                  Awards & Recognition
                </h3>
                <p className="mx-auto max-w-3xl text-lg text-stone-600">
                  We're proud of the recognition we've received for our
                  commitment to excellence and innovation.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((ach, idx) => (
                  <div
                    key={ach.id || idx}
                    className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                      {ach.category && (
                        <span className="absolute top-4 left-4 rounded-full bg-amber-500 px-3 py-1 text-sm font-medium capitalize text-stone-900">
                          {ach.category.replace(/"/g, "")}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="mb-3 line-clamp-2 text-xl font-bold text-stone-800">
                        {ach.title ? ach.title.replace(/"/g, "") : "Untitled"}
                      </h4>
                      <p className="mb-4 line-clamp-3 text-stone-600">
                        {ach.description
                          ? ach.description.replace(/"/g, "")
                          : "Achievement description not available."}
                      </p>
                      {ach.tags?.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {ach.tags.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-600"
                            >
                              {t.replace ? t.replace(/"/g, "") : t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-stone-500">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {ach.dateAchieved
                            ? formatDate(ach.dateAchieved)
                            : "Date not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  className="rounded-lg bg-amber-500 px-8 py-3 font-medium text-stone-900 transition-colors duration-300 hover:bg-amber-600"
                  onClick={() => navigate("/achievements/all")}
                >
                  View All Achievements
                </button>
              </div>
            </div>
          ) : (
            import.meta.env.DEV && (
              <div className="mb-20 rounded-lg border border-yellow-300 bg-yellow-100 p-8 text-center">
                <h3 className="mb-4 text-xl font-bold text-yellow-800">
                  No Achievements Found
                </h3>
                <p className="mb-4 text-yellow-700">
                  The achievements section is not displaying because:
                </p>
                <ul className="mx-auto max-w-md space-y-2 text-left text-yellow-700">
                  <li>• No achievements data returned from API</li>
                  <li>• API endpoint might be incorrect</li>
                  <li>• Check console for API errors</li>
                  <li>• Verify API is running on port 8090</li>
                </ul>
                <button
                  onClick={fetchFeaturedAchievements}
                  className="mt-4 rounded-lg bg-yellow-500 px-6 py-2 font-medium text-yellow-900 transition-colors hover:bg-yellow-600"
                >
                  Retry Loading Achievements
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
