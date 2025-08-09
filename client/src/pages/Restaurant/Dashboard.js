import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { restaurantService } from '../../services/restaurantService';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RestaurantDashboard = () => {
  const { orders, getRestaurantOrders, loading, updateOrderStatus } = useOrder();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await getRestaurantOrders();
        
        // In a real app, you would fetch stats from the API
        // For now, we'll calculate them from the orders
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
        ).length;
        const completedOrders = orders.filter(order => order.status === 'delivered').length;
        const totalRevenue = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.subtotal || 0), 0);
        
        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue
        });
        
        // Get recent orders (last 5)
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        toast.error(error.message || 'فشل تحميل بيانات لوحة التحكم');
      }
    };

    fetchDashboardData();
  }, [getRestaurantOrders, orders]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'confirmed');
      toast.success('تم قبول الطلب');
    } catch (error) {
      toast.error(error.message || 'فشل قبول الطلب');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'rejected');
      toast.success('تم رفض الطلب');
    } catch (error) {
      toast.error(error.message || 'فشل رفض الطلب');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('تم تحديث حالة الطلب');
    } catch (error) {
      toast.error(error.message || 'فشل تحديث حالة الطلب');
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
    <div className="restaurant-dashboard">
      <div className="dashboard-header flex justify-between items-center mb-4">
        <h1>لوحة تحكم المطعم</h1>
        <div className="dashboard-actions">
          <Link to="/restaurant/products">
            <Button variant="outline">إدارة المنتجات</Button>
          </Link>
          <Link to="/restaurant/orders">
            <Button variant="primary">جميع الطلبات</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid mb-4">
        <div className="stat-card glass p-4">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>إجمالي الطلبات</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>طلبات قيد الانتظار</p>
          </div>
        </div>
        
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
            <h3>{stats.totalRevenue.toFixed(2)} ريال</h3>
            <p>إجمالي الإيرادات</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders glass p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2>الطلبات الأخيرة</h2>
          <Link to="/restaurant/orders">
            <Button variant="outline">عرض الكل</Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-4">
            <p>لا توجد طلبات حديثة</p>
          </div>
        ) : (
          <div className="orders-table">
            <table className="table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>القيمة</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name}</td>
                    <td>{order.total?.toFixed(2)} ريال</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <div className="order-actions">
                        {order.status === 'pending' && (
                          <>
                            <Button 
                              variant="primary" 
                              size="small"
                              onClick={() => handleAcceptOrder(order._id)}
                              className="me-2"
                            >
                              قبول
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="small"
                              onClick={() => handleRejectOrder(order._id)}
                            >
                              رفض
                            </Button>
                          </>
                        )}
                        
                        {order.status === 'confirmed' && (
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => handleStatusChange(order._id, 'preparing')}
                          >
                            بدء التحضير
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => handleStatusChange(order._id, 'ready')}
                          >
                            جاهز للتوصيل
                          </Button>
                        )}
                        
                        {['ready', 'picked_up', 'delivering', 'delivered'].includes(order.status) && (
                          <Link to={`/restaurant/orders/${order._id}`}>
                            <Button variant="outline" size="small">
                              التفاصيل
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions grid">
        <div className="action-card glass p-4">
          <h3>إدارة المنتجات</h3>
          <p>أضف أو عدل أو احذف المنتجات الخاصة بك</p>
          <Link to="/restaurant/products">
            <Button variant="primary" className="mt-3">
              إدارة المنتجات
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>التحليلات والتقارير</h3>
          <p>عرض تحليلات المبيعات والأداء</p>
          <Link to="/restaurant/analytics">
            <Button variant="primary" className="mt-3">
              عرض التحليلات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;