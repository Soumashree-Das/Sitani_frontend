import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Plus, Edit, Trash2 } from "lucide-react";
import { api } from "../../src/lib/api.js"; // adjust path if needed

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const AnnouncementsDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    priority: 0, // Changed to number to match backend
    isActive: true,
  });
  const [error, setError] = useState(null);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get(
          `/announcements/get`
        );
        setAnnouncements(response.data.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Failed to load announcements");
      }
    };
    fetchAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Prepare payload matching backend schema
      const payload = {
        title: formData.title,
        content: formData.content,
        publishDate: new Date(formData.publishDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        priority: Number(formData.priority), // Ensure number type
        isActive: formData.isActive,
      };

      let response;
      if (currentAnnouncement) {
        // Update existing announcement
        response = await api.put(
          `/announcements/update/${currentAnnouncement._id}`,
          payload
        );
      } else {
        // Create new announcement
        response = await api.post(
          "/announcements/create",
          payload
        );
      }

      // Refresh announcements and close modal
      const updatedResponse = await api.get(
        "/announcements/get"
      );
      setAnnouncements(updatedResponse.data.data);
      setIsModalOpen(false);
      setCurrentAnnouncement(null);
      setFormData({
        title: "",
        content: "",
        publishDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
        priority: 0,
        isActive: true,
      });
    } catch (error) {
      console.error("Error saving announcement:", error);
      setError(
        error.response?.data?.error || 
        error.message || 
        "Failed to save announcement"
      );
    }
  };

  const handleEdit = (announcement) => {
    setCurrentAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      publishDate: announcement.publishDate 
        ? new Date(announcement.publishDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      expiryDate: announcement.expiryDate
        ? new Date(announcement.expiryDate).toISOString().split("T")[0]
        : "",
      priority: announcement.priority || 0,
      isActive: announcement.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await api.delete(
          `/announcements/delete/${id}`
        );
        const response = await api.get(
          "/announcements/get"
        );
        setAnnouncements(response.data.data);
      } catch (error) {
        console.error("Error deleting announcement:", error);
        setError("Failed to delete announcement");
      }
    }
  };

  // Priority options mapping
  const priorityOptions = [
    { value: 0, label: "Low" },
    { value: 1, label: "Medium" },
    { value: 2, label: "High" }
  ];

  // return (
  //   <div className="w-full h-full bg-stone-900/95 flex backdrop-blur-sm">
  //     <div className="container mx-auto px-4 py-8 my-20 bg-[#FBFFF1] min-h-screen rounded-md">
  //       {/* Error message display */}
  //       {error && (
  //         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
  //           {error}
  //         </div>
  //       )}

  //       <a href="/admin">
  //         <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
  //           Dashboard
  //         </button>
  //       </a>

  //       <div className="mb-12">
  //         <div className="flex justify-between items-center mb-6">
  //           <h1 className="text-3xl font-bold text-stone-900">Announcements</h1>
  //           <button
  //             onClick={() => setIsModalOpen(true)}
  //             className="bg-amber-500 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600"
  //           >
  //             <Plus size={20} />
  //             Add Announcement
  //           </button>
  //         </div>

  //         <div className="grid gap-4">
  //           {announcements.map((announcement) => (
  //             <div key={announcement._id} className="border border-stone-700 rounded-lg p-4 bg-[#FBFFF1] shadow">
  //               <div className="flex justify-between items-start">
  //                 <div className="flex-1">
  //                   <div className="flex items-center gap-2 mb-2">
  //                     <h3 className="text-xl font-semibold text-stone-900">{announcement.title}</h3>
  //                     {announcement.isActive ? (
  //                       <Eye className="text-green-500" size={16} />
  //                     ) : (
  //                       <EyeOff className="text-gray-400" size={16} />
  //                     )}
  //                   </div>
  //                   <p className="text-stone-700 mb-2">{announcement.content}</p>
  //                   <div className="text-sm text-stone-600 space-y-1">
  //                     <div className="flex items-center">
  //                       <span className="font-medium min-w-[100px]">Priority:</span>
  //                       <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
  //                         announcement.priority === 2 ? 'bg-red-100 text-red-800' :
  //                         announcement.priority === 1 ? 'bg-amber-100 text-amber-800' :
  //                         'bg-stone-100 text-stone-800'
  //                       }`}>
  //                         {priorityOptions.find(opt => opt.value === announcement.priority)?.label || 'Unknown'}
  //                       </span>
  //                     </div>
  //                     <p>Publish: <span className="font-semibold">
  //                       {new Date(announcement.publishDate).toLocaleDateString()}
  //                     </span></p>
  //                     {announcement.expiryDate && (
  //                       <p>Expiry: <span className="font-semibold">
  //                         {new Date(announcement.expiryDate).toLocaleDateString()}
  //                       </span></p>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div className="flex gap-2">
  //                   <button
  //                     onClick={() => handleEdit(announcement)}
  //                     className="text-amber-500 hover:bg-stone-200 p-2 rounded"
  //                   >
  //                     <Edit size={16} />
  //                   </button>
  //                   <button
  //                     onClick={() => handleDelete(announcement._id)}
  //                     className="text-red-500 hover:bg-stone-200 p-2 rounded"
  //                   >
  //                     <Trash2 size={16} />
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {isModalOpen && (
  //         <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto my-5 rounded-md">
  //           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-stone-200 my-8">
  //             <div className="p-5">
  //               <div className="flex justify-between items-center mb-4">
  //                 <h2 className="text-xl font-bold text-stone-900">
  //                   {currentAnnouncement
  //                     ? "Edit Announcement"
  //                     : "Add New Announcement"}
  //                 </h2>
  //                 <button
  //                   onClick={() => {
  //                     setIsModalOpen(false);
  //                     setCurrentAnnouncement(null);
  //                     setError(null);
  //                   }}
  //                   className="text-stone-500 hover:text-stone-700"
  //                 >
  //                   X
  //                 </button>
  //               </div>

  //               <form onSubmit={handleSubmit} className="space-y-4">
  //                 <div>
  //                   <label className="block text-stone-700 text-sm font-medium mb-1">
  //                     Announcement Title
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="title"
  //                     value={formData.title}
  //                     onChange={handleInputChange}
  //                     className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  //                     required
  //                     maxLength={100}
  //                   />
  //                 </div>

  //                 <div>
  //                   <label className="block text-stone-700 text-sm font-medium mb-1">
  //                     Announcement Content
  //                   </label>
  //                   <textarea
  //                     name="content"
  //                     value={formData.content}
  //                     onChange={handleInputChange}
  //                     rows="3"
  //                     className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  //                     required
  //                   />
  //                 </div>

  //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  //                   <div>
  //                     <label className="block text-stone-700 text-sm font-medium mb-1">
  //                       Publish Date
  //                     </label>
  //                     <input
  //                       type="date"
  //                       name="publishDate"
  //                       value={formData.publishDate}
  //                       onChange={handleInputChange}
  //                       className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  //                       required
  //                     />
  //                   </div>

  //                   <div>
  //                     <label className="block text-stone-700 text-sm font-medium mb-1">
  //                       Expiry Date (Optional)
  //                     </label>
  //                     <input
  //                       type="date"
  //                       name="expiryDate"
  //                       value={formData.expiryDate}
  //                       onChange={handleInputChange}
  //                       className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  //                     />
  //                   </div>
  //                 </div>

  //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  //                   <div>
  //                     <label className="block text-stone-700 text-sm font-medium mb-1">
  //                       Priority
  //                     </label>
  //                     <select
  //                       name="priority"
  //                       value={formData.priority}
  //                       onChange={handleInputChange}
  //                       className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  //                     >
  //                       {priorityOptions.map(option => (
  //                         <option key={option.value} value={option.value}>
  //                           {option.label}
  //                         </option>
  //                       ))}
  //                     </select>
  //                   </div>

  //                   <div className="flex items-center mt-6">
  //                     <input
  //                       type="checkbox"
  //                       name="isActive"
  //                       checked={formData.isActive}
  //                       onChange={handleInputChange}
  //                       className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
  //                     />
  //                     <label className="ml-2 text-sm text-stone-700">
  //                       Active
  //                     </label>
  //                   </div>
  //                 </div>

  //                 {error && (
  //                   <div className="p-2 bg-red-100 text-red-700 text-sm rounded">
  //                     {error}
  //                   </div>
  //                 )}

  //                 <div className="flex justify-end space-x-2 pt-2">
  //                   <button
  //                     type="button"
  //                     onClick={() => {
  //                       setIsModalOpen(false);
  //                       setCurrentAnnouncement(null);
  //                       setError(null);
  //                     }}
  //                     className="px-3 py-1.5 text-sm border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
  //                   >
  //                     Cancel
  //                   </button>
  //                   <button
  //                     type="submit"
  //                     className="px-3 py-1.5 text-sm bg-amber-500 text-stone-900 rounded hover:bg-amber-600"
  //                   >
  //                     {currentAnnouncement ? "Update" : "Save"}
  //                   </button>
  //                 </div>
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className=" mt-16 w-full min-h-screen bg-[#FBFFF1] flex items-start justify-center p-2 sm:p-4 md:p-6 lg:p-8">
    <div className="w-full max-w-7xl bg-[#FBFFF1] rounded-lg  p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 my-4 sm:my-8 md:my-12 lg:my-20">

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 lg:mb-10">
        <a href="/admin" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Dashboard
          </button>
        </a>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-amber-500 text-stone-900 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-all"
        >
          <Plus size={20} />
          Add Announcement
        </button>
      </div>

      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="border border-stone-300 rounded-lg p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all w-full">
            <div className="flex justify-between items-start mb-3 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-stone-900 break-words flex-1 pr-2">
                {announcement.title}
              </h3>
              <div className="flex-shrink-0">
                {announcement.isActive ? (
                  <Eye className="text-green-500" size={18} />
                ) : (
                  <EyeOff className="text-gray-400" size={18} />
                )}
              </div>
            </div>
            
            <p className="text-stone-700 text-sm leading-relaxed mb-4 break-words">
              {announcement.content}
            </p>
            
            <div className="text-xs text-stone-600 space-y-2 mb-4">
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-medium">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  announcement.priority === 2
                    ? 'bg-red-100 text-red-800'
                    : announcement.priority === 1
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 text-stone-800'
                }`}>
                  {priorityOptions.find(opt => opt.value === announcement.priority)?.label || 'Unknown'}
                </span>
              </div>
              
              <div className="break-words">
                <span className="font-medium">Publish:</span>{" "}
                <span className="font-semibold">{new Date(announcement.publishDate).toLocaleDateString()}</span>
              </div>
              
              {announcement.expiryDate && (
                <div className="break-words">
                  <span className="font-medium">Expiry:</span>{" "}
                  <span className="font-semibold">{new Date(announcement.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 sm:gap-3 justify-end border-t border-stone-200 pt-3">
              <button
                onClick={() => handleEdit(announcement)}
                className="text-amber-500 hover:bg-amber-50 p-2 rounded transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(announcement._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-2 sm:p-4 md:p-6">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-stone-200 my-4 sm:my-8 mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  {currentAnnouncement ? "Edit Announcement" : "Add New Announcement"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentAnnouncement(null);
                    setError(null);
                  }}
                  className="text-stone-500 hover:text-stone-700 text-xl font-bold p-1"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    required
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:ring-1 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Content</label>
                  <textarea
                    name="content"
                    rows="4"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:ring-1 focus:border-amber-500 resize-vertical"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Publish Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:ring-1 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:ring-1 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:ring-1 focus:border-amber-500"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 sm:mt-7">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded border-stone-300"
                    />
                    <label className="text-sm font-medium text-stone-700">Active</label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 text-red-700 text-sm p-3 rounded border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentAnnouncement(null);
                      setError(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm text-stone-700 border border-stone-300 rounded hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors"
                  >
                    {currentAnnouncement ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default AnnouncementsDashboard;
 
