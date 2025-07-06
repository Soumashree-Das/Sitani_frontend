// import React, { useState, useEffect } from "react";
// import backgroundImage from "../assets/constrcution2.jpg";
// import Footer from "../Components/Footer";
// import construction1 from "../assets/construction1.webp";
// import construction2 from "../assets/constrcution2.jpg";
// import construction3 from "../assets/constrcution3.jpg";
// const BASE_URL = import.meta.env.VITE_SERVER_URL;
// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Array of construction images to cycle through
//   const constructionImages = [construction1, construction2, construction3];

//   // Fetch services from localhost API
//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${BASE_URL}/api/v1/services/featured`);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Handle different response structures
//         let servicesArray;
//         if (Array.isArray(data)) {
//           servicesArray = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           servicesArray = data.data;
//         } else if (data.services && Array.isArray(data.services)) {
//           servicesArray = data.services;
//         } else if (data.results && Array.isArray(data.results)) {
//           servicesArray = data.results;
//         } else {
//           // If it's an object, try to convert it to an array
//           servicesArray = Object.values(data);
//         }

//         // Get only top 6 services and assign images cyclically
//         const servicesWithImages = servicesArray.slice(0, 6).map((service, index) => ({
//           ...service,
//           image: service.image || constructionImages[index % constructionImages.length]
//         }));

//         setServices(servicesWithImages);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching services:", err);
//         setError(err.message);
//         // Fallback to placeholder data if API fails
//         setServices([
//           {
//             id: 1,
//             title: "Fastest Door Delivery",
//             description:
//               "Get your favorite coffee delivered to your doorstep within 30 minutes. Fresh, hot, and ready to energize your day.",
//             image: construction1,
//             icon: "🚚",
//           },
//           {
//             id: 2,
//             title: "Fresh Coffee Beans",
//             description:
//               "Premium organic coffee beans sourced directly from sustainable farms. Roasted daily to ensure maximum freshness and flavor.",
//             image: construction2,
//             icon: "☕",
//           },
//           {
//             id: 3,
//             title: "Best Quality Coffee",
//             description:
//               "Expertly crafted beverages using artisanal brewing methods. Each cup is a perfect balance of aroma, flavor, and quality.",
//             image: construction3,
//             icon: "⭐",
//           },
//           {
//             id: 4,
//             title: "Online Table Booking",
//             description:
//               "Reserve your favorite spot in our cozy coffee shop. Book online and enjoy a seamless dining experience with friends.",
//             image: construction1,
//             icon: "📱",
//           },
//           {
//             id: 5,
//             title: "Coffee Workshops",
//             description:
//               "Learn the art of coffee making from our expert baristas. Master brewing techniques and discover your perfect cup.",
//             image: construction2,
//             icon: "🎓",
//           },
//           {
//             id: 6,
//             title: "Corporate Catering",
//             description:
//               "Elevate your office meetings and events with our premium coffee catering services. Perfect for any corporate occasion.",
//             image: construction3,
//             icon: "🏢",
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-stone-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
//           <p className="text-stone-300 text-lg">Loading services...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-stone-900">
//         {/* Hero Section */}
//         <div
//           className="relative h-96 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: `url(${backgroundImage})`,
//           }}
//         >
//           <div className="absolute inset-0 bg-black/60"></div>
//           <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
//             <div className="flex items-center text-lg space-x-2">
//               <div className="space-y-6">
//                 <div className="space-y-4">
//                   <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold block text-orange-400 leading-tight">
//                     SERVICES
//                   </h1>
//                   <div className="w-20 h-1 bg-orange-500 rounded-full" />
//                 </div>

//                 <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
//                   Professional Construction Services
//                 </p>
//                 <p className="text-gray-300 leading-relaxed max-w-lg">
//                   From residential builds to commercial projects, we deliver
//                   quality craftsmanship and innovative solutions tailored to your
//                   needs.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Decorative wave bottom */}
//           <div className="absolute bottom-0 left-0 right-0">
//             <svg
//               viewBox="0 0 1200 120"
//               preserveAspectRatio="none"
//               className="w-full h-16 fill-[#FBFFF1]"
//             >
//               <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
//             </svg>
//           </div>
//         </div>

//         {/* Services Section */}
//         <div
//           className="py-20 bg-stone-100"
//           style={{ backgroundColor: "#FBFFF1" }}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Section Header */}
//             <div className="text-center mb-16">
//               <div className="w-16 h-px bg-amber-500 mx-auto mb-4"></div>
//               <p className="text-amber-500 uppercase tracking-wide text-sm font-semibold mb-2">
//                 OUR SERVICES
//               </p>
//             </div>

