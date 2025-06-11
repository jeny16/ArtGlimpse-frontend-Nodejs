import axios from './api'; // Axios instance with baseURL, if configured
const API_URL = 'http://localhost:3000/api/user';

const userService = {
  // Fetch the user (and their buyer profile fields):
  getProfile: async (userId) => {
    const response = await axios.get(`${API_URL}/profile`, { params: { userId } });
    return response.data;
  },

  // Update one or more buyer-profile fields (mobile, addresses, etc.)
  updateProfile: async (userId, profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, { params: { userId } });
    return response.data;
  },

  // Delete the user entirely
  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_URL}/profile`, { params: { userId } });
    return response.data;
  }
};

export default userService;
