import axios from './api'; // Use the configured axios instance
const API_URL = 'http://localhost:3000/api/auth';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            console.log("Login response:", response);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.log("Login error:", error);
            throw error.response?.data || 'Failed to login';
        }
    },

    signup: async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, { username, email, password });
            console.log("Signup response:", response);
            // Immediately log in the user after signup
            const loginResponse = await authService.login(email, password);
            return loginResponse;
        } catch (error) {
            throw error.response?.data || 'Failed to register';
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    }
};

export default authService;
