import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';

const Cart = () => {
  const { cartItems, restaurantId, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    // Fetch restaurant details if we have a restaurant ID
    const fetchRestaurant = async () => {
      if (restaurantId) {
        try {
          // In a real app, you would fetch the restaurant details from an API
          // For now, we'll use a mock object
          setRestaurant({
            _id: restaurantId,
            name: 'مطعم مثال',
            deliveryFee: 10
          });
          setDeliveryFee(10);
        } catch (error) {
          console.error('Error fetching restaurant:', error);
        }
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  const handleClearCart = () => {
    if (window.confirm('هل أنت متأكد من أنك تريد إفراغ السلة؟')) {
      clearCart();
      toast.success('تم إفراغ السلة');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="glass p-5 text-center">
          <h2>سلة التسوق فارغة</h2>
          <p>أضف بعض المنتجات من المطاعم المتاحة</p>
          <Link to="/restaurants">
            <Button variant="primary" className="mt-3">
              تصفح المطاعم
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="mb-4">سلة التسوق</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {restaurant && (
            <div className="restaurant-info glass p-3 mb-4">
              <h3>{restaurant.name}</h3>
              <p>رسوم التوصيل: {deliveryFee} ريال</p>
            </div>
          )}
          
          <div className="items-list">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item glass p-3 mb-3">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">{item.price} ريال</p>
                  <div className="quantity-control">
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="quantity">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="item-total">
                  <p>{(item.price * item.quantity).toFixed(2)} ريال</p>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => removeFromCart(item._id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-actions mt-4">
            <Button variant="outline" onClick={handleClearCart}>
              إفراغ السلة
            </Button>
            <Link to="/restaurants">
              <Button variant="primary">
                إضافة المزيد من المنتجات
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="cart-summary glass p-4">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span>المجموع الفرعي:</span>
            <span>{getCartTotal().toFixed(2)} ريال</span>
          </div>
          <div className="summary-row">
            <span>رسوم التوصيل:</span>
            <span>{deliveryFee.toFixed(2)} ريال</span>
          </div>
          <div className="summary-row total">
            <span>المجموع:</span>
            <span>{(getCartTotal() + deliveryFee).toFixed(2)} ريال</span>
          </div>
          <Button 
            variant="primary" 
            size="large" 
            className="w-100 mt-4"
            onClick={handleCheckout}
          >
            تأكيد الطلب
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;