import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // replace with your actual base url

// Reusable API function
// Send OTP
export const sendOtp = async (phoneNumber, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/mobileotp/sendotp`,
        { phoneNumber }, // body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { message: "Something went wrong" };
      }
    }
  };
  
  // Verify OTP
  export const verifyOtp = async (phoneNumber, otp, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/mobileotp/verifyotp`,
        { phoneNumber, otp }, // body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { message: "Something went wrong" };
      }
    }
  };
  
  // Function to update Aadhaar details
export const updateAadhaarDetails = async (aadhaar_number, aadhaar_card_file, token) => {
    try {
      const formData = new FormData();
      formData.append("aadhaar_number", aadhaar_number);
      if (aadhaar_card_file) {
        formData.append("aadhaar_card_file", aadhaar_card_file); // File object
      }
      const response = await axios.put(
        `${BASE_URL}/user-details/updateAadhaarDetails`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // if authentication is required
          },
        }
      );
  
      console.log("Response:", response.data);
      return response.data; 
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data);
        return error.response.data;
      } else {
        console.error("Error:", error.message);
        return { message: "Something went wrong" };
      }
    }
  };

  //Function to reset password with forgot password otp
  export const forgotPassword = async (phoneNumber, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/mobileotp/sendotp`,
        { phoneNumber }, // body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { message: "Something went wrong" };
      }
    }
  };