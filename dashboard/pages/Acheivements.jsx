import { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2, Star } from "lucide-react";

const BASE_URL = import.meta.env.VITE_SERVER_URL

const AcheivementsDashboard = () => {
  const [acheivements, setAcheivements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAcheivement, setEditingAcheivement] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'award',
    dateAcheived: new Date().toISOString().split('T')[0],
    featured: false,
    tags: ''
  });

  useEffect(() => {
    fetchAcheivements();
  }, []);

  const fetchAcheivements = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/acheivements`);
      if (!response.ok) throw new Error("Failed to fetch acheivements");
      const data = await response.json();
      setAcheivements(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "award",
      dateAcheived: new Date().toISOString().split("T")[0],
      featured: false,
      tags: "",
    });
    setEditingAcheivement(null);
    setShowForm(false);
  };

  const handleEdit = (acheivement) => {
    // Safe handling of dateAcheived
    let formattedDate = new Date().toISOString().split('T')[0]; // Default to today
    if (acheivement.dateAcheived) {
      try {
        // Handle both string and Date object formats
        const dateStr = typeof acheivement.dateAcheived === 'string' 
          ? acheivement.dateAcheived 
          : acheivement.dateAcheived.toISOString();
        formattedDate = dateStr.split('T')[0];
      } catch (error) {
        console.warn('Invalid date format:', acheivement.dateAcheived);
      }
    }

    setFormData({
      title: acheivement.title || '',
      description: acheivement.description || '',
      category: acheivement.category || 'award',
      dateAcheived: formattedDate,
      featured: acheivement.featured || false,
      tags: acheivement.tags ? acheivement.tags.join(', ') : ''
    });
    setEditingAcheivement(acheivement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this acheivement?"))
      return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/acheivements/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete acheivement");
      fetchAcheivements();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        dateAcheived: new Date(formData.dateAcheived),
      };

      const url = editingAcheivement
        ? `${BASE_URL}/api/v1/acheivements/${editingAcheivement._id}`
        : `${BASE_URL}/api/v1/acheivements`;

      const method = editingAcheivement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(response.statusText);

      resetForm();
      fetchAcheivements();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="text-center py-12">Loading acheivements...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#FBFFF1] rounded-lg shadow-md mt-15">
      {/* Dashboard Button */}
    <a href="/admin">
      <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200 mb-4">
        Dashboard
      </button>
    </a>

      <div className="flex justify-between items-center mb-6">
        
        <h1 className="text-3xl font-bold text-stone-900">
          Acheivements Dashboard
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors"
        >
          <Plus size={20} />
          Add Acheivement
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          
          <div className="bg-[#FBFFF1] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900">
                {editingAcheivement
                  ? "Edit Acheivement"
                  : "Add New Acheivement"}
              </h2>
              <button
                onClick={resetForm}
                className="text-stone-700 hover:text-amber-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-stone-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg h-24 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 mb-1">Category*</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 border border-stone-300 rounded-lg bg-white"
                    required
                  >
                    <option value="award">Award</option>
                    <option value="milestone">Milestone</option>
                    <option value="certification">Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">
                    Date Acheived*
                  </label>
                  <input
                    type="date"
                    value={formData.dateAcheived}
                    onChange={(e) =>
                      setFormData({ ...formData, dateAcheived: e.target.value })
                    }
                    className="w-full p-3 border border-stone-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg bg-white"
                  placeholder="e.g., safety, quality, innovation"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="text-amber-500 rounded"
                  />
                  Featured Acheivement (featured acheivements will be displayed on the website)
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-amber-500 text-stone-900 px-4 py-2 rounded hover:bg-amber-600 transition-colors"
                >
                  {editingAcheivement ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-stone-300 text-stone-900 px-4 py-2 rounded hover:bg-stone-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {acheivements.length === 0 ? (
          <div className="text-center py-12 text-stone-600">
            No acheivements found. Add your first acheivement!
          </div>
        ) : (
          acheivements.map((acheivement) => (
            <div
              key={acheivement._id}
              className="border border-stone-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-stone-900">
                      {acheivement.title}
                    </h3>
                    {acheivement.featured && (
                      <Star className="text-amber-500" size={18} />
                    )}
                  </div>
                  <p className="text-stone-700 mb-2">
                    {acheivement.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-stone-200 text-stone-800 px-2 py-1 rounded-full">
                      {acheivement.category?.charAt(0).toUpperCase() +
                        acheivement.category?.slice(1)}
                    </span>
                    <span className="text-stone-500">
                      {acheivement.dateAcheived 
                        ? new Date(acheivement.dateAcheived).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>
                  {acheivement.tags && acheivement.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {acheivement.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(acheivement)}
                    className="text-amber-500 hover:bg-amber-100 p-2 rounded-full transition-colors"
                    aria-label="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(acheivement._id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcheivementsDashboard;