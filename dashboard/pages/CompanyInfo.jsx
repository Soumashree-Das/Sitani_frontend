import React, { useState, useEffect } from "react";
import { api } from "../../src/lib/api.js"; // adjust path if needed

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const CompanyInfoDashboard = () => {
  const [companyInfo, setCompanyInfo] = useState({
    aboutUs: {
      mission: "",
      vision: "",
      title: "",
      location: {
        address: "",
        city: "",
        country: "",
        timezone: "",
      },
      imageUrl: "",
    },
    contactInfo: {
      email: "",
      emailAppPassword: "",
      phoneNumbers: [""],
      availableHours: {
        weekdays: { from: "09:00", to: "17:00" },
        weekends: { from: "", to: "" },
      },
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCompanyInfo();
    fetchHistory();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const [aboutRes, contactRes] = await Promise.all([
        api.get("/companyinfo/aboutus"),
        api.get("/companyinfo/contactus"),
      ]);

      setCompanyInfo({
        aboutUs: aboutRes.data.data || {
          mission: "",
          vision: "",
          title: "",
          location: {
            address: "",
            city: "",
            country: "",
            timezone: "",
          },
          imageUrl: "",
        },
        contactInfo: contactRes.data.data || {
          email: "",
          emailAppPassword: "",
          phoneNumbers: [""],
          availableHours: {
            weekdays: { from: "09:00", to: "17:00" },
            weekends: { from: "", to: "" },
          },
        },
      });

      if (aboutRes.data.data?.imageUrl) {
        setPreviewImage(`${BASE_URL}${aboutRes.data.data.imageUrl}`);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/companyinfo/history");
      setHistory(res.data.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (activeTab === "about") {
      if (name.includes("location.")) {
        const field = name.split(".")[1];
        setCompanyInfo((prev) => ({
          ...prev,
          aboutUs: {
            ...prev.aboutUs,
            location: {
              ...prev.aboutUs.location,
              [field]: value,
            },
          },
        }));
      } else {
        setCompanyInfo((prev) => ({
          ...prev,
          aboutUs: {
            ...prev.aboutUs,
            [name]: value,
          },
        }));
      }
    } else {
      if (name.includes("availableHours.")) {
        const [period, timeType] = name.split(".").slice(1);
        setCompanyInfo((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            availableHours: {
              ...prev.contactInfo.availableHours,
              [period]: {
                ...prev.contactInfo.availableHours[period],
                [timeType]: value,
              },
            },
          },
        }));
      } else if (name.startsWith("phoneNumbers[")) {
        const index = parseInt(name.match(/\[(\d+)\]/)[1]);
        const newPhoneNumbers = [...companyInfo.contactInfo.phoneNumbers];
        newPhoneNumbers[index] = value;

        setCompanyInfo((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            phoneNumbers: newPhoneNumbers,
          },
        }));
      } else {
        setCompanyInfo((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [name]: value,
          },
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const addPhoneNumber = () => {
    if (companyInfo.contactInfo.phoneNumbers.length < 3) {
      setCompanyInfo((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          phoneNumbers: [...prev.contactInfo.phoneNumbers, ""],
        },
      }));
    }
  };

  const removePhoneNumber = (index) => {
    if (companyInfo.contactInfo.phoneNumbers.length > 1) {
      const newPhoneNumbers = companyInfo.contactInfo.phoneNumbers.filter(
        (_, i) => i !== index
      );
      setCompanyInfo((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          phoneNumbers: newPhoneNumbers,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (activeTab === "about") {
        formData.append("mission", companyInfo.aboutUs.mission);
        formData.append("vision", companyInfo.aboutUs.vision);
        formData.append("title", companyInfo.aboutUs.title);
        formData.append("address", companyInfo.aboutUs.location.address);
        formData.append("city", companyInfo.aboutUs.location.city);
        formData.append("country", companyInfo.aboutUs.location.country);
        formData.append("timezone", companyInfo.aboutUs.location.timezone);
        if (imageFile) {
          formData.append("image", imageFile);
        }
      } else {
        formData.append("email", companyInfo.contactInfo.email);
        formData.append(
          "emailAppPassword",
          companyInfo.contactInfo.emailAppPassword
        );
        companyInfo.contactInfo.phoneNumbers.forEach((num) => {
          formData.append("phoneNumbers", num);
        });
        formData.append(
          "weekdayFrom",
          companyInfo.contactInfo.availableHours.weekdays.from
        );
        formData.append(
          "weekdayTo",
          companyInfo.contactInfo.availableHours.weekdays.to
        );
        formData.append(
          "weekendFrom",
          companyInfo.contactInfo.availableHours.weekends.from
        );
        formData.append(
          "weekendTo",
          companyInfo.contactInfo.availableHours.weekends.to
        );
      }

      await api.post("/companyinfo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchCompanyInfo();
      fetchHistory();
      setImageFile(null);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const restoreFromHistory = async (historyItem) => {
    if (window.confirm("Are you sure you want to restore this version?")) {
      try {
        const formData = new FormData();

        if (historyItem.aboutUs) {
          formData.append("mission", historyItem.aboutUs.mission);
          formData.append("vision", historyItem.aboutUs.vision);
          formData.append("title", historyItem.aboutUs.title);
          formData.append(
            "address",
            historyItem.aboutUs.location?.address || ""
          );
          formData.append("city", historyItem.aboutUs.location?.city || "");
          formData.append(
            "country",
            historyItem.aboutUs.location?.country || ""
          );
          formData.append(
            "timezone",
            historyItem.aboutUs.location?.timezone || ""
          );
        }

        if (historyItem.contactInfo) {
          formData.append("email", historyItem.contactInfo.email || "");
          (historyItem.contactInfo.phoneNumbers || [""]).forEach((num) => {
            formData.append("phoneNumbers", num);
          });
          formData.append(
            "weekdayFrom",
            historyItem.contactInfo.availableHours?.weekdays?.from || "09:00"
          );
          formData.append(
            "weekdayTo",
            historyItem.contactInfo.availableHours?.weekdays?.to || "17:00"
          );
          formData.append(
            "weekendFrom",
            historyItem.contactInfo.availableHours?.weekends?.from || ""
          );
          formData.append(
            "weekendTo",
            historyItem.contactInfo.availableHours?.weekends?.to || ""
          );
        }

        await api.post("/companyinfo", formData);

        fetchCompanyInfo();
        fetchHistory();
        setShowHistory(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const deleteHistoryItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      try {
        await api.delete(`/companyinfo/history/${id}`);
        fetchHistory();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setImageFile(null);
      if (companyInfo.aboutUs.imageUrl) {
        setPreviewImage(`${BASE_URL}${companyInfo.aboutUs.imageUrl}`);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-stone-900">
        Loading company information...
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  
  return (
  <div className="w-full min-h-screen bg-[#FBFFF1] flex backdrop-blur-sm mt-16">
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-[#FBFFF1] min-h-screen my-2 sm:my-4 lg:my-10 rounded-md">
      {/* Dashboard Button */}
      <div className="mb-4 sm:mb-6">
        <a href="/admin">
          <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 text-sm sm:text-base">
            Dashboard
          </button>
        </a>
      </div>

      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">
          Company Information Dashboard
        </h1>

        {/* Note Section */}
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 sm:p-4 rounded-lg max-w-full sm:max-w-md lg:max-w-lg">
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Note:</strong> Always re-upload the{" "}
            <strong>App Password</strong> whenever contact info is updated —
            even if the email stays the same. After any update, test the contact
            form using a personal email. If emails don't send, upload the{" "}
            <strong>App Password</strong> again.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
        <button
          onClick={toggleEditMode}
          className={`w-full sm:w-auto py-2 px-4 rounded font-medium text-sm sm:text-base transition-colors ${
            editMode
              ? "bg-stone-700 hover:bg-stone-800 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-stone-900"
          }`}
        >
          {editMode ? "Cancel Edit" : "Edit Information"}
        </button>
        {/* Uncommented if needed
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full sm:w-auto bg-stone-200 hover:bg-stone-300 text-stone-900 py-2 px-4 rounded font-medium text-sm sm:text-base"
        >
          {showHistory ? 'Hide History' : 'View History'}
        </button> */}
      </div>

      {showHistory ? (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-stone-200">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-stone-900">
            Update History
          </h2>
          {history.length === 0 ? (
            <p className="text-stone-500 text-sm sm:text-base">No history available</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="border border-stone-200 p-3 sm:p-4 rounded-lg bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h3 className="font-medium text-stone-900 text-sm sm:text-base">
                      Updated on: {new Date(item.updatedAt).toLocaleString()}
                    </h3>
                    <div className="flex gap-2">
                      {/* Uncommented if needed
                      <button
                        onClick={() => restoreFromHistory(item)}
                        className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Restore
                      </button> */}
                      <button
                        onClick={() => deleteHistoryItem(item._id)}
                        className="bg-stone-700 hover:bg-stone-800 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {item.aboutUs && (
                      <div>
                        <h4 className="font-medium text-stone-700 mb-1 text-sm sm:text-base">
                          About Us
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600">
                          <span className="font-medium">Title:</span>{" "}
                          {item.aboutUs.title}
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600">
                          <span className="font-medium">Mission:</span>{" "}
                          {item.aboutUs.mission.substring(0, 50)}...
                        </p>
                      </div>
                    )}
                    {item.contactInfo && (
                      <div>
                        <h4 className="font-medium text-stone-700 mb-1 text-sm sm:text-base">
                          Contact Info
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600">
                          <span className="font-medium">Email:</span>{" "}
                          {item.contactInfo.email}
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600">
                          <span className="font-medium">Phone:</span>{" "}
                          {item.contactInfo.phoneNumbers?.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 mb-6 overflow-x-auto">
            <button
              className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "about"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-stone-500"
              }`}
              onClick={() => setActiveTab("about")}
            >
              About Us
            </button>
            <button
              className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "contact"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-stone-500"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Information
            </button>
          </div>

          {editMode ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-stone-200"
            >
              {activeTab === "about" ? (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-stone-900">
                    Edit About Us Information
                  </h2>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={companyInfo.aboutUs.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Mission
                        </label>
                        <textarea
                          name="mission"
                          value={companyInfo.aboutUs.mission}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                          rows="4"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Vision
                        </label>
                        <textarea
                          name="vision"
                          value={companyInfo.aboutUs.vision}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                          rows="4"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Company Image
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          accept="image/*"
                        />
                        {previewImage && (
                          <div className="mt-4">
                            <img
                              src={previewImage}
                              alt="Company preview"
                              className="w-full max-w-sm h-auto rounded border border-stone-200"
                            />
                            <p className="text-xs sm:text-sm text-stone-500 mt-1">
                              Current/New Image
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-stone-700 mb-3 text-sm sm:text-base">
                          Location Information
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-stone-700 mb-1 text-xs sm:text-sm">
                              Address
                            </label>
                            <input
                              type="text"
                              name="location.address"
                              value={companyInfo.aboutUs.location.address}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-stone-700 mb-1 text-xs sm:text-sm">
                                City
                              </label>
                              <input
                                type="text"
                                name="location.city"
                                value={companyInfo.aboutUs.location.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 mb-1 text-xs sm:text-sm">
                                Country
                              </label>
                              <input
                                type="text"
                                name="location.country"
                                value={companyInfo.aboutUs.location.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-700 mb-1 text-xs sm:text-sm">
                              Timezone
                            </label>
                            <input
                              type="text"
                              name="location.timezone"
                              value={companyInfo.aboutUs.location.timezone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="e.g., UTC+5:30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-stone-900">
                    Edit Contact Information
                  </h2>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={companyInfo.contactInfo.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Email App Password
                          <span className="text-xs text-stone-500 ml-1 block sm:inline">
                            (Required for sending official emails)
                          </span>
                        </label>
                        <input
                          type="password"
                          name="emailAppPassword"
                          value={
                            companyInfo.contactInfo.emailAppPassword || ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter your email app password"
                        />
                        <p className="text-xs text-stone-500 mt-1">
                          Note: This is required for the contact form to send
                          emails. If you change your email, update this
                          password as well.
                        </p>
                      </div>

                      <div>
                        <label className="block text-stone-700 mb-2 text-sm sm:text-base font-medium">
                          Phone Numbers
                        </label>
                        {companyInfo.contactInfo.phoneNumbers.map(
                          (number, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="tel"
                                name={`phoneNumbers[${index}]`}
                                value={number}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 text-sm sm:text-base border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              />
                              {companyInfo.contactInfo.phoneNumbers.length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() => removePhoneNumber(index)}
                                  className="bg-stone-700 hover:bg-stone-800 text-white px-3 rounded text-sm sm:text-base"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )
                        )}
                        {companyInfo.contactInfo.phoneNumbers.length < 3 && (
                          <button
                            type="button"
                            onClick={addPhoneNumber}
                            className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm"
                          >
                            + Add another phone number
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-stone-700 text-sm sm:text-base">
                        Available Hours
                      </h3>

                      <div>
                        <label className="block text-stone-700 mb-2 text-xs sm:text-sm">
                          Weekdays
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <input
                            type="time"
                            name="availableHours.weekdays.from"
                            value={
                              companyInfo.contactInfo.availableHours.weekdays
                                .from
                            }
                            onChange={handleInputChange}
                            className="w-full sm:w-auto px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                          <span className="text-stone-700 text-xs sm:text-sm">to</span>
                          <input
                            type="time"
                            name="availableHours.weekdays.to"
                            value={
                              companyInfo.contactInfo.availableHours.weekdays
                                .to
                            }
                            onChange={handleInputChange}
                            className="w-full sm:w-auto px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-700 mb-2 text-xs sm:text-sm">
                          Weekends
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <input
                            type="time"
                            name="availableHours.weekends.from"
                            value={
                              companyInfo.contactInfo.availableHours.weekends
                                .from || ""
                            }
                            onChange={handleInputChange}
                            className="w-full sm:w-auto px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                          <span className="text-stone-700 text-xs sm:text-sm">to</span>
                          <input
                            type="time"
                            name="availableHours.weekends.to"
                            value={
                              companyInfo.contactInfo.availableHours.weekends
                                .to || ""
                            }
                            onChange={handleInputChange}
                            className="w-full sm:w-auto px-3 py-2 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-4 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-stone-200">
              {activeTab === "about" ? (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-stone-900">
                    About Us
                  </h2>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-medium text-stone-900">
                        {companyInfo.aboutUs.title}
                      </h3>

                      <div>
                        <h4 className="font-medium text-stone-700 mb-2 text-sm sm:text-base">
                          Mission
                        </h4>
                        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                          {companyInfo.aboutUs.mission}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-stone-700 mb-2 text-sm sm:text-base">
                          Vision
                        </h4>
                        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                          {companyInfo.aboutUs.vision}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {companyInfo.aboutUs.imageUrl && (
                        <div>
                          <img
                            src={`${BASE_URL}${companyInfo.aboutUs.imageUrl}`}
                            alt="Company"
                            className="w-full max-w-sm h-auto rounded border border-stone-200"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium text-stone-700 mb-2 text-sm sm:text-base">
                          Location
                        </h3>

                        <div className="space-y-1">
                          <p className="text-stone-600 text-sm sm:text-base">
                            {companyInfo.aboutUs.location.address}
                          </p>
                          <p className="text-stone-600 text-sm sm:text-base">
                            {companyInfo.aboutUs.location.city},{" "}
                            {companyInfo.aboutUs.location.country}
                          </p>
                          <p className="text-stone-600 text-sm sm:text-base">
                            Timezone: {companyInfo.aboutUs.location.timezone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-stone-900">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-stone-700 mb-2 text-sm sm:text-base">
                          Email
                        </h3>
                        <p className="text-stone-600 text-sm sm:text-base break-all">
                          {companyInfo.contactInfo.email}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium text-stone-700 mb-2 text-sm sm:text-base">
                          Phone Numbers
                        </h3>
                        <ul className="list-disc list-inside text-stone-600 space-y-1">
                          {companyInfo.contactInfo.phoneNumbers.map(
                            (number, index) => (
                              <li key={index} className="text-sm sm:text-base">
                                {number}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-stone-700 text-sm sm:text-base">
                        Available Hours
                      </h3>

                      <div>
                        <h4 className="font-medium text-stone-700 mb-1 text-xs sm:text-sm">
                          Weekdays
                        </h4>
                        <p className="text-stone-600 text-sm sm:text-base">
                          {
                            companyInfo.contactInfo.availableHours.weekdays
                              .from
                          }{" "}
                          -{" "}
                          {companyInfo.contactInfo.availableHours.weekdays.to}
                        </p>
                      </div>

                      {companyInfo.contactInfo.availableHours.weekends
                        .from && (
                        <div>
                          <h4 className="font-medium text-stone-700 mb-1 text-xs sm:text-sm">
                            Weekends
                          </h4>
                          <p className="text-stone-600 text-sm sm:text-base">
                            {
                              companyInfo.contactInfo.availableHours.weekends
                                .from
                            }{" "}
                            -{" "}
                            {
                              companyInfo.contactInfo.availableHours.weekends
                                .to
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default CompanyInfoDashboard;
