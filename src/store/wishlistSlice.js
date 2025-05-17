import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../actions/wishlistService";

const initialState = {
    wishlist: null, // This will be a WishlistResponse with full user & product data
    isLoading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (userId, thunkAPI) => {
        try {
            const data = await wishlistService.getWishlist(userId);
            return data;
        } catch (error) {
            console.error("fetchWishlist error:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || "Failed to fetch wishlist"
            );
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async ({ userId, productId }, thunkAPI) => {
        try {
            const data = await wishlistService.addToWishlist({ userId, productId });
            return data;
        } catch (error) {
            console.error("addToWishlist error:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || "Failed to add product to wishlist"
            );
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async ({ userId, productId }, thunkAPI) => {
        try {
            const data = await wishlistService.removeFromWishlist({ userId, productId });
            return data;
        } catch (error) {
            console.error("removeFromWishlist error:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message || "Failed to remove product from wishlist"
            );
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
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch wishlist";
            })
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlist = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to add product to wishlist";
            })
            .addCase(removeFromWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlist = action.payload;
                if (!action.payload?.products) {
                    state.wishlist = null;
                }
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to remove product from wishlist";
            });
    },
});

export default wishlistSlice.reducer;
