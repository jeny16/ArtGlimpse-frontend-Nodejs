import axios from './api';

const API_URL = 'http://localhost:3000/api/orders';

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData);
    //   console.log("console in the service::", response);
      return response.data; // { success: true, order: { … } }
    } catch (error) {
      throw error.response?.data || 'Failed to create order';
    }
  },

  fetchOrders: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
    //   console.log("response", response.data.orders);
      return response.data.orders; // { success: true, orders: [ … ] }
    } catch (error) {
      throw error.response?.data || 'Failed to fetch orders';
    }
  }
};

export default orderService;
