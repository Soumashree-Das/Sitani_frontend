// import React, { useState, useEffect } from "react";
// import { Phone, Mail, Clock, AlertCircle } from "lucide-react";
// import backgroundImage from "../assets/constrcution2.jpg";
// // import { configDotenv } from "dotenv";

// // configDotenv();
// const BASE_URL = import.meta.env.VITE_SERVER_URL ?? "";
// const ContactUs = () => {
  

//   const [contactInfo, setContactInfo] = useState({
//     email: "",
//     phoneNumbers: [],
//     availableHours: {
//       weekdays: { from: "09:00", to: "17:00" },
//       weekends: { from: "", to: "" },
//     },
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch contact info (unchanged)
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const contactResponse = await fetch(
//           `${BASE_URL}/api/v1/companyInfo/contactus`,
//           // `${BASE_URL}/api/v1/companyInfo/contactus`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!contactResponse.ok) {
//           throw new Error(
//             `Contact info fetch failed! status: ${contactResponse.status}`
//           );
//         }

//         const contactResult = await contactResponse.json();

//         if (contactResult.success) {
//           setContactInfo((prev) => ({
//             ...prev,
//             email: contactResult.data.email || "",
//             phoneNumbers: contactResult.data.phoneNumbers || [],
//             availableHours: contactResult.data.availableHours || {
//               weekdays: { from: "09:00", to: "17:00" },
//               weekends: { from: "", to: "" },
//             },
//           }));
//         } else {
//           throw new Error(
//             contactResult.message || "Failed to fetch contact info"
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching contact info:", error);
//         setError("Failed to load contact information. Please try again later.");
//         setContactInfo({
//           email: "",
//           phoneNumbers: [],
//           availableHours: {
//             weekdays: { from: "09:00", to: "17:00" },
//             weekends: { from: "", to: "" },
//           },
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.subject ||
//       !formData.message
//     ) {
//       setSubmitStatus("error");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setSubmitStatus("error");
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     try {
//       const response = await fetch(`${BASE_URL}/api/v1/contact-us/contact`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to send message");
//       }

//       if (result.success) {
//         setSubmitStatus("success");
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           subject: "",
//           message: "",
//         });
//       } else {
//         throw new Error(result.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const formatHours = (hours) => {
//     if (!hours || !hours.from || !hours.to) return "Closed";
//     return `${hours.from} - ${hours.to}`;
//   };

//   return (
//     <div className="min-h-screen mt-12" style={{ backgroundColor: "#FBFFF1" }}>
//       {/* <div
//         className="bg-stone-900 text-white py-16 px-4 relative bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//         }}
//       >
        
//         <div className="max-w-6xl mx-auto text-center"><div className="absolute inset-0 bg-stone-900/80"></div>
//           <span className="text-stone-400">Home</span>
//           <span className="text-stone-400 mx-2">/</span>
//           <span className="text-amber-400">Contact</span>

//           <h1 className="text-4xl md:text-5xl font-bold">CONTACT</h1>
//         </div>
//       </div> */}
//       <div
//         className="bg-stone-900 text-white py-16 px-4 relative bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//         }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-stone-900/80 z-0"></div>

//         {/* Content */}
//         <div className="relative z-10 max-w-6xl mx-auto text-center">
//           <span className="text-stone-400">Home</span>
//           <span className="text-stone-400 mx-2">/</span>
//           <span className="text-amber-400">Contact</span>

//           <h1 className="text-4xl md:text-5xl font-bold mt-4">CONTACT</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-16">
//         <div className="text-center mb-12">
//           <p className="text-amber-500 font-semibold mb-2 tracking-wide">
//             CONTACT US
//           </p>
//           <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">
//             Feel Free To Contact
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Contact Information (unchanged) */}
//           <div className="space-y-8">
//             {isLoading && (
//               <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
//                 <AlertCircle className="w-5 h-5 mr-2" />
//                 {error}
//               </div>
//             )}

//             {!isLoading && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-stone-200">
//                     <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Phone className="w-6 h-6 text-stone-900" />
//                     </div>
//                     <h3 className="font-semibold text-stone-900 mb-2">Phone</h3>
//                     <div className="text-stone-600 text-sm space-y-1">
//                       {contactInfo.phoneNumbers &&
//                       contactInfo.phoneNumbers.length > 0 ? (
//                         contactInfo.phoneNumbers.map((phone, index) => (
//                           <p key={index}>{phone}</p>
//                         ))
//                       ) : (
//                         <p className="text-stone-400">
//                           No phone numbers available
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-stone-200">
//                     <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Mail className="w-6 h-6 text-stone-900" />
//                     </div>
//                     <h3 className="font-semibold text-stone-900 mb-2">Email</h3>
//                     <p className="text-stone-600 text-sm">
//                       {contactInfo.email || "No email available"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
//                   <div className="flex items-center mb-4">
//                     <Clock className="w-6 h-6 text-amber-500 mr-3" />
//                     <h3 className="font-semibold text-stone-900">
//                       Business Hours
//                     </h3>
//                   </div>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-stone-600">Weekdays:</span>
//                       <span className="text-stone-900 font-medium">
//                         {formatHours(contactInfo.availableHours?.weekdays)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-stone-600">Weekends:</span>
//                       <span className="text-stone-900 font-medium">
//                         {formatHours(contactInfo.availableHours?.weekends)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Contact Form with added phone field */}
//           <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Your Name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Your Email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Added phone number field */}
//               <div>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Your Phone Number"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                 />
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   name="subject"
//                   placeholder="Subject"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                   required
//                 />
//               </div>

//               <div>
//                 <textarea
//                   name="message"
//                   placeholder="Message"
//                   rows="6"
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
//                   required
//                 ></textarea>
//               </div>

//               {submitStatus === "success" && (
//                 <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
//                   Your message has been sent successfully!
//                 </div>
//               )}

//               {submitStatus === "error" && (
//                 <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
//                   {!formData.email
//                     ? "Please fill in all required fields with valid information"
//                     : "Failed to send message. Please try again later."}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={
//                   isSubmitting ||
//                   !formData.name ||
//                   !formData.email ||
//                   !formData.subject ||
//                   !formData.message
//                 }
//                 className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Sending...
//                   </span>
//                 ) : (
//                   <div className="flex items-center">
//                     <Mail className="w-5 h-5 mr-2" />
//                     Send Message
//                   </div>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
import React, { useState, useEffect } from "react";
import { Phone, Mail, Clock, AlertCircle } from "lucide-react";
import backgroundImage from "../assets/constrcution2.jpg";

// ✅ Browser‑safe env var (Vite style)
const BASE_URL = import.meta.env.VITE_SERVER_URL ?? "";

const ContactUs = () => {
  /* ──────── state ──────── */
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phoneNumbers: [],
    availableHours: {
      weekdays: { from: "09:00", to: "17:00" },
      weekends: { from: "", to: "" },
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error" | null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ──────── helpers ──────── */
  const formatHours = (hours) => {
    if (!hours?.from || !hours?.to) return "Closed";
    return `${hours.from} – ${hours.to}`;
  };

  /* ──────── side‑effects ──────── */
  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!BASE_URL) {
        console.error("⚠️  VITE_SERVER_URL is missing in your .env");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/api/v1/companyInfo/contactus`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status}`);
        }

        const { success, data, message } = await res.json();

        if (!success) throw new Error(message);

        setContactInfo({
          email: data.email || "",
          phoneNumbers: data.phoneNumbers || [],
          availableHours: data.availableHours || {
            weekdays: { from: "09:00", to: "17:00" },
            weekends: { from: "", to: "" },
          },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load contact information. Please try again later.");
        setContactInfo({
          email: "",
          phoneNumbers: [],
          availableHours: {
            weekdays: { from: "09:00", to: "17:00" },
            weekends: { from: "", to: "" },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []); // runs once on mount

  /* ──────── handlers ──────── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // naïve validation
    const required = ["name", "email", "subject", "message"];
    if (required.some((k) => !formData[k])) {
      setSubmitStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/contact-us/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { success, message } = await res.json();
      if (!res.ok || !success) throw new Error(message);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ──────── render ──────── */
  return (
    <div className="min-h-screen mt-12" style={{ backgroundColor: "#FBFFF1" }}>
      {/* hero banner */}
      <div
        className="bg-stone-900 text-white py-16 px-4 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-stone-900/80" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-stone-400">Home</span>
          <span className="mx-2 text-stone-400">/</span>
          <span className="text-amber-400">Contact</span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">CONTACT</h1>
        </div>
      </div>

      {/* body */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <p className="mb-2 font-semibold tracking-wide text-amber-500">
            CONTACT US
          </p>
          <h2 className="mb-8 text-3xl font-bold text-stone-900 md:text-4xl">
            Feel Free To Contact
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── left column: contact info ── */}
          <div className="space-y-8">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500" />
              </div>
            )}

            {error && (
              <div className="flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            )}

            {!isLoading && (
              <>
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  {/* phone card */}
                  <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                      <Phone className="h-6 w-6 text-stone-900" />
                    </div>
                    <h3 className="mb-2 font-semibold text-stone-900">Phone</h3>
                    <div className="space-y-1 text-sm text-stone-600">
                      {contactInfo.phoneNumbers.length ? (
                        contactInfo.phoneNumbers.map((p) => (
                          <p key={p}>{p}</p>
                        ))
                      ) : (
                        <p className="text-stone-400">No phone numbers</p>
                      )}
                    </div>
                  </div>

                  {/* email card */}
                  <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                      <Mail className="h-6 w-6 text-stone-900" />
                    </div>
                    <h3 className="mb-2 font-semibold text-stone-900">Email</h3>
                    <p className="text-sm text-stone-600">
                      {contactInfo.email || "No email available"}
                    </p>
                  </div>
                </div>

                {/* hours */}
                <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center">
                    <Clock className="mr-3 h-6 w-6 text-amber-500" />
                    <h3 className="font-semibold text-stone-900">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Weekdays:</span>
                      <span className="font-medium text-stone-900">
                        {formatHours(contactInfo.availableHours.weekdays)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Weekends:</span>
                      <span className="font-medium text-stone-900">
                        {formatHours(contactInfo.availableHours.weekends)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── right column: form ── */}
          <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />

              <input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
                required
              />

              <textarea
                name="message"
                placeholder="Message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full resize-none rounded-lg border border-stone-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
                required
              />

              {/* status banners */}
              {submitStatus === "success" && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                  Your message has been sent successfully!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                  Please fill in all required fields with valid information —or
                  try again later.
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.email ||
                  !formData.subject ||
                  !formData.message
                }
                className="flex w-full items-center justify-center rounded-lg bg-amber-500 py-3 font-semibold text-stone-900 transition-all duration-200 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
