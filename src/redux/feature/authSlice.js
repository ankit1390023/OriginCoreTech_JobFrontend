import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,
};

// 🔐 Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      const user = data.user || data.data?.user;
      const token= data.token || data.data?.token;

      // Handle profile_status: 0 → no token, just email + user_role
      if (user.profile_status === 0) {
        console.log("in handle profile", data);
        return { user };
      } 

      if (!user || !token) {
        throw new Error("Invalid response format from server");
      }

      //  Persist token + user
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
        console.log("in auth slice", user);
      return {  user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.statusText ||
          "Login failed. Please check your credentials."
      );
    }
  }
);


// 🆕 Async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        signupData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const user = response.data.user || response.data.data?.user;

      if (!user) {
        throw new Error("Invalid response format from server");
      }

      // After signup, send OTP (no token yet)
      await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: signupData.email,
      });
      return { user }; // No token on signup
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.statusText ||
          "Signup failed. Please try again."
      );
    }
  }
);


// ✅ NEW: Async thunk for OTP verification + login
export const verifyOtpAndLogin = createAsyncThunk(
  "auth/verifyOtpAndLogin",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      // 1. Verify OTP
      const otpResponse = await axios.post(`${BASE_URL}/otp/verify-otp`, {
        email,
        otp,
      });

      const { user, token } = otpResponse.data;

      if (!user || !token) {
        throw new Error("Invalid response: missing user or token");
      }

      // 2. Persist to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user"); //  clear user
    },

    //  Generic updateUser reducer
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user)); // keep in sync
    },

    // Explicit updateEmail reducer for clarity
    updateEmail: (state, action) => {
      if (state.user) {
        state.user.email = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { user, token } = action.payload;

        if (user.profile_status === 0) {
          state.user = user; // Keep user data for reference (email, role, etc.)
          state.token = null;
          state.isAuthenticated = false;
        } else {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })


      // OTP Verify + Login
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      const { user, token } = action.payload;
      if (user.profile_status === 0) {
        state.user = user;
        state.token = null;
        state.isAuthenticated = false;
      } else {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    })
    .addCase(verifyOtpAndLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
  },
});

// ✅ Export both actions
export const { logout, updateUser, updateEmail, clearPartialLoginData } = authSlice.actions;

export default authSlice.reducer;
