// src/services/productService.js

import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

const productService = {
  // Fetch all products with optional query parameters
  getProducts: async (params = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error.response?.data || "Failed to fetch products";
    }
  },

  // Fetch a single product by ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error.response?.data || "Failed to fetch product";
    }
  },

  // Create a new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await axios.post(API_URL, productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error.response?.data || "Failed to create product";
    }
  },

  // Update an existing product (Admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error.response?.data || "Failed to update product";
    }
  },

  // Delete a product (Admin only)
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error.response?.data || "Failed to delete product";
    }
  },
};

export default productService;
