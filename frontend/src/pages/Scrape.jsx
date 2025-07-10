import { useState } from 'react';
import { triggerScrape } from '../api/paperService';
import PaperCard from '../components/PaperCard';

const AVAILABLE_CATEGORIES = [
  'cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.RO', 'stat.ML'
];

const getInitialDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
};

const Scrape = () => {
  const [filters, setFilters] = useState({
    categories: ['cs.AI'], // Default to one category
    start_date: getInitialDateRange().start,
    end_date: getInitialDateRange().end,
  });

  const [isScraping, setIsScraping] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('Select filters and click "Scrape Now" to fetch new papers from arXiv.');

  const handleDateChange = (e) => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCategoryClick = (category) => {
    setFilters(f => {
      const newCategories = f.categories.includes(category)
        ? f.categories.filter(c => c !== category)
        : [...f.categories, category];
      return { ...f, categories: newCategories };
    });
  };

  const handleScrape = async () => {
    setIsScraping(true);
    setResults([]);
    setMessage('Scraping in progress... This may take a moment.');
    try {
      const newPapers = await triggerScrape(filters);
      setResults(newPapers);
      setMessage(`Scrape complete! Found ${newPapers.length} new paper(s). These have been added to the database.`);
    } catch (error) {
      setMessage('An error occurred during the scrape. Please check the console and try again.');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div>
      {/* Filter and Control Section */}
      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">On-Demand Scrape</h2>
        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
            <input type="date" name="start_date" value={filters.start_date} onChange={handleDateChange} className="w-full bg-slate-700 p-2 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
            <input type="date" name="end_date" value={filters.end_date} onChange={handleDateChange} className="w-full bg-slate-700 p-2 rounded-md"/>
          </div>
        </div>
        {/* Category Filters */}
        <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Categories (at least one required)</h4>
            <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)} className={`px-3 py-1 text-sm rounded-full ${filters.categories.includes(cat) ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        {/* Scrape Button */}
        <button
          onClick={handleScrape}
          disabled={isScraping || filters.categories.length === 0}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isScraping ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Scrape Now'}
        </button>
      </div>

      {/* Results Section */}
      <div className="bg-slate-800/50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Results</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map(paper => <PaperCard key={paper.arxiv_id} paper={paper} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scrape;