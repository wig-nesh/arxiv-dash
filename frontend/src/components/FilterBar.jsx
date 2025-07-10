import { useState, useEffect } from 'react';
import { loadPreferences, savePreferences } from '../utils/userPreferences';

// Re-using the category list from our old filter bar
const AVAILABLE_CATEGORIES = [
  'cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.RO', 'stat.ML'
];

const Settings = () => {
  // State to hold the preferences, initialized from local storage
  const [prefs, setPrefs] = useState(loadPreferences);

  // An effect that saves preferences to local storage whenever they change
  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  const handleKeywordChange = (e) => {
    setPrefs(p => ({ ...p, keywords: e.target.value }));
  };

  const handleCategoryClick = (category) => {
    setPrefs(p => {
      const currentCategories = p.categories || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      return { ...p, categories: newCategories };
    });
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Dashboard Preferences</h2>
      
      {/* Keyword Input Section */}
      <div className="mb-8">
        <label htmlFor="keywords" className="block text-lg font-medium text-slate-300 mb-2">
          Default Keywords
        </label>
        <p className="text-sm text-slate-400 mb-2">
          Papers on your dashboard will match these keywords in their title or abstract.
        </p>
        <input
          type="text"
          id="keywords"
          name="keywords"
          placeholder="e.g., diffusion models, llm, robotics"
          value={prefs.keywords || ''}
          onChange={handleKeywordChange}
          className="w-full max-w-lg bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Category Selection Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">Default Categories</h3>
        <p className="text-sm text-slate-400 mb-4">
          Select categories to show on your dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_CATEGORIES.map(cat => {
            const isSelected = prefs.categories?.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 text-sm rounded-full transition-colors font-semibold
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
    </div>
  );
};

export default Settings;