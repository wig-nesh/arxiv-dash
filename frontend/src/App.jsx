import { useState, useEffect } from 'react';
import PaperList from './components/PaperList';
import FilterBar from './components/FilterBar';
import { getPapers } from './api/paperService';

function App() {
  const [filters, setFilters] = useState({
    limit: 10, // Let's use a smaller limit for pagination
    skip: 0,
    search: '',
    start_date: '',
    end_date: '',
    category: [], 
  });
  
  // Lifted state from PaperList
  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // The main data fetching effect now lives in App.jsx
  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true);
      try {
        const data = await getPapers(filters);
        setPapers(data.papers);
        setTotalCount(data.total_count);
        setError(null);
      } catch (err) {
        setError('Failed to fetch papers. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, [filters]); // Re-runs whenever filters change

  // Handler for changing the page
  const handlePageChange = (newPage) => {
    // newPage is 1-based, skip is 0-based
    const newSkip = (newPage - 1) * filters.limit;
    setFilters(prevFilters => ({
      ...prevFilters,
      skip: newSkip
    }));
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-8">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">arXiv Digest</h1>
        <p className="mt-2 text-slate-300">A personalized dashboard for arXiv papers.</p>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <FilterBar filters={filters} setFilters={setFilters} />
        
        <PaperList
          papers={papers}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          filters={filters}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  )
}

export default App;