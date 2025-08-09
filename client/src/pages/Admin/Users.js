import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ title: '', message: '', action: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch users from an API
        // For now, we'll use mock data
        const mockUsers = [
          {
            _id: '1',
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '0501234567',
            role: 'customer',
            status: 'active',
            createdAt: '2023-01-15T10:30:00Z',
            lastLogin: '2023-04-01T10:30:00Z'
          },
          {
            _id: '2',
            name: 'فاطمة علي',
            email: 'fatima@example.com',
            phone: '0507654321',
            role: 'customer',
            status: 'active',
            createdAt: '2023-02-20T11:45:00Z',
            lastLogin: '2023-04-01T11:45:00Z'
          },
          {
            _id: '3',
            name: 'مطعم الشام',
            email: 'sham@example.com',
            phone: '0501112233',
            role: 'restaurant',
            status: 'active',
            createdAt: '2023-01-10T09:15:00Z',
            lastLogin: '2023-04-01T09:15:00Z'
          },
          {
            _id: '4',
            name: 'مطعم الزهراء',
            email: 'zahra@example.com',
            phone: '0504445566',
            role: 'restaurant',
            status: 'pending',
            createdAt: '2023-03-05T14:20:00Z',
            lastLogin: null
          },
          {
            _id: '5',
            name: 'خالد سالم',
            email: 'khaled@example.com',
            phone: '0507778899',
            role: 'driver',
            status: 'active',
            createdAt: '2023-02-15T16:30:00Z',
            lastLogin: '2023-04-01T16:30:00Z'
          },
          {
            _id: '6',
            name: 'سارة عبدالله',
            email: 'sara@example.com',
            phone: '0501237890',
            role: 'driver',
            status: 'pending',
            createdAt: '2023-03-20T13:45:00Z',
            lastLogin: null
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleToggleUserStatus = (user) => {
    const action = user.status === 'active' ? 'تعطيل' : 'تفعيل';
    setConfirmAction({
      title: `${action} المستخدم`,
      message: `هل أنت متأكد من أنك تريد ${action} المستخدم ${user.name}؟`,
      action: () => {
        const updatedUsers = users.map(u =>
          u._id === user._id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        );
        setUsers(updatedUsers);
        setShowConfirmModal(false);
        toast.success(`تم ${action} المستخدم بنجاح`);
      }
    });
    setShowConfirmModal(true);
  };

  const handleApproveUser = (user) => {
    setConfirmAction({
      title: 'الموافقة على المستخدم',
      message: `هل أنت متأكد من أنك تريد الموافقة على ${user.name}؟`,
      action: () => {
        const updatedUsers = users.map(u =>
          u._id === user._id ? { ...u, status: 'active' } : u
        );
        setUsers(updatedUsers);
        setShowConfirmModal(false);
        toast.success('تمت الموافقة على المستخدم بنجاح');
      }
    });
    setShowConfirmModal(true);
  };

  const handleDeleteUser = (user) => {
    setConfirmAction({
      title: 'حذف المستخدم',
      message: `هل أنت متأكد من أنك تريد حذف المستخدم ${user.name}؟ لا يمكن التراجع عن هذا الإجراء.`,
      action: () => {
        const updatedUsers = users.filter(u => u._id !== user._id);
        setUsers(updatedUsers);
        setShowConfirmModal(false);
        toast.success('تم حذف المستخدم بنجاح');
      }
    });
    setShowConfirmModal(true);
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-users">
      <div className="users-header mb-4">
        <h1>إدارة المستخدمين</h1>
        
        <div className="users-filters">
          <Input
            type="text"
            placeholder="بحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="filter-group">
            <select 
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">أدمن</option>
              <option value="restaurant">مطعم</option>
              <option value="driver">سائق</option>
              <option value="customer">عميل</option>
            </select>
          </div>
          
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
      ) : filteredUsers.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد مستخدمين</h3>
          <p>لا توجد مستخدمين تطابق معايير التصفية المحددة</p>
        </div>
      ) : (
        <div className="users-table">
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>آخر تسجيل دخول</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>
                    <div className="user-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleViewUser(user)}
                        className="me-2"
                      >
                        عرض
                      </Button>
                      
                      {user.status === 'pending' && (
                        <Button 
                          variant="primary" 
                          size="small"
                          onClick={() => handleApproveUser(user)}
                          className="me-2"
                        >
                          موافقة
                        </Button>
                      )}
                      
                      {user.status !== 'pending' && (
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => handleToggleUserStatus(user)}
                          className={user.status === 'active' ? 'warning' : 'success'}
                        >
                          {user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDeleteUser(user)}
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

      {/* User Details Modal */}
      <Modal 
        show={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        title={`تفاصيل المستخدم - ${selectedUser?.name}`}
        size="large"
      >
        {selectedUser && (
          <div className="user-details">
            <div className="user-info grid">
              <div className="info-section glass p-3">
                <h3>المعلومات الشخصية</h3>
                <p><strong>الاسم:</strong> {selectedUser.name}</p>
                <p><strong>البريد الإلكتروني:</strong> {selectedUser.email}</p>
                <p><strong>الهاتف:</strong> {selectedUser.phone}</p>
                <p><strong>الدور:</strong> 
                  <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)} ms-2`}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </p>
                <p><strong>الحالة:</strong> 
                  <span className={`status-badge ${getStatusBadgeClass(selectedUser.status)} ms-2`}>
                    {getStatusLabel(selectedUser.status)}
                  </span>
                </p>
              </div>
              
              <div className="info-section glass p-3">
                <h3>معلومات الحساب</h3>
                <p><strong>تاريخ الإنشاء:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>آخر تسجيل دخول:</strong> {formatDate(selectedUser.lastLogin)}</p>
              </div>
            </div>
            
            <div className="user-actions mt-4">
              {selectedUser.status === 'pending' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleApproveUser(selectedUser);
                    setShowUserModal(false);
                  }}
                  className="me-2"
                >
                  موافقة
                </Button>
              )}
              
              {selectedUser.status !== 'pending' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleToggleUserStatus(selectedUser);
                    setShowUserModal(false);
                  }}
                  className={selectedUser.status === 'active' ? 'warning' : 'success'}
                >
                  {selectedUser.status === 'active' ? 'تعطيل' : 'تفعيل'}
                </Button>
              )}
              
              <Button 
                variant="secondary"
                onClick={() => {
                  handleDeleteUser(selectedUser);
                  setShowUserModal(false);
                }}
                className="me-2"
              >
                حذف
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
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

export default AdminUsers;