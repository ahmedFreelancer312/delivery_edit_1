import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OrderTracking = () => {
  const { id } = useParams();
  const { getOrderById, currentOrder, loading } = useOrder();
  const [orderStatus, setOrderStatus] = useState('');
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await getOrderById(id);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  useEffect(() => {
    // In a real app, you would set up a WebSocket connection to get real-time updates
    // For now, we'll just update the status based on the current order
    if (currentOrder) {
      setOrderStatus(currentOrder.status);
      
      // Mock driver location
      if (currentOrder.driver) {
        setDriverLocation({
          lat: 24.7136,
          lng: 46.6753
        });
      }
    }
  }, [currentOrder]);

  const getStatusSteps = () => {
    return [
      { id: 'pending', label: 'قيد الانتظار', icon: '🕒' },
      { id: 'confirmed', label: 'تم تأكيد الطلب', icon: '✅' },
      { id: 'preparing', label: 'قيد التحضير', icon: '🍳' },
      { id: 'ready', label: 'جاهز للتوصيل', icon: '📦' },
      { id: 'picked_up', label: 'تم الاستلام', icon: '🚚' },
      { id: 'delivering', label: 'في الطريق', icon: '🛣️' },
      { id: 'delivered', label: 'تم التوصيل', icon: '🏠' }
    ];
  };

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps();
    const currentIndex = steps.findIndex(step => step.id === orderStatus);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentOrder) {
    return (
      <div className="order-tracking-page">
        <div className="glass p-5 text-center">
          <h2>الطلب غير موجود</h2>
          <p>يرجى التحقق من رقم الطلب والمحاولة مرة أخرى</p>
          <Link to="/">
            <Button variant="primary" className="mt-3">
              العودة إلى الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="order-header glass p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1>طلب رقم #{currentOrder._id.slice(-6)}</h1>
            <p>مطعم: {currentOrder.restaurant?.name}</p>
          </div>
          <div className="order-status">
            <span className={`status-badge status-${orderStatus}`}>
              {getStatusSteps().find(step => step.id === orderStatus)?.label || orderStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="tracking-container">
        <div className="order-progress glass p-4 mb-4">
          <h3>حالة الطلب</h3>
          <div className="progress-steps">
            {getStatusSteps().map((step, index) => (
              <div 
                key={step.id} 
                className={`progress-step ${index <= getCurrentStepIndex() ? 'active' : ''} ${index === getCurrentStepIndex() ? 'current' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-label">{step.label}</div>
                {index < getStatusSteps().length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="order-details glass p-4 mb-4">
          <h3>تفاصيل الطلب</h3>
          <div className="order-items">
            {currentOrder.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product?.name}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                </div>
                <span className="item-price">{(item.price * item.quantity).toFixed(2)} ريال</span>
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span>المجموع الفرعي:</span>
              <span>{currentOrder.subtotal?.toFixed(2)} ريال</span>
            </div>
            <div className="summary-row">
              <span>رسوم التوصيل:</span>
              <span>{currentOrder.deliveryFee?.toFixed(2)} ريال</span>
            </div>
            <div className="summary-row total">
              <span>المجموع:</span>
              <span>{currentOrder.total?.toFixed(2)} ريال</span>
            </div>
          </div>
          
          <div className="delivery-info">
            <p><strong>عنوان التوصيل:</strong> {currentOrder.deliveryAddress}</p>
            {currentOrder.deliveryInstructions && (
              <p><strong>ملاحظات التوصيل:</strong> {currentOrder.deliveryInstructions}</p>
            )}
            <p><strong>وقت التوصيل المتوقع:</strong> {currentOrder.estimatedDeliveryTime} دقيقة</p>
            <p><strong>طريقة الدفع:</strong> الدفع عند الاستلام</p>
          </div>
        </div>

        {currentOrder.driver && (
          <div className="driver-info glass p-4 mb-4">
            <h3>معلومات السائق</h3>
            <div className="driver-details">
              <div className="driver-avatar">
                <img src={currentOrder.driver.avatar || 'https://via.placeholder.com/50'} alt={currentOrder.driver.name} />
              </div>
              <div className="driver-info-text">
                <p><strong>الاسم:</strong> {currentOrder.driver.name}</p>
                <p><strong>رقم الهاتف:</strong> {currentOrder.driver.phone}</p>
                <p><strong>المركبة:</strong> {currentOrder.driver.vehicleType} - {currentOrder.driver.vehicleColor}</p>
              </div>
            </div>
            
            <div className="driver-actions mt-3">
              <Button variant="primary" className="me-2">
                <i className="fas fa-phone"></i> اتصال
              </Button>
              <Button variant="outline">
                <i className="fas fa-comment"></i> رسالة
              </Button>
            </div>
          </div>
        )}

        <div className="map-container glass p-4 mb-4">
          <h3>تتبع الطلب</h3>
          <div className="map-placeholder">
            {/* In a real app, you would use a mapping library like Google Maps or Leaflet */}
            <div className="map-image">
              <img src="https://via.placeholder.com/800x400" alt="خريطة التتبع" />
              {driverLocation && (
                <div className="driver-marker" style={{ top: '50%', left: '50%' }}>
                  🚚
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-actions">
          <Link to="/">
            <Button variant="outline">
              العودة إلى الرئيسية
            </Button>
          </Link>
          <Link to="/restaurants">
            <Button variant="primary">
              طلب المزيد
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;