import { useState, useEffect, useCallback } from 'react';
import PaperList from '../components/PaperList';
import FilterBar from '../components/FilterBar';
import { getPapers } from '../api/paperService';
import { loadPreferences } from '../utils/userPreferences';

const getInitialDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
};

// --- CORRECT: Component is defined at the top level ---
const CurrentFiltersDisplay = ({ appliedFilters }) => {
  // Check if the object is valid and has keys before trying to access them
  if (!appliedFilters || Object.keys(appliedFilters).length === 0) {
    return null;
  }

  const hasKeywords = appliedFilters.search && appliedFilters.search.length > 0;
  const hasCategories = appliedFilters.category && appliedFilters.category.length > 0;

  if (!hasKeywords && !hasCategories) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700 text-sm">
      <p className="font-semibold text-slate-300 mb-2">Applying preferences from Settings:</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {hasKeywords && (
          <div>
            <span className="text-slate-400">Keywords: </span>
            <span className="font-mono bg-slate-700 px-2 py-1 rounded">{appliedFilters.search}</span>
          </div>
        )}
        {hasCategories && (
          <div>
            <span className="text-slate-400">Categories: </span>
            {appliedFilters.category.map(cat => (
              <span key={cat} className="font-mono bg-slate-700 px-2 py-1 rounded mr-1">{cat}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function Dashboard() {
  const [filters, setFilters] = useState({
    limit: 12,
    skip: 0,
    start_date: getInitialDateRange().start,
    end_date: getInitialDateRange().end,
  });

  const [appliedApiFilters, setAppliedApiFilters] = useState(null); // Default to null
  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This useCallback is fine, its dependency is stable.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const userPrefs = loadPreferences();
    const apiFilters = {
      ...filters,
      search: userPrefs.keywords || '', // Ensure properties exist
      category: userPrefs.categories || [],
    };
    
    setAppliedApiFilters(apiFilters);

    try {
      const data = await getPapers(apiFilters);
      setPapers(data.papers);
      setTotalCount(data.total_count);
      setError(null);
    } catch (err) {
      setError('Failed to fetch papers.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Depends only on the filters controlled by the user on this page.

  // This effect runs when the page loads or when filters (date/page) change.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This effect re-fetches when the user comes back to the page.
  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    const newSkip = (newPage - 1) * filters.limit;
    setFilters(prevFilters => ({ ...prevFilters, skip: newSkip }));
  };

  return (
    <div>
      {/* <FilterBar filters={filters} setFilters={setFilters} /> */}
      <CurrentFiltersDisplay appliedFilters={appliedApiFilters} />
      <PaperList
        papers={papers}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        filters={filters}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Dashboard;