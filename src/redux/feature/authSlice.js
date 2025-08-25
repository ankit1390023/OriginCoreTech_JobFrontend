import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

// 🔐 Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email,          // backend expects `email`
          userEmail: email, // fallback if backend expects `userEmail`
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = response.data;
      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;

      if (!user || !token) {
        throw new Error('Invalid response format from server');
      }

      // ✅ Persist token + user
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.statusText ||
          'Login failed. Please check your credentials.'
      );
    }
  }
);

// 🆕 Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, signupData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;
      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;

      if (!user || !token) {
        throw new Error('Invalid response format from server');
      }

      // ✅ Persist token + user
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.statusText ||
          'Signup failed. Please try again.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user'); // ✅ clear user
    },

    // ✅ Generic updateUser reducer
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user)); // keep in sync
    },

    // ✅ Explicit updateEmail reducer for clarity
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

// ✅ Export both actions
export const { logout, updateUser, updateEmail } = authSlice.actions;

export default authSlice.reducer;
