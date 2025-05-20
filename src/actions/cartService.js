import axios from './api'; // use the configured axios instance
// const API_URL = 'http://localhost:3000/cart';

const cartService = {
    getCart: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            console.log("Cart response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching cart", error);
            throw error.response?.data || "Failed to fetch cart";
        }
    },

    addProductToCart: async (cartData) => {
        try {
            const response = await axios.post(API_URL, cartData);
            console.log("Add product to cart response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding product to cart", error);
            throw error.response?.data || "Failed to add product to cart";
        }
    },

    updateProductQuantity: async (userId, productId, quantity) => {
        try {
            const response = await axios.put(`${API_URL}/${userId}/${productId}`, { quantity });
            console.log("Update product quantity response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating product quantity", error);
            throw error.response?.data || "Failed to update product quantity";
        }
    },

    removeProductFromCart: async (userId, productId) => {
        try {
            const response = await axios.delete(`${API_URL}/${userId}/${productId}`);
            console.log("Remove product from cart response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error removing product from cart", error);
            throw error.response?.data || "Failed to remove product from cart";
        }
    },
};

export default cartService;
