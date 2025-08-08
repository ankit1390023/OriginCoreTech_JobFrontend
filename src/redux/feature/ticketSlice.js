// src/redux/slices/ticketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketApi } from '../../api/ticketApi';

export const raiseTicket = createAsyncThunk(
  'ticket/raiseTicket',
  async ({ ticketData, token }, thunkAPI) => {
    try {
      const response = await ticketApi.raiseTicket(ticketData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    loading: false,
    error: null,
    success: false,
    ticket: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(raiseTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(raiseTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.ticket = action.payload;
      })
      .addCase(raiseTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default ticketSlice.reducer;
