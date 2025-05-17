import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../actions/cartService';

// Async thunks for cart actions (fetchCart, addToCart, etc.) remain unchanged.
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (userId, thunkAPI) => {
        try {
            const data = await cartService.getCart(userId);
            return data; // Expecting the cart object from backend
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

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

export const updateCartQuantity = createAsyncThunk(
    'cart/updateCartQuantity',
    async ({ userId, productId, quantity }, thunkAPI) => {
        try {
            const data = await cartService.updateProductQuantity(userId, productId, quantity);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({ userId, productId }, thunkAPI) => {
        try {
            const data = await cartService.removeProductFromCart(userId, productId);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    cart: null, // holds the cart object, including items
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Synchronous reducers (e.g., for applying coupons or setting donation amount)
        applyCoupon: (state, action) => {
            if (state.cart) {
                state.cart.couponCode = action.payload;
            }
        },
        setDonationAmount: (state, action) => {
            if (state.cart) {
                state.cart.donationAmount = action.payload;
            }
        },
        // NEW: Clear the cart (for example after a successful order)
        clearCart: (state) => {
            // Resetting cart to a structure with empty items.
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
