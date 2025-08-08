// src/api/locationApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';

export const locationApi = {
  getLocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/master/location`);
      return response.data; // or just return response.data.data if you only want the array of locations
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
};
