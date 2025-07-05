import React, { useState, useEffect } from "react";
import axios from "axios";

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
        axios.get(`${BASE_URL}/api/v1/companyinfo/aboutus`),
        axios.get(`${BASE_URL}/api/v1/companyinfo/contactus`),
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
      const res = await axios.get("${BASE_URL}/api/v1/companyinfo/history");
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

      // Add About Us data
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
      }
      // Add Contact Info data
      else {
        // Inside handleSubmit()
        formData.append("email", companyInfo.contactInfo.email);
        formData.append(
          "emailAppPassword",
          companyInfo.contactInfo.emailAppPassword
        ); // Add this
        companyInfo.contactInfo.phoneNumbers.forEach((num, index) => {
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

      await axios.post("${BASE_URL}/api/v1/companyinfo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

        // Restore About Us if it exists in history
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

        // Restore Contact Info if it exists in history
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

        await axios.post("${BASE_URL}/api/v1/companyinfo", formData);

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
        await axios.delete(`${BASE_URL}/api/v1/companyinfo/history/${id}`);
        fetchHistory();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset image selection when entering edit mode
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
    <div className="w-full h-full bg-stone-900/95 flex backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 gap-15 bg-[#FBFFF1] min-h-screen pt-8 my-10 rounded-md">
        <a href="/admin">
          <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Dashboard
          </button>
        </a>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900">
            Company Information Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              onClick={toggleEditMode}
              className={`py-2 px-4 rounded font-medium ${
                editMode
                  ? "bg-stone-700 hover:bg-stone-800 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-stone-900"
              }`}
            >
              {editMode ? "Cancel Edit" : "Edit Information"}
            </button>
            {/* <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-stone-200 hover:bg-stone-300 text-stone-900 py-2 px-4 rounded font-medium"
          >
            {showHistory ? 'Hide History' : 'View History'}
          </button> */}
          </div>
        </div>

        {showHistory ? (
          <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
            <h2 className="text-xl font-semibold mb-4 text-stone-900">
              Update History
            </h2>
            {history.length === 0 ? (
              <p className="text-stone-500">No history available</p>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="border border-stone-200 p-4 rounded-lg bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-stone-900">
                        Updated on: {new Date(item.updatedAt).toLocaleString()}
                      </h3>
                      <div className="flex gap-2">
                        {/* <button
                        onClick={() => restoreFromHistory(item)}
                        className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-3 py-1 rounded text-sm"
                      >
                        Restore
                      </button> */}
                        <button
                          onClick={() => deleteHistoryItem(item._id)}
                          className="bg-stone-700 hover:bg-stone-800 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.aboutUs && (
                        <div>
                          <h4 className="font-medium text-stone-700 mb-1">
                            About Us
                          </h4>
                          <p className="text-sm text-stone-600">
                            <span className="font-medium">Title:</span>{" "}
                            {item.aboutUs.title}
                          </p>
                          <p className="text-sm text-stone-600">
                            <span className="font-medium">Mission:</span>{" "}
                            {item.aboutUs.mission.substring(0, 50)}...
                          </p>
                        </div>
                      )}
                      {item.contactInfo && (
                        <div>
                          <h4 className="font-medium text-stone-700 mb-1">
                            Contact Info
                          </h4>
                          <p className="text-sm text-stone-600">
                            <span className="font-medium">Email:</span>{" "}
                            {item.contactInfo.email}
                          </p>
                          <p className="text-sm text-stone-600">
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
            <div className="flex border-b border-stone-200 mb-6">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "about"
                    ? "border-b-2 border-amber-500 text-amber-600"
                    : "text-stone-500"
                }`}
                onClick={() => setActiveTab("about")}
              >
                About Us
              </button>
              <button
                className={`py-2 px-4 font-medium ${
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
                className="bg-white p-6 rounded-lg shadow-md border border-stone-200"
              >
                {activeTab === "about" ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-stone-900">
                      Edit About Us Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={companyInfo.aboutUs.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Mission
                          </label>
                          <textarea
                            name="mission"
                            value={companyInfo.aboutUs.mission}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            rows="4"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Vision
                          </label>
                          <textarea
                            name="vision"
                            value={companyInfo.aboutUs.vision}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            rows="4"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Company Image
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            accept="image/*"
                          />
                          {previewImage && (
                            <div className="mt-4">
                              <img
                                src={previewImage}
                                alt="Company preview"
                                className="max-w-full h-auto rounded border border-stone-200"
                              />
                              <p className="text-sm text-stone-500 mt-1">
                                Current/New Image
                              </p>
                            </div>
                          )}
                        </div>

                        <h3 className="font-medium text-stone-700 mb-2">
                          Location Information
                        </h3>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            name="location.address"
                            value={companyInfo.aboutUs.location.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-stone-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="location.city"
                              value={companyInfo.aboutUs.location.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="location.country"
                              value={companyInfo.aboutUs.location.country}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Timezone
                          </label>
                          <input
                            type="text"
                            name="location.timezone"
                            value={companyInfo.aboutUs.location.timezone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="e.g., UTC+5:30"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-stone-900">
                      Edit Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={companyInfo.contactInfo.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Email App Password
                            <span className="text-xs text-stone-500 ml-1">
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
                            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Enter your email app password"
                          />
                          <p className="text-xs text-stone-500 mt-1">
                            Note: This is required for the contact form to send
                            emails. If you change your email, update this
                            password as well.
                          </p>
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
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
                                  className="flex-1 px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                {companyInfo.contactInfo.phoneNumbers.length >
                                  1 && (
                                  <button
                                    type="button"
                                    onClick={() => removePhoneNumber(index)}
                                    className="bg-stone-700 hover:bg-stone-800 text-white px-3 rounded"
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
                              className="text-amber-600 hover:text-amber-700 text-sm"
                            >
                              + Add another phone number
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-stone-700 mb-2">
                          Available Hours
                        </h3>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Weekdays
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              name="availableHours.weekdays.from"
                              value={
                                companyInfo.contactInfo.availableHours.weekdays
                                  .from
                              }
                              onChange={handleInputChange}
                              className="px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <span className="text-stone-700">to</span>
                            <input
                              type="time"
                              name="availableHours.weekdays.to"
                              value={
                                companyInfo.contactInfo.availableHours.weekdays
                                  .to
                              }
                              onChange={handleInputChange}
                              className="px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-stone-700 mb-2">
                            Weekends
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              name="availableHours.weekends.from"
                              value={
                                companyInfo.contactInfo.availableHours.weekends
                                  .from || ""
                              }
                              onChange={handleInputChange}
                              className="px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <span className="text-stone-700">to</span>
                            <input
                              type="time"
                              name="availableHours.weekends.to"
                              value={
                                companyInfo.contactInfo.availableHours.weekends
                                  .to || ""
                              }
                              onChange={handleInputChange}
                              className="px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-4 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
                {activeTab === "about" ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-stone-900">
                      About Us
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-stone-900">
                          {companyInfo.aboutUs.title}
                        </h3>

                        <div className="mb-4">
                          <h4 className="font-medium text-stone-700 mb-1">
                            Mission
                          </h4>
                          <p className="text-stone-600">
                            {companyInfo.aboutUs.mission}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-stone-700 mb-1">
                            Vision
                          </h4>
                          <p className="text-stone-600">
                            {companyInfo.aboutUs.vision}
                          </p>
                        </div>
                      </div>

                      <div>
                        {companyInfo.aboutUs.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={`${BASE_URL}${companyInfo.aboutUs.imageUrl}`}
                              alt="Company"
                              className="max-w-full h-auto rounded border border-stone-200"
                            />
                          </div>
                        )}

                        <h3 className="font-medium text-stone-700 mb-2">
                          Location
                        </h3>

                        <div className="space-y-1">
                          <p className="text-stone-600">
                            {companyInfo.aboutUs.location.address}
                          </p>
                          <p className="text-stone-600">
                            {companyInfo.aboutUs.location.city},{" "}
                            {companyInfo.aboutUs.location.country}
                          </p>
                          <p className="text-stone-600">
                            Timezone: {companyInfo.aboutUs.location.timezone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-stone-900">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <h3 className="font-medium text-stone-700 mb-1">
                            Email
                          </h3>
                          <p className="text-stone-600">
                            {companyInfo.contactInfo.email}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium text-stone-700 mb-1">
                            Phone Numbers
                          </h3>
                          <ul className="list-disc list-inside text-stone-600">
                            {companyInfo.contactInfo.phoneNumbers.map(
                              (number, index) => (
                                <li key={index}>{number}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-stone-700 mb-2">
                          Available Hours
                        </h3>

                        <div className="mb-4">
                          <h4 className="font-medium text-stone-700 mb-1">
                            Weekdays
                          </h4>
                          <p className="text-stone-600">
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
                          <div className="mb-4">
                            <h4 className="font-medium text-stone-700 mb-1">
                              Weekends
                            </h4>
                            <p className="text-stone-600">
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
