import React, { createContext, useState, useContext, useEffect } from 'react';
import { orderService } from '../services/orderService';

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.createOrder(orderData);
      setCurrentOrder(response.order);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(orderId);
      setCurrentOrder(response.order);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getCustomerOrders();
      setOrders(response.orders);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getRestaurantOrders();
      setOrders(response.orders);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDriverOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getDriverOrders();
      setOrders(response.orders);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.updateOrderStatus(orderId, status);
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(response.order);
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? response.order : order
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.acceptOrder(orderId);
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(response.order);
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? response.order : order
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.rejectOrder(orderId, reason);
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(response.order);
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? response.order : order
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    createOrder,
    getOrderById,
    getCustomerOrders,
    getRestaurantOrders,
    getDriverOrders,
    updateOrderStatus,
    acceptOrder,
    rejectOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}