// A list of common categories to show as filter options
const AVAILABLE_CATEGORIES = [
  'cs.AI',  // Artificial Intelligence
  'cs.LG',  // Machine Learning
  'cs.CV',  // Computer Vision
  'cs.CL',  // Computation and Language
  'cs.RO',  // Robotics
  'stat.ML' // Machine Learning (Statistics)
];

const FilterBar = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const handleLast7Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    setFilters(prevFilters => ({
        ...prevFilters,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
    }));
  };

  // --- NEW ---
  // Handler for category button clicks
  const handleCategoryClick = (category) => {
    setFilters(prevFilters => {
      const currentCategories = prevFilters.category || [];
      // Check if the category is already selected
      const newCategories = currentCategories.includes(category)
        // If yes, remove it from the array
        ? currentCategories.filter(c => c !== category)
        // If no, add it to the array
        : [...currentCategories, category];
      
      return { ...prevFilters, category: newCategories };
    });
  };
  // --- END NEW ---

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-8">
      {/* Search and Date inputs (no changes here) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search title or abstract..."
          value={filters.search || ''}
          onChange={handleInputChange}
          className="w-full bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="date"
          name="start_date"
          value={filters.start_date || ''}
          onChange={handleInputChange}
          className="w-full bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date || ''}
          onChange={handleInputChange}
          className="w-full bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <div className="flex items-center gap-2">
            <button 
                onClick={handleLast7Days}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Last 7 Days
            </button>
        </div>
      </div>

      {/* --- NEW Category Buttons Section --- */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Categories:</h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CATEGORIES.map(cat => {
            const isSelected = filters.category?.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1 text-sm rounded-full transition-colors font-medium
                  ${isSelected 
                    ? 'bg-cyan-500 text-slate-900' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
      {/* --- END NEW --- */}
    </div>
  );
};

export default FilterBar;