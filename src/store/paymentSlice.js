// src/store/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentService from '../actions/paymentService';

export const fetchRazorpayOrder = createAsyncThunk(
  'payment/fetchOrder',
  async ({ orderId, amount }, thunkAPI) => {
    try {
      return await paymentService.createRazorpayOrder(orderId, amount);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  'payment/verify',
  async (payload, thunkAPI) => {
    try {
      const valid = await paymentService.verifyRazorpayPayment(payload);
      if (!valid) throw new Error('Invalid signature');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPaymentStatus = createAsyncThunk(
  'payment/status',
  async (orderId, thunkAPI) => {
    try {
      return await paymentService.getPaymentStatus(orderId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    order: null,      // { key, order }
    status: null,     // 'created'|'paid'|'failed'
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchRazorpayOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRazorpayOrder.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(fetchRazorpayOrder.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(verifyRazorpayPayment.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(verifyRazorpayPayment.fulfilled, (s) => { s.loading = false; s.status = 'paid'; })
      .addCase(verifyRazorpayPayment.rejected,  (s, a) => { s.loading = false; s.status = 'failed'; s.error = a.payload; })

      .addCase(fetchPaymentStatus.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPaymentStatus.fulfilled, (s, a) => { s.loading = false; s.status = a.payload; })
      .addCase(fetchPaymentStatus.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export default paymentSlice.reducer;
