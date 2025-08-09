import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DriverMap = () => {
  const { id } = useParams();
  const { getOrderById, currentOrder, loading } = useOrder();
  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await getOrderById(id);
      } catch (error) {
        toast.error(error.message || 'فشل تحميل الطلب');
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  useEffect(() => {
    // In a real app, you would get the user's current location using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location for demo
          setDriverLocation({
            lat: 24.7136,
            lng: 46.6753
          });
        }
      );
    } else {
      // Use default location for demo
      setDriverLocation({
        lat: 24.7136,
        lng: 46.6753
      });
    }
  }, []);

  useEffect(() => {
    // In a real app, you would get the restaurant and customer locations from the order data
    if (currentOrder) {
      setRestaurantLocation({
        lat: 24.7136,
        lng: 46.6753
      });
      
      setCustomerLocation({
        lat: 24.7236,
        lng: 46.6853
      });
    }
  }, [currentOrder]);

  const handleStartNavigation = () => {
    // In a real app, you would open the device's navigation app
    if (customerLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${customerLocation.lat},${customerLocation.lng}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentOrder) {
    return (
      <div className="driver-map">
        <div className="glass p-5 text-center">
          <h2>الطلب غير موجود</h2>
          <p>يرجى التحقق من رقم الطلب والمحاولة مرة أخرى</p>
          <Button variant="primary" onClick={() => window.history.back()} className="mt-3">
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-map">
      <div className="map-header glass p-3 mb-4">
        <h1>خريطة التوصيل</h1>
        <p>طلب #{currentOrder._id.slice(-6)}</p>
      </div>

      <div className="map-container glass p-4 mb-4">
        <div className="map-placeholder">
          {/* In a real app, you would use a mapping library like Google Maps or Leaflet */}
          <div className="map-image">
            <img src="https://via.placeholder.com/800x400" alt="خريطة التوصيل" />
            
            {driverLocation && (
              <div className="map-marker driver-marker" style={{ top: '40%', left: '40%' }}>
                🚚
              </div>
            )}
            
            {restaurantLocation && (
              <div className="map-marker restaurant-marker" style={{ top: '30%', left: '50%' }}>
                🏪
              </div>
            )}
            
            {customerLocation && (
              <div className="map-marker customer-marker" style={{ top: '60%', left: '60%' }}>
                🏠
              </div>
            )}
          </div>
        </div>
        
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-icon">🚚</span>
            <span>موقعك الحالي</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🏪</span>
            <span>المطعم</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🏠</span>
            <span>العميل</span>
          </div>
        </div>
      </div>

      <div className="order-info glass p-4 mb-4">
        <h3>معلومات الطلب</h3>
        <div className="order-details">
          <div className="detail-item">
            <span className="detail-label">المطعم:</span>
            <span className="detail-value">{currentOrder.restaurant?.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">العميل:</span>
            <span className="detail-value">{currentOrder.customer?.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">العنوان:</span>
            <span className="detail-value">{currentOrder.deliveryAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الهاتف:</span>
            <span className="detail-value">{currentOrder.customer?.phone}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">قيمة التوصيل:</span>
            <span className="detail-value">{currentOrder.deliveryFee} ريال</span>
          </div>
        </div>
      </div>

      <div className="map-actions">
        <Button variant="primary" onClick={handleStartNavigation} className="w-100 mb-3">
          بدء التوجيه
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} className="w-100">
          العودة
        </Button>
      </div>
    </div>
  );
};

export default DriverMap;