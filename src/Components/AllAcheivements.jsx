import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AcheivementCard from './AcheivementCard.jsx';
import construction1 from "../assets/construction1.webp"

const AllAcheivements = () => {
  const [acheivements, setAcheivements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAcheivements = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/v1/acheivements');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAcheivements(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAcheivements();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-stone-900/90 bg-[url(construction1)] bg-cover bg-center bg-blend-overlay py-12 mt-15">
      <div className="text-center text-white">Loading acheivements...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-stone-900/90 bg-[url(construction1)] bg-cover bg-center bg-blend-overlay py-12 mt-15">
      <div className="text-center text-amber-400">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-900/90 bg-[url(construction1)] bg-cover bg-center bg-blend-overlay mt-15">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-amber-400 hover:text-amber-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center mb-12 text-white">
          Our Acheivements
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-4"></div>
        </h1>
        
        {/* Acheivements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {acheivements.map(acheivement => (
            <AcheivementCard 
              key={acheivement._id}
              title={acheivement.title}
              description={acheivement.description}
              date={new Date(acheivement.dateAcheived).toLocaleDateString()}
              category={acheivement.category}
              featured={acheivement.featured}
            />
          ))}
        </div>

        {/* Empty State */}
        {acheivements.length === 0 && (
          <div className="text-center py-12 text-stone-300">
            No acheivements found
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAcheivements;