// src/api/ticketApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';

export const ticketApi = {
  raiseTicket: async (ticketData, token) => {
    return await axios.post(`${BASE_URL}/tickets/raise`, ticketData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // if needed
      },
    });
  },
};
