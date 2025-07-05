import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Eye, EyeOff } from 'lucide-react';

const BASE_URL2 = import.meta.env.VITE_SERVER_URL;

const ServicesDashboard = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    isActive: true,
    displayOrder: 0,
    category: '',
    tags: '',
    externalUrl: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState(null);

  const BASE_URL = `${BASE_URL2}/api/v1/services`;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const url = editingService ? `${BASE_URL}/update/${editingService._id}` : `${BASE_URL}/create`;
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        fetchServices();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this service?')) {
      try {
        await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      heading: '',
      description: '',
      isActive: true,
      displayOrder: 0,
      category: '',
      tags: '',
      externalUrl: '',
      featured: false
    });
    setImageFile(null);
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      heading: service.heading,
      description: service.description,
      isActive: service.isActive,
      displayOrder: service.displayOrder,
      category: service.category || '',
      tags: service.tags ? service.tags.join(', ') : '',
      externalUrl: service.externalUrl || '',
      featured: service.featured
    });
    setShowForm(true);
  };

  return (
    
    <div className="p-6 max-w-7xl mx-auto mt-12 bg-[#FBFFF1]">
     
      <a href="/admin">
      <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
        Dashboard
      </button>
    </a>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Services Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#FBFFF1] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={resetForm} className="text-stone-900 hover:text-amber-500">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Service Heading"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                className="w-full p-3 border border-stone-700 rounded-lg bg-transparent"
                required
              />
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-stone-700 rounded-lg h-24 bg-transparent"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Display Order"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="p-3 border border-stone-700 rounded-lg bg-transparent"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border border-stone-700 rounded-lg bg-transparent"
                />
              </div>

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-3 border border-stone-700 rounded-lg bg-transparent"
              />

              <input
                type="url"
                placeholder="External URL"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                className="w-full p-3 border border-stone-700 rounded-lg bg-transparent"
              />

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-stone-900">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="text-amber-500"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-stone-900">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="text-amber-500"
                  />
                  <span>
                    Featured 
                    <h6 className='font-light'>(tick the box to display the service on website)</h6>
                  </span>
                  
                </label>
              </div>


              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-amber-500 text-stone-900 px-4 py-2 rounded hover:bg-amber-600"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-stone-300 text-stone-900 px-4 py-2 rounded hover:bg-stone-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service._id} className="border border-stone-700 rounded-lg p-4 bg-[#FBFFF1] shadow">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-stone-900">{service.heading}</h3>
                    {service.featured && <Star className="text-amber-500" size={20} />}
                    {service.isActive ? (
                      <Eye className="text-green-500" size={16} />
                    ) : (
                      <EyeOff className="text-gray-400" size={16} />
                    )}
                  </div>
                  <p className="text-stone-700 mb-2">{service.description}</p>
                  <div className="text-sm text-stone-600 space-y-1">
                    <p>Order: <span className="font-semibold">{service.displayOrder}</span></p>
                    {service.category && (
                      <p>Category: <span className="font-semibold">{service.category}</span></p>
                    )}
                    {service.externalUrl && (
                      <p>
                        URL: <a href={service.externalUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
                          {service.externalUrl}
                        </a>
                      </p>
                    )}
                  </div>
                  {service.tags && service.tags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-stone-900">Tags:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-stone-200 px-2 py-1 rounded text-stone-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-amber-500 hover:bg-stone-200 p-2 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="text-red-500 hover:bg-stone-200 p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesDashboard;