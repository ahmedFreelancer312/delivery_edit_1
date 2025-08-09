import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RestaurantAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    salesData: [],
    topProducts: [],
    orderStats: {
      totalOrders: 0,
      averageOrderValue: 0,
      totalRevenue: 0
    },
    timeStats: {
      peakHours: [],
      peakDays: []
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
          salesData: [
            { date: '2023-01-01', sales: 1200 },
            { date: '2023-01-02', sales: 1900 },
            { date: '2023-01-03', sales: 1500 },
            { date: '2023-01-04', sales: 1800 },
            { date: '2023-01-05', sales: 2100 },
            { date: '2023-01-06', sales: 2500 },
            { date: '2023-01-07', sales: 2200 }
          ],
          topProducts: [
            { name: 'برجر لحم', orders: 45, revenue: 1125 },
            { name: 'بيتزا', orders: 32, revenue: 1120 },
            { name: 'سلطة', orders: 28, revenue: 420 },
            { name: 'مشروبات', orders: 50, revenue: 250 },
            { name: 'حلويات', orders: 20, revenue: 400 }
          ],
          orderStats: {
            totalOrders: 175,
            averageOrderValue: 42.5,
            totalRevenue: 7437.5
          },
          timeStats: {
            peakHours: [
              { hour: '12:00', orders: 25 },
              { hour: '13:00', orders: 45 },
              { hour: '14:00', orders: 35 },
              { hour: '19:00', orders: 40 },
              { hour: '20:00', orders: 50 },
              { hour: '21:00', orders: 30 }
            ],
            peakDays: [
              { day: 'السبت', orders: 35 },
              { day: 'الأحد', orders: 25 },
              { day: 'الاثنين', orders: 20 },
              { day: 'الثلاثاء', orders: 22 },
              { day: 'الأربعاء', orders: 28 },
              { day: 'الخميس', orders: 30 },
              { day: 'الجمعة', orders: 35 }
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
    <div className="restaurant-analytics">
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
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{analytics.orderStats.totalOrders}</h3>
            <p>إجمالي الطلبات</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{analytics.orderStats.totalRevenue.toFixed(2)} ريال</h3>
            <p>إجمالي الإيرادات</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{analytics.orderStats.averageOrderValue.toFixed(2)} ريال</h3>
            <p>متوسط قيمة الطلب</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid grid mb-4">
        <div className="chart-card glass p-4">
          <h3>المبيعات</h3>
          <div className="chart-placeholder">
            {/* In a real app, you would use a charting library like Chart.js or Recharts */}
            <div className="bar-chart">
              {analytics.salesData.map((data, index) => (
                <div key={index} className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${(data.sales / 3000) * 100}%` }}
                  ></div>
                  <div className="bar-label">{new Date(data.date).toLocaleDateString('ar-SA', { weekday: 'short' })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="chart-card glass p-4">
          <h3>المنتجات الأكثر مبيعًا</h3>
          <div className="top-products">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="top-product">
                <div className="product-info">
                  <span className="product-rank">{index + 1}</span>
                  <span className="product-name">{product.name}</span>
                </div>
                <div className="product-stats">
                  <span>{product.orders} طلب</span>
                  <span>{product.revenue} ريال</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Stats */}
      <div className="time-stats-grid grid">
        <div className="time-stats-card glass p-4">
          <h3>ساعات الذروة</h3>
          <div className="time-chart">
            {analytics.timeStats.peakHours.map((hour, index) => (
              <div key={index} className="time-bar">
                <div 
                  className="time-bar-fill" 
                  style={{ height: `${(hour.orders / 60) * 100}%` }}
                ></div>
                <div className="time-bar-label">{hour.hour}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="time-stats-card glass p-4">
          <h3>أيام الذروة</h3>
          <div className="time-chart">
            {analytics.timeStats.peakDays.map((day, index) => (
              <div key={index} className="time-bar">
                <div 
                  className="time-bar-fill" 
                  style={{ height: `${(day.orders / 60) * 100}%` }}
                ></div>
                <div className="time-bar-label">{day.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAnalytics;