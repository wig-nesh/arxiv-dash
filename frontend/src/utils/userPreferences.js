const PREFERENCES_KEY = 'arxivDigestPreferences';

export const loadPreferences = () => {
  try {
    const serializedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (serializedPrefs === null) {
      // Add a default dateRange preference
      return { keywords: '', categories: [], dateRange: 'last_7_days' };
    }
    const prefs = JSON.parse(serializedPrefs);
    // Ensure old saved settings get the new default if it's missing
    return {
      keywords: prefs.keywords || '',
      categories: prefs.categories || [],
      dateRange: prefs.dateRange || 'last_7_days',
    };
  } catch (error) {
    console.error("Could not load preferences", error);
    return { keywords: '', categories: [], dateRange: 'last_7_days' };
  }
};

// The savePreferences function doesn't need any changes.
export const savePreferences = (prefs) => {
  try {
    const serializedPrefs = JSON.stringify(prefs);
    localStorage.setItem(PREFERENCES_KEY, serializedPrefs);
  } catch (error) {
    console.error("Could not save preferences", error);
  }
};