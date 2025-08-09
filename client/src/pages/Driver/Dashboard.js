import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DriverDashboard = () => {
  const { orders, getDriverOrders, loading, updateOrderStatus } = useOrder();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [stats, setStats] = useState({
    completedOrders: 0,
    totalEarnings: 0,
    averageDeliveryTime: 0
  });

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        await getDriverOrders();
        
        // In a real app, you would fetch stats from the API
        // For now, we'll calculate them from the orders
        const completedOrders = orders.filter(order => order.status === 'delivered');
        const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);
        
        // Calculate average delivery time (mock data)
        const averageDeliveryTime = 25; // minutes
        
        setStats({
          completedOrders: completedOrders.length,
          totalEarnings,
          averageDeliveryTime
        });
        
        // Set available orders (orders that are ready and not assigned to a driver)
        const available = orders.filter(order => order.status === 'ready' && !order.driver);
        setAvailableOrders(available);
        
        // Set current order (orders that are picked_up or delivering)
        const current = orders.find(order => 
          ['picked_up', 'delivering'].includes(order.status) && 
          order.driver?._id === 'current-driver-id' // In a real app, this would be the current driver's ID
        );
        setCurrentOrder(current);
      } catch (error) {
        toast.error(error.message || 'فشل تحميل بيانات لوحة التحكم');
      }
    };

    fetchDriverData();
  }, [getDriverOrders, orders]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'picked_up');
      toast.success('تم قبول الطلب');
      
      // Update current order
      const order = orders.find(o => o._id === orderId);
      if (order) {
        setCurrentOrder({
          ...order,
          status: 'picked_up'
        });
      }
      
      // Remove from available orders
      setAvailableOrders(availableOrders.filter(order => order._id !== orderId));
    } catch (error) {
      toast.error(error.message || 'فشل قبول الطلب');
    }
  };

  const handleStartDelivery = async () => {
    if (!currentOrder) return;
    
    try {
      await updateOrderStatus(currentOrder._id, 'delivering');
      toast.success('بدء التوصيل');
      
      // Update current order
      setCurrentOrder({
        ...currentOrder,
        status: 'delivering'
      });
    } catch (error) {
      toast.error(error.message || 'فشل بدء التوصيل');
    }
  };

  const handleCompleteDelivery = async () => {
    if (!currentOrder) return;
    
    try {
      await updateOrderStatus(currentOrder._id, 'delivered');
      toast.success('تم التوصيل بنجاح');
      
      // Clear current order
      setCurrentOrder(null);
    } catch (error) {
      toast.error(error.message || 'فشل إتمام التوصيل');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'picked_up': return 'status-picked-up';
      case 'delivering': return 'status-delivering';
      case 'delivered': return 'status-delivered';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'تم تأكيد الطلب';
      case 'preparing': return 'قيد التحضير';
      case 'ready': return 'جاهز للتوصيل';
      case 'picked_up': return 'تم الاستلام';
      case 'delivering': return 'في الطريق';
      case 'delivered': return 'تم التوصيل';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1>لوحة تحكم السائق</h1>
        <div className="dashboard-actions">
          <Link to="/driver/orders">
            <Button variant="outline">سجل الطلبات</Button>
          </Link>
          <Link to="/driver/earnings">
            <Button variant="primary">الأرباح</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid mb-4">
        <div className="stat-card glass p-4">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completedOrders}</h3>
            <p>طلبات مكتملة</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.totalEarnings.toFixed(2)} ريال</h3>
            <p>إجمالي الأرباح</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{stats.averageDeliveryTime} دقيقة</h3>
            <p>متوسط وقت التوصيل</p>
          </div>
        </div>
      </div>

      {/* Current Order */}
      {currentOrder && (
        <div className="current-order glass p-4 mb-4">
          <h2>الطلب الحالي</h2>
          <div className="order-details">
            <div className="order-info">
              <p><strong>رقم الطلب:</strong> #{currentOrder._id.slice(-6)}</p>
              <p><strong>المطعم:</strong> {currentOrder.restaurant?.name}</p>
              <p><strong>العميل:</strong> {currentOrder.customer?.name}</p>
              <p><strong>العنوان:</strong> {currentOrder.deliveryAddress}</p>
              <p><strong>قيمة التوصيل:</strong> {currentOrder.deliveryFee} ريال</p>
              <p><strong>الحالة:</strong> 
                <span className={`status-badge ${getStatusBadgeClass(currentOrder.status)} ms-2`}>
                  {getStatusLabel(currentOrder.status)}
                </span>
              </p>
            </div>
            
            <div className="order-actions">
              {currentOrder.status === 'picked_up' && (
                <Button 
                  variant="primary" 
                  onClick={handleStartDelivery}
                  className="w-100 mb-2"
                >
                  بدء التوصيل
                </Button>
              )}
              
              {currentOrder.status === 'delivering' && (
                <Button 
                  variant="success" 
                  onClick={handleCompleteDelivery}
                  className="w-100 mb-2"
                >
                  إتمام التوصيل
                </Button>
              )}
              
              <Link to={`/driver/map/${currentOrder._id}`}>
                <Button variant="outline" className="w-100">
                  عرض الخريطة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Available Orders */}
      <div className="available-orders glass p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2>الطلبات المتاحة</h2>
          <span className="badge">{availableOrders.length} طلب</span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : availableOrders.length === 0 ? (
          <div className="text-center py-4">
            <p>لا توجد طلبات متاحة حالياً</p>
          </div>
        ) : (
          <div className="orders-list">
            {availableOrders.map(order => (
              <div key={order._id} className="order-card glass p-3 mb-3">
                <div className="order-header">
                  <h3>طلب #{order._id.slice(-6)}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                
                <div className="order-info">
                  <p><strong>المطعم:</strong> {order.restaurant?.name}</p>
                  <p><strong>العميل:</strong> {order.customer?.name}</p>
                  <p><strong>العنوان:</strong> {order.deliveryAddress}</p>
                  <p><strong>قيمة التوصيل:</strong> {order.deliveryFee} ريال</p>
                </div>
                
                <div className="order-actions">
                  <Button 
                    variant="primary" 
                    onClick={() => handleAcceptOrder(order._id)}
                    className="w-100"
                  >
                    قبول الطلب
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions grid">
        <div className="action-card glass p-4">
          <h3>سجل الطلبات</h3>
          <p>عرض جميع الطلبات السابقة والحالية</p>
          <Link to="/driver/orders">
            <Button variant="primary" className="mt-3">
              عرض سجل الطلبات
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>الأرباح</h3>
          <p>عرض إجمالي الأرباح وتفاصيل الدفعات</p>
          <Link to="/driver/earnings">
            <Button variant="primary" className="mt-3">
              عرض الأرباح
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;