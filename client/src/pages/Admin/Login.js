import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password, 'admin');
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="auth-container glass p-5">
        <h1 className="text-center mb-4">تسجيل دخول الأدمن</h1>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="form-group mb-4">
            <Link to="/forgot-password" className="forgot-password">
              نسيت كلمة المرور؟
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className="w-100"
          >
            {loading ? <LoadingSpinner size="small" /> : 'تسجيل الدخول'}
          </Button>
        </form>
        
        <div className="auth-footer text-center mt-4">
          <p className="mt-2">
            <Link to="/customer/login">تسجيل دخول عميل</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;