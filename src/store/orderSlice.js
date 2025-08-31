import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../actions/orderService";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const data = await orderService.createOrder(orderData);
      console.log("order in slice::", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (userId, thunkAPI) => {
    try {
      const data = await orderService.fetchOrders(userId);
      // console.log("orders", data)
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateOrderPayment = createAsyncThunk(
  "orders/updatePayment",
  async ({ orderId, paymentInfo }, thunkAPI) => {
    const resp = await orderService.updateOrder(orderId, { paymentInfo });
    return resp; // updated order
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create order";
      })

      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch orders";
      })

      .addCase(updateOrderPayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateOrderPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        } else {
          state.orders.push(updatedOrder);
        }
      })
      .addCase(updateOrderPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update order payment";
      });
  },
});

export default orderSlice.reducer;
