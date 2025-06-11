// paymentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createRazorpayOrder = async (amountInRupees, currency = 'INR') => {
  try {
    // 1. Convert rupees → paise (Razorpay requires smallest currency unit)
    console.log("amountinpaise", amountInRupees);
    const amountInPaise = Math.round(amountInRupees * 100);
    console.log("amountinpaise", amountInPaise);
    // 2. Provide a "receipt" (Razorpay uses this to identify the order). 
    //    You can change this to whatever string you like (e.g. userID + timestamp).
    const receipt = `rcpt_${Date.now()}`;

    // 3. Build the payload exactly as your backend expects:
    const payload = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    console.log('[createRazorpayOrder] sending payload:', payload);

    // 4. Make sure your backend route is expecting these three fields:
    //    { amount: Number, currency: String, receipt: String }
    const response = await axios.post(
      `${API_BASE_URL}/api/payment/create-order`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('[createRazorpayOrder] success response:', response.data);
    return response.data; // your backend might wrap { success: true, order: { … } }
  } catch (error) {
    // If the server sends back a JSON error, error.response.data will contain it
    console.error(
      '[createRazorpayOrder] Error response from server:',
      error.response?.data || error.message
    );
    throw error;
  }
};
