import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../actions/orderService';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, thunkAPI) => {
        try {
            const data = await orderService.createOrder(orderData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (userId, thunkAPI) => {
        try {
            const data = await orderService.fetchOrders(userId);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to create order';
            })
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch orders';
            });
    },
});

export default orderSlice.reducer;
