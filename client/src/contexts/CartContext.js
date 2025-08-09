import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const { items, restaurant, delivery } = JSON.parse(savedCart);
      setCartItems(items);
      setRestaurantId(restaurant);
      setDeliveryFee(delivery);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify({
        items: cartItems,
        restaurant: restaurantId,
        delivery: deliveryFee
      }));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems, restaurantId, deliveryFee]);

  const addToCart = (product, quantity = 1) => {
    if (restaurantId && restaurantId !== product.restaurant) {
      alert('لا يمكنك إضافة منتجات من مطاعم مختلفة في نفس الطلب');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    if (!restaurantId) {
      setRestaurantId(product.restaurant);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    
    if (cartItems.length === 1) {
      setRestaurantId(null);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setDeliveryFee(0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    restaurantId,
    deliveryFee,
    setDeliveryFee,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}