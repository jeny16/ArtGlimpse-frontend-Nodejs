// src/redux/services/cartService.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/cart' });

export const getCartByUserId = async (userId) => {
  const res = await API.get(`/${userId}`);
  return res.data;
};

export const addItemToCart = async (userId, productId, quantity, price) => {
  const res = await API.post(`/${userId}/add`, {
    userId,
    productId,
    quantity,
    price
  });
  return res.data;
};

export const updateItemQuantity = async (userId, productId, quantity) => {
  const res = await API.put(`/${userId}/${productId}`, { quantity });
  return res.data;
};

export const deleteItemFromCart = async (userId, productId) => {
  const res = await API.delete(`/${userId}/${productId}`);
  return res.data;
};

export const clearCart = async (userId) => {
  if(!userId){
    console.log("userId is not Found")
  }
  const res = await API.delete(`/${userId}`)  // or `/clear/${userId}` depending on your backend
  return res.data
}

export default {
  getCartByUserId,
  addItemToCart,
  updateItemQuantity,
  deleteItemFromCart,
  clearCart
};
