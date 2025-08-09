import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    usersStats: {
      total: 0,
      customers: 0,
      restaurants: 0,
      drivers: 0,
      newUsers: []
    },
    ordersStats: {
      total: 0,
      completed: 0,
      cancelled: 0,
      averageOrderValue: 0,
      ordersByStatus: [],
      ordersByDay: [],
      ordersByMonth: []
    },
    revenueStats: {
      total: 0,
      byMonth: [],
      byRestaurant: [],
      byPaymentMethod: []
    },
    topRestaurants: [],
    topProducts: [],
    userActivity: {
      byDay: [],
      byHour: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch analytics data from an API
        // For now, we'll use mock data
        const mockAnalytics = {
          usersStats: {
            total: 1455,
            customers: 1250,
            restaurants: 85,
            drivers: 120,
            newUsers: [
              { date: '2023-04-01', customers: 5, restaurants: 1, drivers: 2 },
              { date: '2023-04-02', customers: 8, restaurants: 0, drivers: 1 },
              { date: '2023-04-03', customers: 6, restaurants: 2, drivers: 0 },
              { date: '2023-04-04', customers: 10, restaurants: 1, drivers: 1 },
              { date: '2023-04-05', customers: 7, restaurants: 0, drivers: 3 },
              { date: '2023-04-06', customers: 9, restaurants: 1, drivers: 0 },
              { date: '2023-04-07', customers: 12, restaurants: 0, drivers: 2 }
            ]
          },
          ordersStats: {
            total: 3420,
            completed: 3100,
            cancelled: 320,
            averageOrderValue: 85.5,
            ordersByStatus: [
              { status: 'pending', count: 45 },
              { status: 'confirmed', count: 120 },
              { status: 'preparing', count: 85 },
              { status: 'ready', count: 65 },
              { status: 'picked_up', count: 55 },
              { status: 'delivering', count: 75 },
              { status: 'delivered', count: 3100 },
              { status: 'rejected', count: 320 }
            ],
            ordersByDay: [
              { date: '2023-04-01', count: 45 },
              { date: '2023-04-02', count: 52 },
              { date: '2023-04-03', count: 48 },
              { date: '2023-04-04', count: 65 },
              { date: '2023-04-05', count: 58 },
              { date: '2023-04-06', count: 72 },
              { date: '2023-04-07', count: 85 }
            ],
            ordersByMonth: [
              { month: 'يناير', count: 980 },
              { month: 'فبراير', count: 1050 },
              { month: 'مارس', count: 1200 },
              { month: 'أبريل', count: 190 }
            ]
          },
          revenueStats: {
            total: 292500,
            byMonth: [
              { month: 'يناير', revenue: 85000 },
              { month: 'فبراير', revenue: 90000 },
              { month: 'مارس', revenue: 95000 },
              { month: 'أبريل', revenue: 22500 }
            ],
            byRestaurant: [
              { name: 'مطعم الشام', revenue: 45000 },
              { name: 'مطعم الزهراء', revenue: 38000 },
              { name: 'مطعم الرياض', revenue: 32000 },
              { name: 'مطعم الحمراء', revenue: 28000 },
              { name: 'سوبر ماركت النخيل', revenue: 25000 }
            ],
            byPaymentMethod: [
              { method: 'cash', revenue: 220000 },
              { method: 'card', revenue: 72500 }
            ]
          },
          topRestaurants: [
            { name: 'مطعم الشام', orders: 530, rating: 4.5 },
            { name: 'مطعم الزهراء', orders: 480, rating: 4.2 },
            { name: 'مطعم الرياض', orders: 420, rating: 4.0 },
            { name: 'مطعم الحمراء', orders: 380, rating: 4.7 },
            { name: 'سوبر ماركت النخيل', orders: 350, rating: 4.3 }
          ],
          topProducts: [
            { name: 'برجر لحم', orders: 850, revenue: 21250 },
            { name: 'بيتزا', orders: 720, revenue: 25200 },
            { name: 'سلطة', orders: 680, revenue: 10200 },
            { name: 'مشروبات', orders: 1200, revenue: 6000 },
            { name: 'حلويات', orders: 450, revenue: 9000 }
          ],
          userActivity: {
            byDay: [
              { day: 'السبت', activeUsers: 450 },
              { day: 'الأحد', activeUsers: 380 },
              { day: 'الاثنين', activeUsers: 320 },
              { day: 'الثلاثاء', activeUsers: 350 },
              { day: 'الأربعاء', activeUsers: 420 },
              { day: 'الخميس', activeUsers: 480 },
              { day: 'الجمعة', activeUsers: 520 }
            ],
            byHour: [
              { hour: '9:00', activeUsers: 120 },
              { hour: '12:00', activeUsers: 350 },
              { hour: '15:00', activeUsers: 280 },
              { hour: '18:00', activeUsers: 420 },
              { hour: '21:00', activeUsers: 380 }
            ]
          }
        };
        
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
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
    <div className="admin-analytics">
      <div className="analytics-header mb-4">
        <h1>التحليلات والتقارير</h1>
        
        <div className="date-range-filters">
          <Button 
            variant={dateRange === 'day' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleDateRangeChange('day')}
            className="me-2"
          >
            يوم
          </Button>
          <Button 
            variant={dateRange === 'week' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleDateRangeChange('week')}
            className="me-2"
          >
            أسبوع
          </Button>
          <Button 
            variant={dateRange === 'month' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleDateRangeChange('month')}
            className="me-2"
          >
            شهر
          </Button>
          <Button 
            variant={dateRange === 'year' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleDateRangeChange('year')}
          >
            سنة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid mb-4">
        <div className="stat-card glass p-4">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{analytics.usersStats.total}</h3>
            <p>إجمالي المستخدمين</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{analytics.ordersStats.total}</h3>
            <p>إجمالي الطلبات</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{analytics.revenueStats.total.toFixed(2)} ريال</h3>
            <p>إجمالي الإيرادات</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{analytics.ordersStats.averageOrderValue.toFixed(2)} ريال</h3>
            <p>متوسط قيمة الطلب</p>
          </div>
        </div>
      </div>

      <div className="analytics-content grid">
        {/* Users Stats */}
        <div className="analytics-card glass p-4">
          <h3>إحصائيات المستخدمين</h3>
          <div className="users-stats-grid grid">
            <div className="user-stat">
              <h4>{analytics.usersStats.customers}</h4>
              <p>عملاء</p>
            </div>
            <div className="user-stat">
              <h4>{analytics.usersStats.restaurants}</h4>
              <p>مطاعم</p>
            </div>
            <div className="user-stat">
              <h4>{analytics.usersStats.drivers}</h4>
              <p>سائقين</p>
            </div>
          </div>
          
          <h4 className="mt-4">المستخدمون الجدد</h4>
          <div className="chart-placeholder">
            <div className="line-chart">
              {analytics.usersStats.newUsers.map((data, index) => (
                <div key={index} className="chart-point">
                  <div className="point-customers" style={{ height: `${(data.customers / 15) * 100}%` }}></div>
                  <div className="point-restaurants" style={{ height: `${(data.restaurants / 5) * 100}%` }}></div>
                  <div className="point-drivers" style={{ height: `${(data.drivers / 5) * 100}%` }}></div>
                  <div className="point-label">{new Date(data.date).toLocaleDateString('ar-SA', { day: 'numeric' })}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color customers-color"></span>
              <span>عملاء</span>
            </div>
            <div className="legend-item">
              <span className="legend-color restaurants-color"></span>
              <span>مطاعم</span>
            </div>
            <div className="legend-item">
              <span className="legend-color drivers-color"></span>
              <span>سائقين</span>
            </div>
          </div>
        </div>

        {/* Orders Stats */}
        <div className="analytics-card glass p-4">
          <h3>إحصائيات الطلبات</h3>
          <div className="orders-stats-grid grid">
            <div className="order-stat">
              <h4>{analytics.ordersStats.completed}</h4>
              <p>طلبات مكتملة</p>
            </div>
            <div className="order-stat">
              <h4>{analytics.ordersStats.cancelled}</h4>
              <p>طلبات ملغاة</p>
            </div>
            <div className="order-stat">
              <h4>{((analytics.ordersStats.completed / analytics.ordersStats.total) * 100).toFixed(1)}%</h4>
              <p>معدل الإنجاز</p>
            </div>
          </div>
          
          <h4 className="mt-4">الطلبات حسب الحالة</h4>
          <div className="chart-placeholder">
            <div className="pie-chart">
              {analytics.ordersStats.ordersByStatus.map((data, index) => (
                <div key={index} className="pie-segment" style={{ 
                  width: `${(data.count / analytics.ordersStats.total) * 100}%`,
                  backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                }}></div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            {analytics.ordersStats.ordersByStatus.map((data, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}></span>
                <span>{data.status}: {data.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="analytics-card glass p-4">
          <h3>إحصائيات الإيرادات</h3>
          <h4>الإيرادات الشهرية</h4>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {analytics.revenueStats.byMonth.map((data, index) => (
                <div key={index} className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${(data.revenue / 100000) * 100}%` }}
                  ></div>
                  <div className="bar-label">{data.month}</div>
                  <div className="bar-value">{data.revenue} ريال</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="analytics-card glass p-4">
          <h3>أفضل المطاعم</h3>
          <div className="top-list">
            {analytics.topRestaurants.map((restaurant, index) => (
              <div key={index} className="top-item">
                <div className="top-rank">{index + 1}</div>
                <div className="top-info">
                  <div className="top-name">{restaurant.name}</div>
                  <div className="top-meta">
                    <span>{restaurant.orders} طلب</span>
                    <span>⭐ {restaurant.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-card glass p-4">
          <h3>المنتجات الأكثر مبيعًا</h3>
          <div className="top-list">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="top-item">
                <div className="top-rank">{index + 1}</div>
                <div className="top-info">
                  <div className="top-name">{product.name}</div>
                  <div className="top-meta">
                    <span>{product.orders} طلب</span>
                    <span>{product.revenue} ريال</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="analytics-card glass p-4">
          <h3>نشاط المستخدمين</h3>
          <h4>نشاط المستخدمين حسب اليوم</h4>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {analytics.userActivity.byDay.map((data, index) => (
                <div key={index} className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${(data.activeUsers / 600) * 100}%` }}
                  ></div>
                  <div className="bar-label">{data.day}</div>
                  <div className="bar-value">{data.activeUsers}</div>
                </div>
              ))}
            </div>
          </div>
          
          <h4 className="mt-4">نشاط المستخدمين حسب الساعة</h4>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {analytics.userActivity.byHour.map((data, index) => (
                <div key={index} className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${(data.activeUsers / 500) * 100}%` }}
                  ></div>
                  <div className="bar-label">{data.hour}</div>
                  <div className="bar-value">{data.activeUsers}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;