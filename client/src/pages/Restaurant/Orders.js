import React, { useState, useEffect } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const RestaurantOrders = () => {
  const { orders, getRestaurantOrders, loading, updateOrderStatus } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getRestaurantOrders();
      } catch (error) {
        toast.error(error.message || 'فشل تحميل الطلبات');
      }
    };

    fetchOrders();
  }, [getRestaurantOrders]);

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
    <div className="restaurant-orders">
      <div className="orders-header mb-4">
        <h1>إدارة الطلبات</h1>
        
        <div className="orders-filters">
          <div className="filter-group">
            <label>حالة الطلب:</label>
            <select 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">تم تأكيد الطلب</option>
              <option value="preparing">قيد التحضير</option>
              <option value="ready">جاهز للتوصيل</option>
              <option value="picked_up">تم الاستلام</option>
              <option value="delivering">في الطريق</option>
              <option value="delivered">تم التوصيل</option>
              <option value="rejected">مرفوض</option>
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
                <th>العميل</th>
                <th>القيمة</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.total?.toFixed(2)} ريال</td>
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
                      
                      {order.status === 'pending' && (
                        <>
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => handleStatusChange(order._id, 'confirmed')}
                            className="me-2"
                          >
                            قبول
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => handleStatusChange(order._id, 'rejected')}
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
                <h3>معلومات العميل</h3>
                <p><strong>الاسم:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>الهاتف:</strong> {selectedOrder.customer?.phone}</p>
                <p><strong>البريد الإلكتروني:</strong> {selectedOrder.customer?.email}</p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات الطلب</h3>
                <p><strong>حالة الطلب:</strong> 
                  <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)} ms-2`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
                <p><strong>تاريخ الطلب:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>طريقة الدفع:</strong> الدفع عند الاستلام</p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات التوصيل</h3>
                <p><strong>العنوان:</strong> {selectedOrder.deliveryAddress}</p>
                {selectedOrder.deliveryInstructions && (
                  <p><strong>ملاحظات:</strong> {selectedOrder.deliveryInstructions}</p>
                )}
                <p><strong>وقت التوصيل المتوقع:</strong> {selectedOrder.estimatedDeliveryTime} دقيقة</p>
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
            
            {selectedOrder.driver && (
              <div className="driver-info glass p-3 mt-3">
                <h3>معلومات السائق</h3>
                <div className="driver-details">
                  <div className="driver-avatar">
                    <img src={selectedOrder.driver.avatar || 'https://via.placeholder.com/50'} alt={selectedOrder.driver.name} />
                  </div>
                  <div className="driver-info-text">
                    <p><strong>الاسم:</strong> {selectedOrder.driver.name}</p>
                    <p><strong>الهاتف:</strong> {selectedOrder.driver.phone}</p>
                    <p><strong>المركبة:</strong> {selectedOrder.driver.vehicleType} - {selectedOrder.driver.vehicleColor}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="order-actions mt-4">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button 
                    variant="primary"
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, 'confirmed');
                      setShowOrderModal(false);
                    }}
                    className="me-2"
                  >
                    قبول الطلب
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, 'rejected');
                      setShowOrderModal(false);
                    }}
                  >
                    رفض الطلب
                  </Button>
                </>
              )}
              
              {selectedOrder.status === 'confirmed' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleStatusChange(selectedOrder._id, 'preparing');
                    setShowOrderModal(false);
                  }}
                >
                  بدء التحضير
                </Button>
              )}
              
              {selectedOrder.status === 'preparing' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleStatusChange(selectedOrder._id, 'ready');
                    setShowOrderModal(false);
                  }}
                >
                  جاهز للتوصيل
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => setShowOrderModal(false)}
                className="ms-2"
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

export default RestaurantOrders;