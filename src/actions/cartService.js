// src/actions/cartService.js
import axios from './api'; // your configured axios instance

// Ensure this matches your Express mount: app.use('/api/cart', ...)
const API_URL = 'http://localhost:3000/api/cart';

const cartService = {
  // GET /api/cart/:userId
  getCart: async (userId) => {
    try {
      const { data } = await axios.get(`${API_URL}/${userId}`);
      // console.log('✅ getCart:', data);
      return data;
    } catch (err) {
    //   console.error('❌ getCart error:', err);
      throw err.response?.data || { message: 'Failed to fetch cart' };
    }
  },

  // POST /api/cart/:userId/add
  // Body: { productId, quantity, price }
  addProductToCart: async ({ userId, productId, quantity = 1, price }) => {
    try {
      const payload = { productId, quantity };
      if (price != null) payload.price = price;
    //   console.log('Payload sent to backend:', payload); 
      const { data } = await axios.post(`${API_URL}/${userId}/add`, payload);
      console.log('addProductToCart:', data);
      return data;
    } catch (err) {
      console.error('addProductToCart error:', err);
      throw err.response?.data || { message: 'Failed to add product to cart' };
    }
  },

  // PUT /api/cart/:userId/:productId
  // Body: { quantity }
  updateProductQuantity: async ({ userId, productId, quantity }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${userId}/${productId}`,
        { quantity }
      );
      console.log('✅ updateProductQuantity:', data);
      return data;
    } catch (err) {
      console.error('❌ updateProductQuantity error:', err);
      throw err.response?.data || { message: 'Failed to update quantity' };
    }
  },

  // DELETE /api/cart/:userId/remove/:productId
  removeProductFromCart: async ({ userId, productId }) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/${userId}/remove/${productId}`
      );
      console.log('✅ removeProductFromCart:', data);
      return data;
    } catch (err) {
      console.error('❌ removeProductFromCart error:', err);
      throw err.response?.data || { message: 'Failed to remove product' };
    }
  },

  // DELETE /api/cart/:userId/clear
  clearCart: async (userId) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${userId}/clear`);
      console.log('✅ clearCart:', data);
      return data;
    } catch (err) {
      console.error('❌ clearCart error:', err);
      throw err.response?.data || { message: 'Failed to clear cart' };
    }
  },
};

export default cartService;
