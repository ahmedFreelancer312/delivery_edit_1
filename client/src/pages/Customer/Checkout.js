import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Checkout = () => {
  const { cartItems, restaurantId, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('45');
  const [loading, setLoading] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [useGPS, setUseGPS] = useState(false);

  useEffect(() => {
    // Fetch user addresses if available
    if (currentUser && currentUser.addresses) {
      setUserAddresses(currentUser.addresses);
      if (currentUser.addresses.length > 0) {
        setSelectedAddress(currentUser.addresses[0]);
        setDeliveryAddress(currentUser.addresses[0]);
      }
    }
  }, [currentUser]);

  const handleAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
    setSelectedAddress(e.target.value);
  };

  const handleUseGPS = () => {
    setUseGPS(!useGPS);
    if (!useGPS) {
      // In a real app, you would get the user's current location using the Geolocation API
      // For now, we'll just use a placeholder
      setDeliveryAddress('الموقع الحالي (تم تحديده عبر GPS)');
      setSelectedAddress('الموقع الحالي (تم تحديده عبر GPS)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress) {
      toast.error('يرجى إدخال عنوان التوصيل');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('سلة التسوق فارغة');
      navigate('/cart');
      return;
    }
    
    try {
      setLoading(true);
      
      const orderData = {
        restaurant: restaurantId,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: getCartTotal(),
        deliveryFee,
        total: getCartTotal() + deliveryFee,
        deliveryAddress,
        deliveryInstructions,
        estimatedDeliveryTime,
        paymentMethod: 'cash'
      };
      
      const response = await createOrder(orderData);
      
      toast.success('تم إنشاء الطلب بنجاح');
      clearCart();
      navigate(`/order-tracking/${response.order._id}`);
    } catch (error) {
      toast.error(error.message || 'فشل إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="glass p-5 text-center">
          <h2>سلة التسوق فارغة</h2>
          <p>أضف بعض المنتجات من المطاعم المتاحة</p>
          <Button variant="primary" onClick={() => navigate('/restaurants')} className="mt-3">
            تصفح المطاعم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="mb-4">تأكيد الطلب</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="checkout-container">
          <div className="checkout-form">
            <div className="glass p-4 mb-4">
              <h3>عنوان التوصيل</h3>
              
              {userAddresses.length > 0 && (
                <div className="saved-addresses mb-3">
                  <h4>العناوين المحفوظة</h4>
                  <div className="addresses-list">
                    {userAddresses.map((address, index) => (
                      <div 
                        key={index} 
                        className={`address-item ${selectedAddress === address ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setDeliveryAddress(address);
                        }}
                      >
                        {address}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>عنوان التوصيل</label>
                <textarea
                  className="form-control"
                  value={deliveryAddress}
                  onChange={handleAddressChange}
                  rows={3}
                  placeholder="أدخل عنوان التوصيل الكامل"
                  required
                />
              </div>
              
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="useGPS"
                  checked={useGPS}
                  onChange={handleUseGPS}
                />
                <label className="form-check-label" htmlFor="useGPS">
                  استخدام الموقع الحالي
                </label>
              </div>
              
              <div className="form-group">
                <label>ملاحظات التوصيل (اختياري)</label>
                <textarea
                  className="form-control"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  rows={2}
                  placeholder="أي ملاحظات خاصة بالتوصيل"
                />
              </div>
            </div>
            
            <div className="glass p-4 mb-4">
              <h3>طريقة الدفع</h3>
              <div className="payment-methods">
                <div className="payment-method selected">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked
                      readOnly
                    />
                    <label className="form-check-label" htmlFor="cash">
                      الدفع عند الاستلام
                    </label>
                  </div>
                  <p>ادفع نقدًا عند استلام الطلب</p>
                </div>
              </div>
            </div>
            
            <div className="glass p-4">
              <h3>تفاصيل الطلب</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                    </div>
                    <span className="item-price">{(item.price * item.quantity).toFixed(2)} ريال</span>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
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
              </div>
              
              <div className="delivery-info">
                <p>وقت التوصيل المتوقع: {estimatedDeliveryTime} دقيقة</p>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={loading}
                className="w-100 mt-4"
              >
                {loading ? <LoadingSpinner size="small" /> : 'تأكيد الطلب'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;