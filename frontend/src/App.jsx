import { useState } from 'react';
import PaperList from './components/PaperList';
import FilterBar from './components/FilterBar';

function App() {
  // The state for our filters now lives in the parent component
  const [filters, setFilters] = useState({
    limit: 20,
    skip: 0,
    search: '',
    start_date: '',
    end_date: '',
    // Add a new 'category' property, initialized as an empty array
    category: [], 
  });

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-8">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">arXiv Digest</h1>
        <p className="mt-2 text-slate-300">
          A personalized dashboard for arXiv papers.
        </p>
      </header>
      
      <main className="max-w-5xl mx-auto">
        {/* Pass the state and setter function to the FilterBar */}
        <FilterBar filters={filters} setFilters={setFilters} />
        
        {/* Pass the state down to the PaperList */}
        <PaperList filters={filters} />
      </main>
    </div>
  )
}

export default App;