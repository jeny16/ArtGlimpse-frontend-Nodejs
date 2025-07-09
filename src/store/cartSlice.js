// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../actions/cartService";

const initialState = {
  cart: { items: [], couponCode: null, donationAmount: 0 },
  loading: false,
  error: null,
  isGuest: true,
};

// Initialize guest cart from localStorage
const stored = localStorage.getItem("guestCart");
if (stored) {
  try {
    initialState.cart = JSON.parse(stored);
  } catch {}
}

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (userId, thunkAPI) => {
    try {
      return await cartService.getCartByUserId(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ userId, product, quantity }, thunkAPI) => {
    if (!userId) {
      // guest: build fresh from localStorage
      const guest = JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
      const items = [...guest.items];
      const idx = items.findIndex(i => i.productId === product._id);
      if (idx > -1) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
      } else {
        items.push({ productId: product._id, quantity, productData: product });
      }
      const updated = { ...guest, items };
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    }
    try {
      return await cartService.addItemToCart(userId, product._id, quantity, product.price);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, productId, quantity }, thunkAPI) => {
    if (!userId) {
      const guest = JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
      const items = guest.items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      );
      const updated = { ...guest, items };
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    }
    try {
      return await cartService.updateItemQuantity(userId, productId, quantity);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ userId, productId }, thunkAPI) => {
    if (!userId) {
      const guest = JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
      const items = guest.items.filter(i => i.productId !== productId);
      const updated = { ...guest, items };
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    }
    try {
      return await cartService.deleteItemFromCart(userId, productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/merge",
  async ({ userId }, thunkAPI) => {
    try {
      const guest = JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
      for (const i of guest.items) {
        await cartService.addItemToCart(userId, i.productId, i.quantity, i.productData.price);
      }
      localStorage.removeItem("guestCart");
      return await cartService.getCartByUserId(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCartOnServer = createAsyncThunk(
  "cart/clearServer",
  async (userId, thunkAPI) => {
    try {
      await cartService.clearCart(userId);
      return { items: [], couponCode: null, donationAmount: 0 };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: state => {
      state.cart = { items: [], couponCode: null, donationAmount: 0 };
      state.isGuest = true;
    },
    clearCartServer: state => {
      state.cart = { items: [], couponCode: null, donationAmount: 0 };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.cart = payload;
        state.isGuest = false;
      })
      .addCase(addItemToCart.fulfilled, (state, { payload }) => {
        state.cart = payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, { payload }) => {
        state.cart = payload;
      })
      .addCase(removeFromCart.fulfilled, (state, { payload }) => {
        state.cart = payload;
      })
      .addCase(mergeGuestCart.fulfilled, (state, { payload }) => {
        state.cart = payload;
        state.isGuest = false;
      })
    .addCase(clearCartOnServer.fulfilled, (state, { payload }) => {
      state.cart = payload;
      state.isGuest = false;
    })
    .addCase(clearCartOnServer.rejected, (state, { payload }) => {
      state.error = payload || "Failed to clear cart on server";
    });
  }
});

export const { resetCart, clearCartServer } = cartSlice.actions;
export default cartSlice.reducer;