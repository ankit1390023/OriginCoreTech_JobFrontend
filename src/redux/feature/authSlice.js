import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/login`, { email, password });
            console.log('Login API response:', response.data);
            return {
                user: response.data.user,
                token: response.data.token,
            };
        } catch (error) {
            console.log('Login API error:', error.response?.data || error);
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Async thunk for signup
export const signup = createAsyncThunk(
    'auth/signup',
    async (signupData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/register`, signupData);
            return {
                user: response.data.user,
                token: response.data.token,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Signup failed'
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log('Login fulfilled with payload:', action.payload);
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                console.log('Login rejected with error:', action.payload);
                state.loading = false;
                state.error = action.payload;
            })
            // Signup cases
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
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;