//             {/* Services Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               {services.map((service, index) => (
//                 <div
//                   key={service.id}
//                   className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 group"
//                 >
//                   {/* Service Image */}
//                   <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
//                     <img
//                       src={service.image}
//                       alt={service.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>

//                   {/* Service Content */}
//                   <div className="flex-1 text-center md:text-left">
//                     <div className="flex items-center justify-center md:justify-start mb-3">
//                       <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3">
//                         {service.icon || index + 1}
//                       </div>
//                       <h3 className="text-xl font-bold text-stone-900">
//                         {service.title}
//                       </h3>
//                     </div>
//                     <p className="text-stone-600 leading-relaxed">
//                       {service.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Error Display (if API fails) */}
//         {error && (
//           <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
//             <p className="text-sm">API Error: Using fallback data</p>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Services;
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import construction1 from "../assets/construction1.webp";
import construction2 from "../assets/constrcution2.jpg";
import construction3 from "../assets/constrcution3.jpg";
import heroBg from "../assets/constrcution2.jpg";
import Footer from "../Components/Footer";
import { api } from "../lib/api"; // baseURL = VITE_SERVER_URL/api/v1

const fallbackImages = [construction1, construction2, construction3];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  /* ───────────────── fetch all services ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/services"); // get *all* services
        const list = Array.isArray(data?.data) ? data.data : data;

        // cycle placeholder images for items without an imagePath
        const withImages = list.map((svc, i) => ({
          ...svc,
          _uiImage:
            svc.imageUrl || fallbackImages[i % fallbackImages.length],
        }));

        setServices(withImages);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("API error → showing demo data");

        // demo placeholder
        setServices(
          [
            {
              heading: "Fastest Door Delivery",
              description:
                "Get your materials delivered to site within 24 h anywhere in the city.",
              category: "Logistics",
              tags: ["delivery", "24h"],
              featured: true,
              isActive: true,
            },
            {
              heading: "Site Management",
              description:
                "Dedicated site engineers and project managers monitoring every phase.",
              category: "Management",
              tags: ["on‑site", "project‑control"],
              featured: false,
              isActive: true,
            },
          ].map((s, i) => ({ ...s, _uiImage: fallbackImages[i] }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────────────── helpers ───────────────── */
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* ───────────────── UI ───────────────── */
  if (loading)
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-300 text-lg">Loading services…</p>
        </div>
      </div>
    );

  return (
    <>
      {/* ───────── Hero ───────── */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold text-orange-400">SERVICES</h1>
          <p className="mt-4 max-w-xl text-center">
            Professional construction and engineering solutions for every stage
            of your project.
          </p>
        </div>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-16 fill-[#FBFFF1]"
        >
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* ───────── Services Grid ───────── */}
      <section className="bg-[#FBFFF1] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-semibold tracking-wider">OUR SERVICES</p>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-2" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <article
                key={svc._id ?? svc.heading}
                className="bg-white rounded-lg shadow border border-stone-200 flex flex-col overflow-hidden"
              >
                {/* image */}
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={svc._uiImage}
                    alt={svc.heading}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* content */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <header className="flex items-center gap-2">
                    {svc.featured && (
                      <span className="px-2 py-0.5 text-xs bg-amber-500 text-stone-900 rounded-full font-semibold">
                        FEATURED
                      </span>
                    )}
                    {!svc.isActive && (
                      <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        INACTIVE
                      </span>
                    )}
                  </header>

                  <h3 className="text-xl font-bold text-stone-900">{svc.heading}</h3>
                  <p className="text-stone-600 flex-1">{svc.description}</p>

                  {/* meta */}
                  <div className="text-sm text-stone-500 space-y-1">
                    {svc.category && (
                      <p>
                        <span className="font-medium text-stone-700">Category:</span>{" "}
                        {svc.category}
                      </p>
                    )}
                    {Array.isArray(svc.tags) && svc.tags.length > 0 && (
                      <p className="flex flex-wrap gap-1">
                        {svc.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-full text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-stone-700">Created:</span>{" "}
                      {fmtDate(svc.createdAt || Date.now())}
                    </p>
                    <p>
                      <span className="font-medium text-stone-700">Updated:</span>{" "}
                      {fmtDate(svc.updatedAt || Date.now())}
                    </p>
                  </div>

                  {/* external url */}
                  {svc.externalUrl && (
                    <a
                      href={svc.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      Visit&nbsp;site
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
            {error}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Services;
