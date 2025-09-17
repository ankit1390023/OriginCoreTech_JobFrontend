import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const termsApi = {
  getTermsAndCondition: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-details/getterms_and_condition`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error while getting terms and conditions", error);
      throw error;
    }
  },

  updateTermsAndCondition: async (data, token) => {
    try {
      console.log("Sending data to updateTermsAndCondition:", data);

      // Get user ID from localStorage or data
      const user_id = data.user_id || localStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("User ID is required");
      }

      // Prepare the correct data format that server expects
      const requestData = {
        user_id: parseInt(user_id),
        accepted: data.accepted || true,
      };

      const response = await axios.post(
        `${BASE_URL}/user-details/updateTermsAndCondition`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error while updating terms and conditions", error);
      throw error;
    }
  },

};

export default termsApi;
