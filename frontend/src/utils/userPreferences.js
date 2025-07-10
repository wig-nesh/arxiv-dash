// A key to use for storing our data in local storage
const PREFERENCES_KEY = 'arxivDigestPreferences';

/**
 * Loads the user's preferences from local storage.
 * Returns a default object if no preferences are found.
 */
export const loadPreferences = () => {
  try {
    const serializedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (serializedPrefs === null) {
      // Return default preferences if none are saved
      return { keywords: '', categories: [] };
    }
    return JSON.parse(serializedPrefs);
  } catch (error) {
    console.error("Could not load preferences from local storage", error);
    return { keywords: '', categories: [] };
  }
};

/**
 * Saves the user's preferences to local storage.
 * @param {object} prefs - The preferences object to save (e.g., { keywords: 'transformer', categories: ['cs.AI'] })
 */
export const savePreferences = (prefs) => {
  try {
    const serializedPrefs = JSON.stringify(prefs);
    localStorage.setItem(PREFERENCES_KEY, serializedPrefs);
  } catch (error) {
    console.error("Could not save preferences to local storage", error);
  }
};