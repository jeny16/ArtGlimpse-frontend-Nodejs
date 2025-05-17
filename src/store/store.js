import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import wishlistSlice from "./wishlistSlice";
import cartSlice from "./cartSlice";
import profileSlice from "./profileSlice"
import orderSlice from "./orderSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        product: productSlice,
        wishlist: wishlistSlice,
        cart: cartSlice,
        profile: profileSlice,
        order: orderSlice
    },
})

export default store;