// src/api/faqApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';

export const faqApi = {
  // Get all student FAQs
  getStudentFaqs: async (token) => {
    return await axios.get(`${BASE_URL}/master/faqs/student`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Add a new FAQ (single question/answer)
  addFaq: async (faqData, token) => {
    return await axios.post(`${BASE_URL}/master/faqs`, faqData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Add multiple FAQs (multiple questions/answers)
  addFaqs: async (faqsData, token) => {
    return await axios.post(`${BASE_URL}/master/faqs`, faqsData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get FAQs by role (if needed for other roles)
  getFaqsByRole: async (role, token) => {
    return await axios.get(`${BASE_URL}/master/faqs/${role.toLowerCase()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update an existing FAQ (if needed)
  updateFaq: async (faqId, faqData, token) => {
    return await axios.put(`${BASE_URL}/master/faqs/${faqId}`, faqData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete an FAQ (if needed)
  deleteFaq: async (faqId, token) => {
    return await axios.delete(`${BASE_URL}/master/faqs/${faqId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Toggle FAQ active status (if needed)
  toggleFaqStatus: async (faqId, token) => {
    return await axios.patch(`${BASE_URL}/master/faqs/${faqId}/toggle`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Export individual functions for easier importing
export const {
  getStudentFaqs,
  addFaq,
  addFaqs,
  getFaqsByRole,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
} = faqApi;