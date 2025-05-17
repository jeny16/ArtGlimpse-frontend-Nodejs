import axios from './api'; // use the configured axios instance
const API_URL = "http://localhost:3000/wishlist";

const wishlistService = {
    getWishlist: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            console.log("Wishlist response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching wishlist", error);
            throw error.response?.data || "Failed to fetch wishlist";
        }
    },

    addToWishlist: async ({ userId, productId }) => {
        try {
            const response = await axios.post(API_URL, { userId, productId });
            console.log("Add to wishlist response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding to wishlist", error);
            throw error.response?.data || "Failed to add to wishlist";
        }
    },

    removeFromWishlist: async ({ userId, productId }) => {
        try {
            const response = await axios.delete(`${API_URL}/${userId}/${productId}`);
            console.log("Remove from wishlist response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error removing from wishlist", error);
            throw error.response?.data || "Failed to remove from wishlist";
        }
    },
};

export default wishlistService;
