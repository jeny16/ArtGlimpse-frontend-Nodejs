import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createPaymentIntent = async (amount, currency) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/payment/create-payment-intent`,
            { amount, currency }
        );
        console.log("response of payment", response);
        return response.data;
    } catch (error) {
        throw error;
    }
};
