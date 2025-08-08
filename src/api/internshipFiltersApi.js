// src/api/internshipFiltersApi.js
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
//const BASE_URL = 'http://212.95.51.83:5000/api';

const internshipFiltersApi = {
  getFilters: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/internship-filters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching internship filters:', error);
      throw error;
    }
  },
};

export default internshipFiltersApi;

