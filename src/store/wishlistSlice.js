import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../actions/wishlistService";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, thunkAPI) => {
    try {
      const list = await wishlistService.getWishlist(userId);
      return list;               // always an array
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const list = await wishlistService.addToWishlist({ userId, productId });
      return list;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const list = await wishlistService.removeFromWishlist({ userId, productId });
      return list;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || action.payload;
      });
  },
});

export default wishlistSlice.reducer;
