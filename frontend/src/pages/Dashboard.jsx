import { useState, useEffect, useCallback } from 'react';
import PaperList from '../components/PaperList';
import { getPapers } from '../api/paperService';
import { loadPreferences } from '../utils/userPreferences';

// This new helper function translates the setting string into actual dates
const calculateDateRange = (rangeOption) => {
  const endDate = new Date();
  const startDate = new Date();
  switch (rangeOption) {
    case 'last_7_days':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'last_30_days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'this_year':
      startDate.setFullYear(endDate.getFullYear(), 0, 1);
      break;
    case 'all_time':
      // Return nulls to signify no date filter
      return { start_date: null, end_date: null };
    default:
      startDate.setDate(endDate.getDate() - 7);
  }
  return {
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
  };
};

// Display component to show the user which filters are active
const CurrentFiltersDisplay = ({ appliedFilters }) => {
  if (!appliedFilters) return null;
  const hasKeywords = appliedFilters.search;
  const hasCategories = appliedFilters.category?.length > 0;
  // Find the label for the current date range
  const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === appliedFilters.dateRange)?.label || 'Default';

  return (
    <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700 text-sm">
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
          <div><span className="text-slate-400">Date Range: </span><span className="font-mono bg-slate-700 px-2 py-1 rounded">{dateRangeLabel}</span></div>
          {hasKeywords && <div><span className="text-slate-400">Keywords: </span><span className="font-mono bg-slate-700 px-2 py-1 rounded">{appliedFilters.search}</span></div>}
          {hasCategories && <div><span className="text-slate-400">Categories: </span>{appliedFilters.category.map(c => (<span key={c} className="font-mono bg-slate-700 px-2 py-1 rounded mr-1">{c}</span>))}</div>}
      </div>
    </div>
  );
};
// Make options available to the display component
const DATE_RANGE_OPTIONS = [ { value: 'last_7_days', label: 'Last 7 Days' }, { value: 'last_30_days', label: 'Last 30 Days' }, { value: 'this_year', label: 'This Year' }, { value: 'all_time', label: 'All Time' }, ];


function Dashboard() {
  // The only user-interactive state left is for pagination
  const [pagination, setPagination] = useState({ limit: 12, skip: 0 });
  
  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedFiltersForDisplay, setAppliedFiltersForDisplay] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const userPrefs = loadPreferences();
    
    // Use the helper to get dates from the preference string
    const dateFilters = calculateDateRange(userPrefs.dateRange);

    const apiFilters = {
      ...pagination,
      ...dateFilters,
      search: userPrefs.keywords || '',
      category: userPrefs.categories || [],
    };
    
    setAppliedFiltersForDisplay({ ...userPrefs });

    try {
      const data = await getPapers(apiFilters);
      setPapers(data.papers);
      setTotalCount(data.total_count);
      setError(null);
    } catch (err) { setError('Failed to fetch papers.'); } 
    finally { setIsLoading(false); }
  }, [pagination]); // Now only depends on pagination state

  // These effects are now much cleaner
  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    setPagination(p => ({ ...p, skip: (newPage - 1) * p.limit }));
  };

  return (
    <div>
      {/* NO MORE FILTER BAR */}
      <h2 className="text-2xl font-bold mb-4">Your Personalized Feed</h2>
      <CurrentFiltersDisplay appliedFilters={appliedFiltersForDisplay} />
      <PaperList
        papers={papers}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        // Pass pagination state instead of the old filters object
        filters={pagination} 
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Dashboard;