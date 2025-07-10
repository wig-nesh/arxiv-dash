import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches papers from the API
 * @param {object} params - The query parameters for the API call
 * @returns {Promise<Array>} - A promise that resolves to an array of paper objects
 */
export const getPapers = async (params) => {
  try {
    // We pass the params and our custom serializer function to the get request
    const response = await apiClient.get('/papers/', { 
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        
        for (const key in params) {
          const value = params[key];
          
          // If the value is an array, append each item separately
          if (Array.isArray(value)) {
            value.forEach(item => {
              searchParams.append(key, item);
            });
          } 
          // Otherwise, if the value is not empty, append it normally
          else if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
          }
        }
        
        return searchParams.toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching papers:', error);
    throw error;
  }
};

/**
 * Triggers an on-demand scrape
 * @param {object} scrapeData - The data for the scrape request (e.g., { categories: [...], start_date: '...', end_date: '...' })
 * @returns {Promise<Array>} - A promise that resolves to an array of the newly scraped paper objects
 */
export const triggerScrape = async (scrapeData) => {
  try {
    const response = await apiClient.post('/scrape/', scrapeData);
    return response.data;
  } catch (error) {
    console.error('Error triggering scrape:', error);
    throw error;
  }
};