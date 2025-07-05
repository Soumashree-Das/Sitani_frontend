import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star, X } from "lucide-react";
const BASE_URL = import.meta.env.VITE_SERVER_URL
const ProjectsDashboard = () => {
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

  const BASE_URL = `${BASE_URL}/api/v1/projects`;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append all regular fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("featured", formData.featured);

    // Append team members directly (no stringification)
    formData.teamMembers.forEach((member, index) => {
      formDataToSend.append(`teamMembers[${index}][name]`, member.name);
      formDataToSend.append(`teamMembers[${index}][role]`, member.role);
    });

    // Append files
    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    videoFiles.forEach((file) => {
      formDataToSend.append("videos", file);
    });

    try {
      const url = editingProject
        ? `${BASE_URL}/update/${editingProject._id}`
        : BASE_URL;
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save project");
      }

      fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this project?")) {
      try {
        await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

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
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      status: project.status,
      featured: project.featured,
      teamMembers: project.teamMembers || [],
    });
    setShowForm(true);
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", role: "" }],
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData({ ...formData, teamMembers: updated });
  };

  const removeTeamMember = (index) => {
    const updated = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: updated });
  };

  return (
    <div className="w-full bg-stone-900/95 mt-15">
      <div className="p-4 md:p-6 w-full max-w-7xl mx-auto mt-4 md:mt-8 lg:mt-12 bg-[#FBFFF1] rounded-lg shadow-lg">
        <a href="/admin">
          <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200 mb-4">
            Dashboard
          </button>
        </a>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
            Projects Dashboard
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-stone-900">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-stone-500 hover:text-stone-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 md:p-3 border border-stone-300 rounded-lg h-24 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-stone-600 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-2 md:p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="planned">Planned</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  Featured Project (featured projects will be displayed on the
                  website)
                </label>

                <div>
                  <h3 className="font-semibold mb-2 text-stone-700">
                    Team Members
                  </h3>
                  {formData.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2 mb-2"
                    >
                      <input
                        type="text"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMember(index, "role", e.target.value)
                        }
                        className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-stone-700 hover:bg-stone-100 p-2 rounded transition-colors duration-200 sm:self-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="text-amber-600 hover:text-amber-700 p-2 rounded transition-colors duration-200 text-sm"
                  >
                    + Add Team Member
                  </button>
                </div>
                <span>
                  <h2 className="font-semibold mb-2 text-stone-700">
                  Upload media 
                </h2>
                <p className=" mb-2 text-amber-600 font-thin">
                  (The previous media will be deleted . Only the
                  new ones will be displayed)
                </p>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-stone-700">
                      Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files))
                      }
                      className="w-full p-1 md:p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-stone-700">
                      Videos
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) =>
                        setVideoFiles(Array.from(e.target.files))
                      }
                      className="w-full p-1 md:p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    {editingProject ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded transition-colors duration-200 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow border border-stone-200 rounded-lg p-4 flex flex-col justify-between w-full h-full"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold text-stone-900">
                      {project.name}
                    </h3>
                    {project.featured && (
                      <Star className="text-amber-500" size={20} />
                    )}
                  </div>
                  <p className="text-stone-600 mb-2 text-sm md:text-base line-clamp-3">
                    {project.description}
                  </p>
                  <div className="text-xs md:text-sm text-stone-500 space-y-1">
                    <p>
                      Status:{" "}
                      <span className="font-semibold">{project.status}</span>
                    </p>
                    {project.startDate && (
                      <p>
                        Start:{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    )}
                    {project.endDate && (
                      <p>
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {project.teamMembers?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs md:text-sm font-semibold text-stone-700">
                        Team:
                      </p>
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                        {project.teamMembers.map((member, index) => (
                          <span
                            key={index}
                            className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-800"
                          >
                            {member.name} ({member.role})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-amber-600 hover:bg-amber-50 p-2 rounded transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-stone-700 hover:bg-stone-100 p-2 rounded transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-stone-500 col-span-full">
              No projects found. Add a project to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
