// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../actions/cartService';

// ────────────────────────────────────────────────────────────────────────────
// 1) FETCH CART (existing)
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, thunkAPI) => {
    try {
      const data = await cartService.getCart(userId);
      return data; // expected to be { items: [ … ], couponCode, donationAmount, … }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// 2) ADD TO CART (existing)
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, thunkAPI) => {
    try {
      const data = await cartService.addProductToCart(cartData);
      return data; // expect updated cart object
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// 3) UPDATE QUANTITY (existing)
export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async (payload, thunkAPI) => {
    try {
      const data = await cartService.updateProductQuantity(payload);
      return data; // expect updated cart object
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// 4) REMOVE FROM CART (existing)
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, thunkAPI) => {
    try {
      const data = await cartService.removeProductFromCart({ userId, productId });
      return data; // expect updated cart object
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// 5) CLEAR CART on the SERVER (NEW)
// This thunk calls DELETE /api/cart/:userId/clear, then empties Redux state.
export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (userId, thunkAPI) => {
    try {
      const data = await cartService.clearCart(userId);
      return data; // you can inspect data.success or whatever your API returns
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  cart: null,       // will hold the full cart object { items: […], couponCode, … }
  status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous action: clear local cart only (if you ever need it)
    clearCart: (state) => {
      state.cart = { items: [] };
    },
    applyCoupon: (state, action) => {
      if (state.cart) state.cart.couponCode = action.payload;
    },
    setDonationAmount: (state, action) => {
      if (state.cart) state.cart.donationAmount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // ────────────────────────────────────────────────────────────────────────
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload; // payload should be { items: […], couponCode, donationAmount }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart';
      })

      // ────────────────────────────────────────────────────────────────────────
      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload; // updated cart from server
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add product to cart';
      })

      // ────────────────────────────────────────────────────────────────────────
      // UPDATE CART QUANTITY
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload; // updated cart from server
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update product quantity';
      })

      // ────────────────────────────────────────────────────────────────────────
      // REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload; // updated cart from server
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to remove product from cart';
      })

      // ────────────────────────────────────────────────────────────────────────
      // CLEAR CART on SERVER (NEW)
      .addCase(clearCartServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCartServer.fulfilled, (state) => {
        state.status = 'succeeded';
        // Wipe out the local cart object so that items = []
        state.cart = { items: [] };
      })
      .addCase(clearCartServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to clear cart on server';
      });
  },
});

export const { applyCoupon, setDonationAmount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
