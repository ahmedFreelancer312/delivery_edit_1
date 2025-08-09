import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ title: '', message: '', action: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    category: '',
    deliveryFee: '',
    deliveryTime: '',
    image: '',
    status: 'pending'
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch restaurants from an API
        // For now, we'll use mock data
        const mockRestaurants = [
          {
            _id: '1',
            name: 'مطعم الشام',
            email: 'sham@example.com',
            phone: '0501112233',
            address: 'شارع الملك فهد، الرياض',
            description: 'مطعم سوري أصيل يقدم أشهى الأطباق السورية',
            category: 'مطاعم',
            deliveryFee: 10,
            deliveryTime: 45,
            rating: 4.5,
            status: 'active',
            createdAt: '2023-01-10T09:15:00Z',
            owner: {
              name: 'أحمد محمد',
              email: 'ahmed@example.com'
            }
          },
          {
            _id: '2',
            name: 'مطعم الزهراء',
            email: 'zahra@example.com',
            phone: '0504445566',
            address: 'شارع الأمير محمد، الرياض',
            description: 'مطعم يقدم المأكولات البحرية الطازجة',
            category: 'مطاعم',
            deliveryFee: 15,
            deliveryTime: 60,
            rating: 4.2,
            status: 'pending',
            createdAt: '2023-03-05T14:20:00Z',
            owner: {
              name: 'محمد علي',
              email: 'mohamed@example.com'
            }
          },
          {
            _id: '3',
            name: 'سوبر ماركت النخيل',
            email: 'nakheel@example.com',
            phone: '0507778899',
            address: 'شارع العليا، الرياض',
            description: 'سوبر ماركت يقدم جميع المنتجات الغذائية والاستهلاكية',
            category: 'سوبر ماركت',
            deliveryFee: 20,
            deliveryTime: 90,
            rating: 4.0,
            status: 'active',
            createdAt: '2023-02-15T16:30:00Z',
            owner: {
              name: 'خالد سالم',
              email: 'khaled@example.com'
            }
          },
          {
            _id: '4',
            name: 'مخبز الحمراء',
            email: 'hamra@example.com',
            phone: '0501237890',
            address: 'شارع التحلية، الرياض',
            description: 'مخبز يقدم الخبز الطازج والمعجنات العربية',
            category: 'مخبز',
            deliveryFee: 5,
            deliveryTime: 30,
            rating: 4.7,
            status: 'active',
            createdAt: '2023-01-25T11:45:00Z',
            owner: {
              name: 'عبدالله سعد',
              email: 'abdullah@example.com'
            }
          }
        ];
        
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let result = restaurants;
    
    if (searchTerm) {
      result = result.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.phone.includes(searchTerm) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(restaurant => restaurant.status === statusFilter);
    }
    
    setFilteredRestaurants(result);
  }, [restaurants, searchTerm, statusFilter]);

  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(true);
  };

  const handleToggleRestaurantStatus = (restaurant) => {
    const action = restaurant.status === 'active' ? 'تعطيل' : 'تفعيل';
    setConfirmAction({
      title: `${action} المطعم`,
      message: `هل أنت متأكد من أنك تريد ${action} المطعم ${restaurant.name}؟`,
      action: () => {
        const updatedRestaurants = restaurants.map(r =>
          r._id === restaurant._id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
        );
        setRestaurants(updatedRestaurants);
        setShowConfirmModal(false);
        toast.success(`تم ${action} المطعم بنجاح`);
      }
    });
    setShowConfirmModal(true);
  };

  const handleApproveRestaurant = (restaurant) => {
    setConfirmAction({
      title: 'الموافقة على المطعم',
      message: `هل أنت متأكد من أنك تريد الموافقة على مطعم ${restaurant.name}؟`,
      action: () => {
        const updatedRestaurants = restaurants.map(r =>
          r._id === restaurant._id ? { ...r, status: 'active' } : r
        );
        setRestaurants(updatedRestaurants);
        setShowConfirmModal(false);
        toast.success('تمت الموافقة على المطعم بنجاح');
      }
    });
    setShowConfirmModal(true);
  };

  const handleDeleteRestaurant = (restaurant) => {
    setConfirmAction({
      title: 'حذف المطعم',
      message: `هل أنت متأكد من أنك تريد حذف مطعم ${restaurant.name}؟ لا يمكن التراجع عن هذا الإجراء.`,
      action: () => {
        const updatedRestaurants = restaurants.filter(r => r._id !== restaurant._id);
        setRestaurants(updatedRestaurants);
        setShowConfirmModal(false);
        toast.success('تم حذف المطعم بنجاح');
      }
    });
    setShowConfirmModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send the data to an API
      const newRestaurant = {
        ...formData,
        _id: Date.now().toString(),
        rating: 0,
        owner: {
          name: formData.name,
          email: formData.email
        }
      };
      
      setRestaurants([...restaurants, newRestaurant]);
      setShowAddModal(false);
      toast.success('تمت إضافة المطعم بنجاح');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        category: '',
        deliveryFee: '',
        deliveryTime: '',
        image: '',
        status: 'pending'
      });
    } catch (error) {
      toast.error(error.message || 'فشل إضافة المطعم');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-restaurants">
      <div className="restaurants-header mb-4">
        <div className="flex justify-between items-center">
          <h1>إدارة المطاعم</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            إضافة مطعم جديد
          </Button>
        </div>
        
        <div className="restaurants-filters">
          <Input
            type="text"
            placeholder="بحث عن مطعم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="filter-group">
            <select 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
            إعادة المحاولة
          </Button>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد مطاعم</h3>
          <p>لا توجد مطاعم تطابق معايير التصفية المحددة</p>
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="mt-3">
            إضافة مطعم جديد
          </Button>
        </div>
      ) : (
        <div className="restaurants-table">
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>الفئة</th>
                <th>رسوم التوصيل</th>
                <th>التقييم</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map(restaurant => (
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.email}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.category}</td>
                  <td>{restaurant.deliveryFee} ريال</td>
                  <td>
                    <div className="rating">
                      <span>⭐ {restaurant.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(restaurant.status)}`}>
                      {getStatusLabel(restaurant.status)}
                    </span>
                  </td>
                  <td>{formatDate(restaurant.createdAt)}</td>
                  <td>
                    <div className="restaurant-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleViewRestaurant(restaurant)}
                        className="me-2"
                      >
                        عرض
                      </Button>
                      
                      {restaurant.status === 'pending' && (
                        <Button 
                          variant="primary" 
                          size="small"
                          onClick={() => handleApproveRestaurant(restaurant)}
                          className="me-2"
                        >
                          موافقة
                        </Button>
                      )}
                      
                      {restaurant.status !== 'pending' && (
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => handleToggleRestaurantStatus(restaurant)}
                          className={restaurant.status === 'active' ? 'warning' : 'success'}
                        >
                          {restaurant.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDeleteRestaurant(restaurant)}
                      >
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restaurant Details Modal */}
      <Modal 
        show={showRestaurantModal} 
        onClose={() => setShowRestaurantModal(false)} 
        title={`تفاصيل المطعم - ${selectedRestaurant?.name}`}
        size="large"
      >
        {selectedRestaurant && (
          <div className="restaurant-details">
            <div className="restaurant-info grid">
              <div className="info-section glass p-3">
                <h3>معلومات المطعم</h3>
                <p><strong>الاسم:</strong> {selectedRestaurant.name}</p>
                <p><strong>البريد الإلكتروني:</strong> {selectedRestaurant.email}</p>
                <p><strong>الهاتف:</strong> {selectedRestaurant.phone}</p>
                <p><strong>العنوان:</strong> {selectedRestaurant.address}</p>
                <p><strong>الفئة:</strong> {selectedRestaurant.category}</p>
                <p><strong>رسوم التوصيل:</strong> {selectedRestaurant.deliveryFee} ريال</p>
                <p><strong>وقت التوصيل:</strong> {selectedRestaurant.deliveryTime} دقيقة</p>
                <p><strong>التقييم:</strong> ⭐ {selectedRestaurant.rating}</p>
                <p><strong>الحالة:</strong> 
                  <span className={`status-badge ${getStatusBadgeClass(selectedRestaurant.status)} ms-2`}>
                    {getStatusLabel(selectedRestaurant.status)}
                  </span>
                </p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات المالك</h3>
                <p><strong>الاسم:</strong> {selectedRestaurant.owner.name}</p>
                <p><strong>البريد الإلكتروني:</strong> {selectedRestaurant.owner.email}</p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات الحساب</h3>
                <p><strong>تاريخ الإنشاء:</strong> {formatDate(selectedRestaurant.createdAt)}</p>
                <p><strong>الوصف:</strong> {selectedRestaurant.description}</p>
              </div>
            </div>
            
            <div className="restaurant-actions mt-4">
              {selectedRestaurant.status === 'pending' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleApproveRestaurant(selectedRestaurant);
                    setShowRestaurantModal(false);
                  }}
                  className="me-2"
                >
                  موافقة
                </Button>
              )}
              
              {selectedRestaurant.status !== 'pending' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleToggleRestaurantStatus(selectedRestaurant);
                    setShowRestaurantModal(false);
                  }}
                  className={selectedRestaurant.status === 'active' ? 'warning' : 'success'}
                >
                  {selectedRestaurant.status === 'active' ? 'تعطيل' : 'تفعيل'}
                </Button>
              )}
              
              <Button 
                variant="secondary"
                onClick={() => {
                  handleDeleteRestaurant(selectedRestaurant);
                  setShowRestaurantModal(false);
                }}
                className="me-2"
              >
                حذف
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowRestaurantModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Restaurant Modal */}
      <Modal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="إضافة مطعم جديد"
        size="large"
      >
        <form onSubmit={handleAddRestaurant}>
          <div className="form-grid grid">
            <Input
              type="text"
              label="اسم المطعم"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              type="email"
              label="البريد الإلكتروني"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              type="tel"
              label="الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            
            <Input
              type="text"
              label="العنوان"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            
            <div className="form-group">
              <label>الفئة</label>
              <select
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر الفئة</option>
                <option value="مطاعم">مطاعم</option>
                <option value="سوبر ماركت">سوبر ماركت</option>
                <option value="مخبز">مخبز</option>
                <option value="حلويات">حلويات</option>
                <option value="مقاهي">مقاهي</option>
              </select>
            </div>
            
            <Input
              type="number"
              label="رسوم التوصيل"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
            
            <Input
              type="number"
              label="وقت التوصيل (بالدقائق)"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleInputChange}
              min="1"
              required
            />
            
            <div className="form-group">
              <label>الحالة</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">في الانتظار</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>الوصف</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
          
          <Input
            type="url"
            label="رابط الصورة"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
          
          <div className="modal-actions mt-4">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              إضافة المطعم
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal 
        show={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        title={confirmAction.title}
      >
        <div className="confirm-action">
          <p>{confirmAction.message}</p>
          <div className="modal-actions mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
            >
              إلغاء
            </Button>
            <Button 
              variant={confirmAction.title.includes('حذف') ? 'secondary' : 'primary'}
              onClick={confirmAction.action}
            >
              تأكيد
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRestaurants;