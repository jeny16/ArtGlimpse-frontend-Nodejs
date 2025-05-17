import axios from './api'; // use the configured axios instance
const API_URL = 'http://localhost:3000/api/user';

const userService = {
    getProfile: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/profile`, { params: { userId } });
            console.log("Get profile response:", response);
            return response.data;
        } catch (error) {
            console.log("Get profile error:", error);
            throw error.response?.data || 'Failed to get profile';
        }
    },

    updateProfile: async (userId, profileData) => {
        try {
            const response = await axios.put(`${API_URL}/profile`, profileData, { params: { userId } });
            console.log("Update profile response:", response);
            return response.data;
        } catch (error) {
            console.log("Update profile error:", error);
            throw error.response?.data || 'Failed to update profile';
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/profile`, { params: { userId } });
            console.log("Delete user response:", response);
            return response.data;
        } catch (error) {
            console.log("Delete user error:", error);
            throw error.response?.data || 'Failed to delete user';
        }
    }
};

export default userService;
