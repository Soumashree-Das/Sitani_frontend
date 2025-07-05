import React from 'react';

const AcheivementCard = ({ title, description, date, category, featured }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-stone-200 hover:border-amber-500">
      <div className="p-6 h-full flex flex-col">
        {/* Featured badge */}
        {featured && (
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
            Featured Acheivement
          </span>
        )}
        
        {/* Title */}
        <h3 className="text-stone-900 text-xl font-semibold mb-3">{title}</h3>
        
        {/* Description */}
        <p className="text-stone-600 mb-4 flex-grow">{description}</p>
        
        {/* Footer with date and category */}
        <div className="flex justify-between items-center pt-3 border-t border-stone-200">
          {/* Date */}
          <span className="text-sm text-stone-500">{date}</span>
          
          {/* Category badge */}
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            category === 'award' ? 'bg-amber-100 text-amber-800' :
            category === 'milestone' ? 'bg-amber-100 text-amber-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AcheivementCard;