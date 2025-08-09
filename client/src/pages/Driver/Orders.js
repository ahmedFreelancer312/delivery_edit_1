import React, { useState, useEffect } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const DriverOrders = () => {
  const { orders, getDriverOrders, loading, updateOrderStatus } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getDriverOrders();
      } catch (error) {
        toast.error(error.message || 'فشل تحميل الطلبات');
      }
    };

    fetchOrders();
  }, [getDriverOrders]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('تم تحديث حالة الطلب');
    } catch (error) {
      toast.error(error.message || 'فشل تحديث حالة الطلب');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="driver-orders">
      <div className="orders-header mb-4">
        <h1>سجل الطلبات</h1>
        
        <div className="orders-filters">
          <div className="filter-group">
            <label>حالة الطلب:</label>
            <select 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الطلبات</option>
              <option value="picked_up">تم الاستلام</option>
              <option value="delivering">في الطريق</option>
              <option value="delivered">تم التوصيل</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredOrders.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد طلبات</h3>
          <p>لا توجد طلبات تطابق معايير التصفية المحددة</p>
        </div>
      ) : (
        <div className="orders-table">
          <table className="table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المطعم</th>
                <th>العميل</th>
                <th>قيمة التوصيل</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.restaurant?.name}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.deliveryFee?.toFixed(2)} ريال</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <div className="order-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleViewOrder(order)}
                        className="me-2"
                      >
                        عرض
                      </Button>
                      
                      {order.status === 'picked_up' && (
                        <Button 
                          variant="primary" 
                          size="small"
                          onClick={() => handleStatusChange(order._id, 'delivering')}
                        >
                          بدء التوصيل
                        </Button>
                      )}
                      
                      {order.status === 'delivering' && (
                        <Button 
                          variant="success" 
                          size="small"
                          onClick={() => handleStatusChange(order._id, 'delivered')}
                        >
                          إتمام التوصيل
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal 
        show={showOrderModal} 
        onClose={() => setShowOrderModal(false)} 
        title={`تفاصيل الطلب #${selectedOrder?._id?.slice(-6)}`}
        size="large"
      >
        {selectedOrder && (
          <div className="order-details">
            <div className="order-info grid">
              <div className="info-section glass p-3">
                <h3>معلومات المطعم</h3>
                <p><strong>الاسم:</strong> {selectedOrder.restaurant?.name}</p>
                <p><strong>العنوان:</strong> {selectedOrder.restaurant?.address}</p>
                <p><strong>الهاتف:</strong> {selectedOrder.restaurant?.phone}</p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات العميل</h3>
                <p><strong>الاسم:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>الهاتف:</strong> {selectedOrder.customer?.phone}</p>
                <p><strong>العنوان:</strong> {selectedOrder.deliveryAddress}</p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات الطلب</h3>
                <p><strong>حالة الطلب:</strong> 
                  <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)} ms-2`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
                <p><strong>تاريخ الطلب:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>قيمة التوصيل:</strong> {selectedOrder.deliveryFee?.toFixed(2)} ريال</p>
              </div>
            </div>
            
            <div className="order-items glass p-3 mt-3">
              <h3>عناصر الطلب</h3>
              <div className="items-list">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.product?.name}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                    </div>
                    <span className="item-price">{(item.price * item.quantity).toFixed(2)} ريال</span>
                  </div>
                ))}
              </div>
              
              <div className="order-summary mt-3">
                <div className="summary-row">
                  <span>المجموع الفرعي:</span>
                  <span>{selectedOrder.subtotal?.toFixed(2)} ريال</span>
                </div>
                <div className="summary-row">
                  <span>رسوم التوصيل:</span>
                  <span>{selectedOrder.deliveryFee?.toFixed(2)} ريال</span>
                </div>
                <div className="summary-row total">
                  <span>المجموع:</span>
                  <span>{selectedOrder.total?.toFixed(2)} ريال</span>
                </div>
              </div>
            </div>
            
            <div className="order-actions mt-4">
              {selectedOrder.status === 'picked_up' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleStatusChange(selectedOrder._id, 'delivering');
                    setShowOrderModal(false);
                  }}
                  className="me-2"
                >
                  بدء التوصيل
                </Button>
              )}
              
              {selectedOrder.status === 'delivering' && (
                <Button 
                  variant="success"
                  onClick={() => {
                    handleStatusChange(selectedOrder._id, 'delivered');
                    setShowOrderModal(false);
                  }}
                  className="me-2"
                >
                  إتمام التوصيل
                </Button>
              )}
              
              <Link to={`/driver/map/${selectedOrder._id}`}>
                <Button variant="outline" className="me-2">
                  عرض الخريطة
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                onClick={() => setShowOrderModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DriverOrders;