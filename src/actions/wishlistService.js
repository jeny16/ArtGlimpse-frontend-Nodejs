import axios from './api';
const API_URL = "http://localhost:3000/api/wishlist";

const wishlistService = {
  getWishlist: async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`);
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw { message: msg, status: error.response?.status };
    }
  },

  addToWishlist: async ({ userId, productId }) => {
    try {
      const response = await axios.post(API_URL, { userId, productId });
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw { message: msg, status: error.response?.status };
    }
  },

  removeFromWishlist: async ({ userId, productId }) => {
    try {
      const response = await axios.delete(API_URL, {
        data: { userId, productId }
      });
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw { message: msg, status: error.response?.status };
    }
  },
};

export default wishlistService;
