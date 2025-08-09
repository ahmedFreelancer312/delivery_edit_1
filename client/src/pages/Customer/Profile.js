import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: ['']
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        addresses: currentUser.addresses && currentUser.addresses.length > 0 
          ? currentUser.addresses 
          : ['']
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = value;
    setFormData({
      ...formData,
      addresses: newAddresses
    });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, '']
    });
  };

  const removeAddress = (index) => {
    if (formData.addresses.length <= 1) return;
    
    const newAddresses = [...formData.addresses];
    newAddresses.splice(index, 1);
    setFormData({
      ...formData,
      addresses: newAddresses
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateProfile(formData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <h1 className="mb-4">ملفي الشخصي</h1>
      
      <div className="profile-container">
        <div className="profile-form glass p-4">
          <h3>المعلومات الشخصية</h3>
          
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              label="الاسم الكامل"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              type="email"
              label="البريد الإلكتروني"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              type="tel"
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <div className="form-group">
              <label>العناوين</label>
              {formData.addresses.map((address, index) => (
                <div key={index} className="address-input-group">
                  <Input
                    type="text"
                    placeholder="أدخل العنوان"
                    value={address}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    required={index === 0}
                  />
                  {formData.addresses.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      onClick={() => removeAddress(index)}
                      className="remove-address-btn"
                    >
                      حذف
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={addAddress}
                className="add-address-btn"
              >
                + إضافة عنوان جديد
              </Button>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100 mt-4"
            >
              {loading ? <LoadingSpinner size="small" /> : 'حفظ التغييرات'}
            </Button>
          </form>
        </div>
        
        <div className="profile-sidebar">
          <div className="profile-card glass p-4 mb-4">
            <h3>معلومات الحساب</h3>
            <div className="profile-info">
              <p><strong>نوع الحساب:</strong> عميل</p>
              <p><strong>تاريخ الإنشاء:</strong> {new Date(currentUser.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
          
          <div className="profile-card glass p-4">
            <h3>الأمان</h3>
            <Button variant="outline" className="w-100 mb-3">
              تغيير كلمة المرور
            </Button>
            <Button variant="outline" className="w-100">
              تسجيل الخروج من جميع الأجهزة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;