import { useState, useEffect } from 'react';
import { getPapers } from '../api/paperService';
import PaperCard from './PaperCard';

// PaperList now accepts filters as props
const PaperList = ({ filters }) => {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        // Pass the filters from props directly to the API service
        const data = await getPapers(filters);
        setPapers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch papers. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
    // The key change: This effect now re-runs whenever the 'filters' prop changes
  }, [filters]);

  // The rest of the component remains the same
  if (isLoading) {
    return <div className="text-center p-10 text-lg">Loading papers...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-400 bg-red-900/20 rounded-lg">{error}</div>;
  }
  return (
    <div>
      {papers.length > 0 ? (
        papers.map(paper => <PaperCard key={paper.arxiv_id} paper={paper} />)
      ) : (
        <div className="text-center p-10 bg-slate-800 rounded-lg">No papers found for the selected filters.</div>
      )}
    </div>
  );
};

export default PaperList;