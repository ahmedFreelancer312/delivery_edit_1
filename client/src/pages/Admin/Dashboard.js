import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalDrivers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRestaurants: 0,
    pendingDrivers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch dashboard data from an API
        // For now, we'll use mock data
        const mockStats = {
          totalUsers: 1250,
          totalRestaurants: 85,
          totalDrivers: 120,
          totalOrders: 3420,
          totalRevenue: 128500,
          pendingRestaurants: 12,
          pendingDrivers: 8
        };
        
        const mockRecentOrders = [
          {
            _id: '1',
            customer: { name: 'أحمد محمد' },
            restaurant: { name: 'مطعم الشام' },
            total: 85,
            status: 'delivered',
            createdAt: '2023-04-01T10:30:00Z'
          },
          {
            _id: '2',
            customer: { name: 'فاطمة علي' },
            restaurant: { name: 'مطعم الزهراء' },
            total: 120,
            status: 'delivering',
            createdAt: '2023-04-01T11:45:00Z'
          },
          {
            _id: '3',
            customer: { name: 'محمد خالد' },
            restaurant: { name: 'مطعم الرياض' },
            total: 65,
            status: 'preparing',
            createdAt: '2023-04-01T12:15:00Z'
          },
          {
            _id: '4',
            customer: { name: 'سارة عبدالله' },
            restaurant: { name: 'مطعم الحمراء' },
            total: 95,
            status: 'confirmed',
            createdAt: '2023-04-01T13:20:00Z'
          },
          {
            _id: '5',
            customer: { name: 'عبدالله سعد' },
            restaurant: { name: 'مطعم النخيل' },
            total: 110,
            status: 'pending',
            createdAt: '2023-04-01T14:30:00Z'
          }
        ];
        
        const mockRecentUsers = [
          {
            _id: '1',
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            role: 'customer',
            createdAt: '2023-04-01T10:30:00Z'
          },
          {
            _id: '2',
            name: 'مطعم الشام',
            email: 'restaurant@example.com',
            role: 'restaurant',
            createdAt: '2023-04-01T11:45:00Z'
          },
          {
            _id: '3',
            name: 'خالد سالم',
            email: 'khaled@example.com',
            role: 'driver',
            createdAt: '2023-04-01T12:15:00Z'
          },
          {
            _id: '4',
            name: 'فاطمة علي',
            email: 'fatima@example.com',
            role: 'customer',
            createdAt: '2023-04-01T13:20:00Z'
          },
          {
            _id: '5',
            name: 'مطعم الزهراء',
            email: 'zahra@example.com',
            role: 'restaurant',
            createdAt: '2023-04-01T14:30:00Z'
          }
        ];
        
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setRecentUsers(mockRecentUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'restaurant': return 'role-restaurant';
      case 'driver': return 'role-driver';
      case 'customer': return 'role-customer';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'أدمن';
      case 'restaurant': return 'مطعم';
      case 'driver': return 'سائق';
      case 'customer': return 'عميل';
      default: return role;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header mb-4">
        <h1>لوحة تحكم الأدمن</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid mb-4">
        <div className="stat-card glass p-4">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>إجمالي المستخدمين</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>{stats.totalRestaurants}</h3>
            <p>إجمالي المطاعم</p>
            {stats.pendingRestaurants > 0 && (
              <span className="badge badge-warning">{stats.pendingRestaurants} في الانتظار</span>
            )}
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <h3>{stats.totalDrivers}</h3>
            <p>إجمالي السائقين</p>
            {stats.pendingDrivers > 0 && (
              <span className="badge badge-warning">{stats.pendingDrivers} في الانتظار</span>
            )}
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>إجمالي الطلبات</p>
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

      <div className="dashboard-content grid">
        {/* Recent Orders */}
        <div className="recent-orders glass p-4">
          <div className="flex justify-between items-center mb-4">
            <h2>الطلبات الأخيرة</h2>
            <Link to="/admin/orders">
              <Button variant="outline">عرض الكل</Button>
            </Link>
          </div>
          
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <span className="order-id">#{order._id.slice(-6)}</span>
                  <span className="order-customer">{order.customer?.name}</span>
                  <span className="order-restaurant">{order.restaurant?.name}</span>
                </div>
                <div className="order-meta">
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="order-total">{order.total} ريال</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="recent-users glass p-4">
          <div className="flex justify-between items-center mb-4">
            <h2>المستخدمون الجدد</h2>
            <Link to="/admin/users">
              <Button variant="outline">عرض الكل</Button>
            </Link>
          </div>
          
          <div className="users-list">
            {recentUsers.map(user => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="user-meta">
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  <span className="user-date">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions grid mt-4">
        <div className="action-card glass p-4">
          <h3>إدارة المستخدمين</h3>
          <p>عرض وإدارة جميع المستخدمين في النظام</p>
          <Link to="/admin/users">
            <Button variant="primary" className="mt-3">
              إدارة المستخدمين
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>إدارة المطاعم</h3>
          <p>عرض وإدارة جميع المطاعم والمنتجات</p>
          <Link to="/admin/restaurants">
            <Button variant="primary" className="mt-3">
              إدارة المطاعم
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>إدارة السائقين</h3>
          <p>عرض وإدارة جميع السائقين</p>
          <Link to="/admin/drivers">
            <Button variant="primary" className="mt-3">
              إدارة السائقين
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>التحليلات والتقارير</h3>
          <p>عرض تحليلات النظام وتقارير الأداء</p>
          <Link to="/admin/analytics">
            <Button variant="primary" className="mt-3">
              عرض التحليلات
            </Button>
          </Link>
        </div>
        
        <div className="action-card glass p-4">
          <h3>إدارة الرسوم</h3>
          <p>تحديد رسوم التوصيل ونسب العمولة</p>
          <Link to="/admin/fees">
            <Button variant="primary" className="mt-3">
              إدارة الرسوم
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;