import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    
    try {
      setLoading(true);
      await register({
        ...formData,
        role: 'customer'
      });
      toast.success('تم إنشاء الحساب بنجاح');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass p-5">
        <h1 className="text-center mb-4">إنشاء حساب جديد</h1>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="الاسم الكامل"
            placeholder="أدخل اسمك الكامل"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            type="tel"
            label="رقم الهاتف"
            placeholder="أدخل رقم هاتفك"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
          <Input
            type="password"
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Input
            type="password"
            label="تأكيد كلمة المرور"
            placeholder="أعد إدخال كلمة المرور"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className="w-100"
          >
            {loading ? <LoadingSpinner size="small" /> : 'إنشاء حساب'}
          </Button>
        </form>
        
        <div className="auth-divider my-4">
          <span>أو</span>
        </div>
        
        <Button
          variant="outline"
          size="large"
          className="w-100 mb-4"
        >
          التسجيل عبر Google
        </Button>
        
        <div className="auth-footer text-center mt-4">
          <p>
            لديك حساب بالفعل؟{' '}
            <Link to="/customer/login">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;