import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createRazorpayOrder = async (amount, currency = 'INR') => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/payment/create-order`,
            { amount, currency }
        );
        console.log("Razorpay order response:", response.data);
        return response.data; // contains { success, order }
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error;
    }
};
