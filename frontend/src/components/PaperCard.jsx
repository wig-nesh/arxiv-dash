import { useState } from 'react';

const PaperCard = ({ paper }) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categoriesArray = paper.categories.split(',').map(cat => cat.trim());

  return (
    // --- THIS IS THE MAIN CHANGE ---
    // Added flex, flex-col to make the card a flex container that grows vertically
    <div className="bg-slate-800 p-6 rounded-lg shadow-md flex flex-col h-full transition-all hover:shadow-cyan-500/20 hover:scale-[1.02]">
      {/* The main content should grow to fill available space */}
      <div className="flex-grow"> 
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <h3 className="text-lg font-bold text-cyan-400">{paper.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{paper.authors}</p>
          </div>
          <a 
            href={paper.pdf_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
          >
            PDF
          </a>
        </div>
        
        <p className="text-xs text-slate-500 mb-2">Submitted: {formatDate(paper.submitted_date)}</p>

        <div>
          <button 
            onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
            className="text-sm text-slate-300 hover:underline focus:outline-none"
          >
            {isAbstractExpanded ? 'Hide Abstract' : 'Show Abstract'}
          </button>
          {isAbstractExpanded && (
            <p className="text-slate-300 mt-2 text-sm text-justify">
              {paper.abstract}
            </p>
          )}
        </div>
      </div>

      {/* The tags stay at the bottom because the content above will flex-grow */}
      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-700">
        {categoriesArray.map(cat => (
          <span key={cat} className="bg-slate-700 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {cat}
          </span>
        ))}
      </div>
    </div>
    // --- END OF CHANGE ---
  );
};

export default PaperCard;