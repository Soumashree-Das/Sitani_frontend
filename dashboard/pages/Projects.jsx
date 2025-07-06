// import React, { useState, useEffect } from "react";
// import { Plus, Edit, Trash2, Star, X } from "lucide-react";
// import { api } from "../../src/lib/api.js"; // shared Axios instance  (baseURL = VITE_SERVER_URL + /api/v1)

// const ProjectsDashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     status: "planned",
//     featured: false,
//     teamMembers: [],
//   });
//   const [imageFiles, setImageFiles] = useState([]);
//   const [videoFiles, setVideoFiles] = useState([]);

//   /* ─────────────────────────── fetch list ─────────────────────────── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/projects");
//         if (data.success) setProjects(data.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     })();
//   }, []);

//   /* ─────────────────────────── helpers ─────────────────────────── */
//   const fetchProjects = async () => {
//     try {
//       const { data } = await api.get("/projects");
//       if (data.success) setProjects(data.data);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       status: "planned",
//       featured: false,
//       teamMembers: [],
//     });
//     setImageFiles([]);
//     setVideoFiles([]);
//     setEditingProject(null);
//     setShowForm(false);
//   };

//   /* ─────────────────────────── CRUD ─────────────────────────── */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     fd.append("name", formData.name);
//     fd.append("description", formData.description);
//     fd.append("startDate", formData.startDate);
//     fd.append("endDate", formData.endDate);
//     fd.append("status", formData.status);
//     fd.append("featured", formData.featured);

//     formData.teamMembers.forEach((m, i) => {
//       fd.append(`teamMembers[${i}][name]`, m.name);
//       fd.append(`teamMembers[${i}][role]`, m.role);
//     });

//     imageFiles.forEach((f) => fd.append("images", f));
//     videoFiles.forEach((f) => fd.append("videos", f));

//     try {
//       if (editingProject) {
//         await api.put(`/projects/update/${editingProject._id}`, fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await api.post("/projects", fd, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//       await fetchProjects();
//       resetForm();
//     } catch (err) {
//       console.error("Error saving project:", err);
//       alert(err.response?.data?.error || err.message || "Failed to save");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this project?")) return;
//     try {
//       await api.delete(`/projects/delete/${id}`);
//       await fetchProjects();
//     } catch (err) {
//       console.error("Error deleting project:", err);
//     }
//   };

//   const handleEdit = (project) => {
//     setEditingProject(project);
//     setFormData({
//       name: project.name,
//       description: project.description,
//       startDate: project.startDate ? project.startDate.split("T")[0] : "",
//       endDate: project.endDate ? project.endDate.split("T")[0] : "",
//       status: project.status,
//       featured: project.featured,
//       teamMembers: project.teamMembers || [],
//     });
//     setShowForm(true);
//   };

//   /* team member helpers */
//   const addTeamMember = () =>
//     setFormData((p) => ({
//       ...p,
//       teamMembers: [...p.teamMembers, { name: "", role: "" }],
//     }));

//   const updateTeamMember = (i, field, val) => {
//     const updated = [...formData.teamMembers];
//     updated[i][field] = val;
//     setFormData({ ...formData, teamMembers: updated });
//   };

//   const removeTeamMember = (i) =>
//     setFormData({
//       ...formData,
//       teamMembers: formData.teamMembers.filter((_, idx) => idx !== i),
//     });

//   /* ─────────────────────────── UI ─────────────────────────── */
//   return (
//     <div className="w-full bg-stone-900/95 mt-15">
//       <div className="p-4 md:p-6 w-full max-w-7xl mx-auto mt-4 md:mt-8 lg:mt-12 bg-[#FBFFF1] rounded-lg shadow-lg">
//         <a href="/admin">
//           <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200 mb-4">
//             Dashboard
//           </button>
//         </a>

//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
//             Projects Dashboard
//           </h1>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 w-full sm:w-auto justify-center"
//           >
//             <Plus size={20} />
//             <span>Add Project</span>
//           </button>
//         </div>

//         {/* ─────────────────────────── Modal form ─────────────────────────── */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg md:text-xl font-bold text-stone-900">
//                   {editingProject ? "Edit Project" : "Add New Project"}
//                 </h2>
//                 <button
//                   onClick={resetForm}
//                   className="text-stone-500 hover:text-stone-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Project Name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                   required
//                 />

