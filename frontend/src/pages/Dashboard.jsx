import { useState, useEffect } from 'react';
import PaperList from '../components/PaperList';
import FilterBar from '../components/FilterBar';
import { getPapers } from '../api/paperService';

// This is essentially our old App.jsx component
function Dashboard() {
  const [filters, setFilters] = useState({
    limit: 12, // Let's use a number divisible by 2, 3, and 4 for a nice grid
    skip: 0,
    search: '',
    start_date: '',
    end_date: '',
    category: [],
  });

  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true);
      try {
        const data = await getPapers(filters);
        setPapers(data.papers);
        setTotalCount(data.total_count);
        setError(null);
      } catch (err) {
        setError('Failed to fetch papers.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, [filters]);

  const handlePageChange = (newPage) => {
    const newSkip = (newPage - 1) * filters.limit;
    setFilters(prevFilters => ({
      ...prevFilters,
      skip: newSkip
    }));
  };

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} />
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