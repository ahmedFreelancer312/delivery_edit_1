import api from "./authService";

export const restaurantService = {
  getRestaurants: async (filters = {}) => {
    const response = await api.get("/restaurants", { params: filters });
    return response.data;
  },

  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  getRestaurantProducts: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}/products`);
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await api.post("/restaurants/products", productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(
      `/restaurants/products/${productId}`,
      productData
    );
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/restaurants/products/${productId}`);
    return response.data;
  },

  toggleProductAvailability: async (productId) => {
    const response = await api.put(`/restaurants/products/${productId}/toggle`);
    return response.data;
  },

  getRestaurantAnalytics: async (filters = {}) => {
    const response = await api.get("/restaurants/analytics", {
      params: filters,
    });
    return response.data;
  },
};