//                 <textarea
//                   placeholder="Description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="w-full p-2 md:p-3 border border-stone-300 rounded-lg h-24 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                   required
//                 />

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm text-stone-600 mb-1">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.startDate}
//                       onChange={(e) =>
//                         setFormData({ ...formData, startDate: e.target.value })
//                       }
//                       className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-stone-600 mb-1">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.endDate}
//                       onChange={(e) =>
//                         setFormData({ ...formData, endDate: e.target.value })
//                       }
//                       className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-stone-600 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) =>
//                       setFormData({ ...formData, status: e.target.value })
//                     }
//                     className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                   >
//                     <option value="planned">Planned</option>
//                     <option value="ongoing">Ongoing</option>
//                     <option value="completed">Completed</option>
//                     <option value="on-hold">On Hold</option>
//                   </select>
//                 </div>

//                 <label className="flex items-center gap-2 text-stone-700">
//                   <input
//                     type="checkbox"
//                     checked={formData.featured}
//                     onChange={(e) =>
//                       setFormData({ ...formData, featured: e.target.checked })
//                     }
//                     className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
//                   />
//                   Featured Project
//                 </label>

//                 {/* team members */}
//                 <div>
//                   <h3 className="font-semibold mb-2 text-stone-700">
//                     Team Members
//                   </h3>
//                   {formData.teamMembers.map((m, i) => (
//                     <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
//                       <input
//                         type="text"
//                         placeholder="Name"
//                         value={m.name}
//                         onChange={(e) => updateTeamMember(i, "name", e.target.value)}
//                         className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                       />
//                       <input
//                         type="text"
//                         placeholder="Role"
//                         value={m.role}
//                         onChange={(e) => updateTeamMember(i, "role", e.target.value)}
//                         className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeTeamMember(i)}
//                         className="text-stone-700 hover:bg-stone-100 p-2 rounded transition-colors duration-200 sm:self-center"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={addTeamMember}
//                     className="text-amber-600 hover:text-amber-700 p-2 rounded transition-colors duration-200 text-sm"
//                   >
//                     + Add Team Member
//                   </button>
//                 </div>

//                 {/* media uploads */}
//                 <span>
//                   <h2 className="font-semibold mb-2 text-stone-700">
//                     Upload media
//                   </h2>
//                   <p className="mb-2 text-amber-600 font-thin">
//                     (Previous media will be replaced by the new upload)
//                   </p>
//                 </span>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 text-sm text-stone-700">Images</label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={(e) => setImageFiles(Array.from(e.target.files))}
//                       className="w-full p-1 md:p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 text-sm text-stone-700">Videos</label>
//                     <input
//                       type="file"
//                       accept="video/*"
//                       multiple
//                       onChange={(e) => setVideoFiles(Array.from(e.target.files))}
//                       className="w-full p-1 md:p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-2 pt-2">
//                   <button
//                     type="submit"
//                     className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded transition-colors duration-200"
//                   >
//                     {editingProject ? "Update" : "Create"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded transition-colors duration-200"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* ─────────────────────────── cards ─────────────────────────── */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {projects.length ? (
//             projects.map((p) => (
//               <div
//                 key={p._id}
//                 className="bg-white shadow border border-stone-200 rounded-lg p-4 flex flex-col justify-between"
//               >
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <h3 className="text-lg md:text-xl font-semibold text-stone-900">
//                       {p.name}
//                     </h3>
//                     {p.featured && <Star className="text-amber-500" size={20} />}
//                   </div>
//                   <p className="text-stone-600 mb-2 text-sm md:text-base line-clamp-3">
//                     {p.description}
//                   </p>
//                   <div className="text-xs md:text-sm text-stone-500 space-y-1">
//                     <p>
//                       Status: <span className="font-semibold">{p.status}</span>
//                     </p>
//                     {p.startDate && (
//                       <p>Start: {new Date(p.startDate).toLocaleDateString()}</p>
//                     )}
//                     {p.endDate && (
//                       <p>End: {new Date(p.endDate).toLocaleDateString()}</p>
//                     )}
//                   </div>
//                   {p.teamMembers?.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-xs md:text-sm font-semibold text-stone-700">
//                         Team:
//                       </p>
//                       <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
//                         {p.teamMembers.map((m, i) => (
//                           <span
//                             key={i}
//                             className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-800"
//                           >
//                             {m.name} ({m.role})
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2 mt-4 justify-end">
//                   <button
//                     onClick={() => handleEdit(p)}
//                     className="text-amber-600 hover:bg-amber-50 p-2 rounded"
//                   >
//                     <Edit size={16} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="text-stone-700 hover:bg-stone-100 p-2 rounded"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-stone-500 col-span-full">
//               No projects found. Add a project to get started.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsDashboard;

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star, X } from "lucide-react";
import { api } from "../../src/lib/api"; // baseURL = VITE_SERVER_URL/api/v1

