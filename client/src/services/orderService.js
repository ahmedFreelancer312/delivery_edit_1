import api from "./authService";

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getCustomerOrders: async () => {
    const response = await api.get("/orders/customer");
    return response.data;
  },

  getRestaurantOrders: async () => {
    const response = await api.get("/orders/restaurant");
    return response.data;
  },

  getDriverOrders: async () => {
    const response = await api.get("/orders/driver");
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/accept`);
    return response.data;
  },

  rejectOrder: async (orderId, reason) => {
    const response = await api.put(`/orders/${orderId}/reject`, { reason });
    return response.data;
  },
};
