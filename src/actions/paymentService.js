// src/services/paymentService.js
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/payment`;

export async function createRazorpayOrder(orderId, amount) {
  const resp = await axios.post(`${API}/create-order`, { orderId, amount });
  return resp.data.data;   // { key, order }
}

export async function verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const resp = await axios.post(`${API}/verify`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return resp.data.valid;  // true|false
}

export async function getPaymentStatus(orderId) {
  const resp = await axios.get(`${API}/status/${orderId}`);
  return resp.data.status; // "created","paid","failed"
}
