// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../actions/cartService';

// FETCH CART
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, thunkAPI) => {
    try {
      const data = await cartService.getCart(userId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ADD TO CART
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, thunkAPI) => {
    try {
      const data = await cartService.addProductToCart(cartData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// UPDATE QUANTITY
export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  // Now receives one object: { userId, productId, quantity }
  async (payload, thunkAPI) => {
    try {
      const data = await cartService.updateProductQuantity(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, thunkAPI) => {
    try {
      const data = await cartService.removeProductFromCart({ userId, productId });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  cart: null,       // holds the full cart object
  status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    applyCoupon: (state, action) => {
      if (state.cart) state.cart.couponCode = action.payload;
    },
    setDonationAmount: (state, action) => {
      if (state.cart) state.cart.donationAmount = action.payload;
    },
    clearCart: (state) => {
      state.cart = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart';
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add product to cart';
      })
      // updateCartQuantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update product quantity';
      })
      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to remove product from cart';
      });
  },
});

export const { applyCoupon, setDonationAmount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