const ProjectsDashboard = () => {
  /* ───────── state ───────── */
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    featured: false,
    teamMembers: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imageOption, setImageOption] = useState("keep"); // keep | append | replace
  const [videoOption, setVideoOption] = useState("keep");

  /* ───────── fetch list ───────── */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  /* ───────── form helpers ───────── */
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "planned",
      featured: false,
      teamMembers: [],
    });
    setImageFiles([]);
    setVideoFiles([]);
    setImageOption("keep");
    setVideoOption("keep");
    setEditingProject(null);
    setShowForm(false);
  };

  /* add/edit team member */
  const addTeamMember = () =>
    setFormData((p) => ({
      ...p,
      teamMembers: [...p.teamMembers, { name: "", role: "" }],
    }));

  const updateTeamMember = (i, fld, val) => {
    const tm = [...formData.teamMembers];
    tm[i][fld] = val;
    setFormData({ ...formData, teamMembers: tm });
  };

  const removeTeamMember = (i) =>
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, idx) => idx !== i),
    });

  /* ───────── CRUD submit ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    // regular fields
    [
      "name",
      "description",
      "startDate",
      "endDate",
      "status",
      "featured",
    ].forEach((k) => fd.append(k, formData[k]));
    // team members
    formData.teamMembers.forEach((m, i) => {
      fd.append(`teamMembers[${i}][name]`, m.name);
      fd.append(`teamMembers[${i}][role]`, m.role);
    });
    // files & options
    fd.append("imageOption", imageOption);
    fd.append("videoOption", videoOption);
    imageFiles.forEach((f) => fd.append("images", f));
    videoFiles.forEach((f) => fd.append("videos", f));

    try {
      if (editingProject) {
        await api.put(`/projects/update/${editingProject._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/projects", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      await fetchProjects();
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.error || err.message || "Failed to save");
    }
  };

  /* ───────── delete / edit ───────── */
  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/delete/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (p) => {
    setEditingProject(p);
    setFormData({
      name: p.name,
      description: p.description,
      startDate: p.startDate ? p.startDate.split("T")[0] : "",
      endDate: p.endDate ? p.endDate.split("T")[0] : "",
      status: p.status,
      featured: p.featured,
      teamMembers: p.teamMembers || [],
    });
    setImageOption("keep");
    setVideoOption("keep");
    setShowForm(true);
  };

  /* ───────── UI ───────── */
  return (
    
    <div className="w-full bg-stone-900/95 mt-15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10 bg-[#FBFFF1] rounded-lg shadow-lg">
        <a href="/admin">
          <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Dashboard
          </button>
        </a>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Projects Dashboard
          </h1>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-stone-900 transition-colors hover:bg-amber-600 w-full sm:w-auto"
          >
            <Plus size={20} /> <span>Add Project</span>
          </button>
        </div>

        {/* ───────── modal form ───────── */}
        {showForm && (
          /* mobile‑first: padding + overflow scroll */
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
            <div className="w-full max-w-xl sm:max-w-2xl bg-white rounded-lg border border-stone-200 shadow-xl overflow-y-auto max-h-[92vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg sm:text-xl font-bold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-stone-600 hover:text-red-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* basic fields */}
                <input
                  required
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded border border-stone-300 p-3 focus:ring-amber-500"
                />

                <textarea
                  required
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded border border-stone-300 p-3 h-28 resize-none focus:ring-amber-500"
                />

                {/* dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="rounded border border-stone-300 p-3 focus:ring-amber-500"
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="rounded border border-stone-300 p-3 focus:ring-amber-500"
                  />
                </div>

                {/* status & featured */}
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded border border-stone-300 p-3 focus:ring-amber-500"
                >
                  {["planned", "ongoing", "completed", "on-hold"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <label className="inline-flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-5 w-5 text-amber-600 focus:ring-amber-500"
                  />
                  Featured
                </label>

                {/* team members */}
                <div>
                  <h3 className="mb-2 font-semibold text-stone-700">
                    Team Members
                  </h3>
                  {formData.teamMembers.map((m, i) => (
                    <div
                      key={i}
                      className="mb-2 flex flex-col gap-2 sm:flex-row"
                    >
                      <input
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) =>
                          updateTeamMember(i, "name", e.target.value)
                        }
                        className="flex-1 rounded border border-stone-300 p-2 focus:ring-amber-500"
                      />
                      <input
                        placeholder="Role"
                        value={m.role}
                        onChange={(e) =>
                          updateTeamMember(i, "role", e.target.value)
                        }
                        className="flex-1 rounded border border-stone-300 p-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeTeamMember(i)}
                        className="self-end text-stone-600 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Add Member
                  </button>
                </div>

                {/* media uploads */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* images */}
                  <div>
                    <label className="font-medium">Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        setImageFiles([...e.target.files]);
                        if (e.target.files.length && imageOption === "keep")
                          setImageOption("replace");
                      }}
                      className="mt-1 w-full rounded border border-stone-300 p-2 text-sm focus:ring-amber-500"
                    />
                    <select
                      value={imageOption}
                      onChange={(e) => setImageOption(e.target.value)}
                      className="mt-2 w-full rounded border border-stone-300 p-2 text-sm focus:ring-amber-500"
                    >
                      <option value="keep">Keep existing</option>
                      <option value="append">Append new</option>
                      <option value="replace">Replace all</option>
                    </select>
                  </div>

                  {/* videos */}
                  <div>
                    <label className="font-medium">Videos</label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => {
                        setVideoFiles([...e.target.files]);
                        if (e.target.files.length && videoOption === "keep")
                          setVideoOption("replace");
                      }}
                      className="mt-1 w-full rounded border border-stone-300 p-2 text-sm focus:ring-amber-500"
                    />
                    <select
                      value={videoOption}
                      onChange={(e) => setVideoOption(e.target.value)}
                      className="mt-2 w-full rounded border border-stone-300 p-2 text-sm focus:ring-amber-500"
                    >
                      <option value="keep">Keep existing</option>
                      <option value="append">Append new</option>
                      <option value="replace">Replace all</option>
                    </select>
                  </div>
                </div>

                {/* actions */}
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    className="rounded bg-amber-500 px-4 py-2 text-stone-900 transition hover:bg-amber-600"
                  >
                    {editingProject ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded bg-stone-500 px-4 py-2 text-white transition hover:bg-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ───────── cards grid ───────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.length ? (
            projects.map((p) => (
              <article
                key={p._id}
                className="flex flex-col rounded-lg border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition duration-200"
              >
                <header className="mb-2 flex items-center gap-2">
                  <h3 className="flex-1 font-semibold text-lg line-clamp-1 text-stone-800">
                    {p.name}
                  </h3>
                  {p.featured && <Star className="text-amber-500" size={18} />}
                </header>

                <p className="mb-2 text-sm text-stone-600 line-clamp-3">
                  {p.description}
                </p>

                <div className="space-y-1 text-xs text-stone-500">
                  <p>
                    Status: <b>{p.status}</b>
                  </p>
                  {p.startDate && (
                    <p>Start: {new Date(p.startDate).toLocaleDateString()}</p>
                  )}
                  {p.endDate && (
                    <p>End: {new Date(p.endDate).toLocaleDateString()}</p>
                  )}
                </div>

                {p.teamMembers?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-stone-700">
                      Team:
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.teamMembers.map((m, i) => (
                        <span
                          key={i}
                          className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-800"
                        >
                          {m.name} ({m.role})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <footer className="mt-4 ml-auto flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="rounded p-2 text-amber-600 hover:bg-amber-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="rounded p-2 text-stone-700 hover:bg-stone-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </footer>
              </article>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-stone-500">
              No projects yet. Add one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
