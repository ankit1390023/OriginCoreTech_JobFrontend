// src/api/ticketApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ticketApi = {
  raiseTicket: async (ticketData) => {
    try {
      const response = await axios.post(`${BASE_URL}/tickets/raise`, ticketData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error raising ticket:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },
};
