import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DriverEarnings = () => {
  const [earnings, setEarnings] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    totalEarnings: 0,
    currentMonthEarnings: 0,
    todayEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch earnings data from an API
        // For now, we'll use mock data
        const mockEarnings = {
          daily: [
            { date: '2023-01-01', earnings: 50 },
            { date: '2023-01-02', earnings: 75 },
            { date: '2023-01-03', earnings: 60 },
            { date: '2023-01-04', earnings: 80 },
            { date: '2023-01-05', earnings: 90 },
            { date: '2023-01-06', earnings: 70 },
            { date: '2023-01-07', earnings: 85 }
          ],
          weekly: [
            { week: 'الأسبوع 1', earnings: 350 },
            { week: 'الأسبوع 2', earnings: 420 },
            { week: 'الأسبوع 3', earnings: 380 },
            { week: 'الأسبوع 4', earnings: 450 }
          ],
          monthly: [
            { month: 'يناير', earnings: 1600 },
            { month: 'فبراير', earnings: 1750 },
            { month: 'مارس', earnings: 1900 },
            { month: 'أبريل', earnings: 1800 }
          ],
          totalEarnings: 7050,
          currentMonthEarnings: 1800,
          todayEarnings: 85
        };
        
        setEarnings(mockEarnings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
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
    <div className="driver-earnings">
      <div className="earnings-header mb-4">
        <h1>الأرباح</h1>
        
        <div className="time-range-filters">
          <Button 
            variant={timeRange === 'day' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleTimeRangeChange('day')}
            className="me-2"
          >
            يومي
          </Button>
          <Button 
            variant={timeRange === 'week' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleTimeRangeChange('week')}
            className="me-2"
          >
            أسبوعي
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'primary' : 'outline'}
            size="small"
            onClick={() => handleTimeRangeChange('month')}
          >
            شهري
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid mb-4">
        <div className="stat-card glass p-4">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{earnings.totalEarnings.toFixed(2)} ريال</h3>
            <p>إجمالي الأرباح</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{earnings.currentMonthEarnings.toFixed(2)} ريال</h3>
            <p>أرباح هذا الشهر</p>
          </div>
        </div>
        
        <div className="stat-card glass p-4">
          <div className="stat-icon">📆</div>
          <div className="stat-info">
            <h3>{earnings.todayEarnings.toFixed(2)} ريال</h3>
            <p>أرباح اليوم</p>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="earnings-chart glass p-4 mb-4">
        <h3>
          {timeRange === 'day' && 'الأرباح اليومية'}
          {timeRange === 'week' && 'الأرباح الأسبوعية'}
          {timeRange === 'month' && 'الأرباح الشهرية'}
        </h3>
        <div className="chart-placeholder">
          {/* In a real app, you would use a charting library like Chart.js or Recharts */}
          <div className="bar-chart">
            {(timeRange === 'day' ? earnings.daily : 
              timeRange === 'week' ? earnings.weekly : 
              earnings.monthly).map((data, index) => (
              <div key={index} className="bar">
                <div 
                  className="bar-fill" 
                  style={{ height: `${(data.earnings / 2000) * 100}%` }}
                ></div>
                <div className="bar-label">
                  {timeRange === 'day' ? new Date(data.date).toLocaleDateString('ar-SA', { day: 'numeric' }) :
                   timeRange === 'week' ? data.week :
                   data.month}
                </div>
                <div className="bar-value">{data.earnings} ريال</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Details */}
      <div className="earnings-details glass p-4">
        <h3>تفاصيل الأرباح</h3>
        
        <div className="earnings-table">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>عدد الطلبات</th>
                <th>متوسط رسوم التوصيل</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {/* In a real app, you would fetch detailed earnings data from an API */}
              <tr>
                <td>2023-04-01</td>
                <td>8</td>
                <td>12.5 ريال</td>
                <td>100 ريال</td>
              </tr>
              <tr>
                <td>2023-04-02</td>
                <td>6</td>
                <td>12.5 ريال</td>
                <td>75 ريال</td>
              </tr>
              <tr>
                <td>2023-04-03</td>
                <td>7</td>
                <td>12.5 ريال</td>
                <td>87.5 ريال</td>
              </tr>
              <tr>
                <td>2023-04-04</td>
                <td>9</td>
                <td>12.5 ريال</td>
                <td>112.5 ريال</td>
              </tr>
              <tr>
                <td>2023-04-05</td>
                <td>5</td>
                <td>12.5 ريال</td>
                <td>62.5 ريال</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="earnings-summary mt-4">
          <div className="summary-row">
            <span>إجمالي الطلبات:</span>
            <span>35 طلب</span>
          </div>
          <div className="summary-row">
            <span>متوسط رسوم التوصيل:</span>
            <span>12.5 ريال</span>
          </div>
          <div className="summary-row total">
            <span>إجمالي الأرباح:</span>
            <span>437.5 ريال</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;