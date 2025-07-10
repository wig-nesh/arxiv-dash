import { useState } from 'react';

const PaperCard = ({ paper }) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

  // Helper function to format the date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Split categories from the comma-separated string into an array
  const categoriesArray = paper.categories.split(',').map(cat => cat.trim());

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md mb-4 transition-all hover:shadow-cyan-500/20">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="text-xl font-bold text-cyan-400">{paper.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{paper.authors}</p>
          <p className="text-xs text-slate-500 mt-1">Submitted: {formatDate(paper.submitted_date)}</p>
        </div>
        <a 
          href={paper.pdf_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
        >
          PDF
        </a>
      </div>

      <div className="mt-4">
        <button 
          onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
          className="text-sm text-slate-300 hover:underline focus:outline-none"
        >
          {isAbstractExpanded ? 'Hide Abstract' : 'Show Abstract'}
        </button>
        {isAbstractExpanded && (
          <p className="text-slate-300 mt-2 text-justify">
            {paper.abstract}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categoriesArray.map(cat => (
          <span key={cat} className="bg-slate-700 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PaperCard;