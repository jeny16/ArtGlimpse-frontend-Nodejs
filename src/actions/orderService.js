import axios from "./api";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to create order";
    }
  },

  fetchOrders: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data.orders;
    } catch (error) {
      throw error.response?.data || "Failed to fetch orders";
    }
  },

  updateOrder: async (orderId, updateData) => {
    const res = await axios.put(`${API_URL}/${orderId}`, updateData);
    console.log("✅ Order Updated", res.data);
    return res.data;
  },

  // ✅ Add this new method:
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/order/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw error.response?.data || "Failed to fetch order";
    }
  },
};

export default orderService;
