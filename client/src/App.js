import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { useAuth } from './contexts/AuthContext';

// صفحات العميل
import CustomerHome from './pages/Customer/Home';
import CustomerLogin from './pages/Customer/Login';
import CustomerRegister from './pages/Customer/Register';
import Restaurants from './pages/Customer/Restaurants';
import RestaurantDetails from './pages/Customer/RestaurantDetails';
import Cart from './pages/Customer/Cart';
import Checkout from './pages/Customer/Checkout';
import OrderTracking from './pages/Customer/OrderTracking';
import CustomerProfile from './pages/Customer/Profile';

// صفحات المطعم
import RestaurantLogin from './pages/Restaurant/Login';
import RestaurantDashboard from './pages/Restaurant/Dashboard';
import RestaurantProducts from './pages/Restaurant/Products';
import RestaurantOrders from './pages/Restaurant/Orders';
import RestaurantAnalytics from './pages/Restaurant/Analytics';

// صفحات السائق
import DriverLogin from './pages/Driver/Login';
import DriverDashboard from './pages/Driver/Dashboard';
import DriverOrders from './pages/Driver/Orders';
import DriverEarnings from './pages/Driver/Earnings';
import DriverMap from './pages/Driver/Map';

// صفحات الأدمن
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminRestaurants from './pages/Admin/Restaurants';
import AdminDrivers from './pages/Admin/Drivers';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminFees from './pages/Admin/Fees';

// صفحات مشتركة
import NotFound from './pages/Shared/NotFound';
import Unauthorized from './pages/Shared/Unauthorized';

// مكونات الحماية
import CustomerRoute from './components/common/CustomerRoute';
import RestaurantRoute from './components/common/RestaurantRoute';
import DriverRoute from './components/common/DriverRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* مسارات العميل */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CustomerRoute><Checkout /></CustomerRoute>} />
          <Route path="/order-tracking/:id" element={<CustomerRoute><OrderTracking /></CustomerRoute>} />
          <Route path="/customer/profile" element={<CustomerRoute><CustomerProfile /></CustomerRoute>} />
          
          {/* مسارات المطعم */}
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/restaurant/dashboard" element={<RestaurantRoute><RestaurantDashboard /></RestaurantRoute>} />
          <Route path="/restaurant/products" element={<RestaurantRoute><RestaurantProducts /></RestaurantRoute>} />
          <Route path="/restaurant/orders" element={<RestaurantRoute><RestaurantOrders /></RestaurantRoute>} />
          <Route path="/restaurant/analytics" element={<RestaurantRoute><RestaurantAnalytics /></RestaurantRoute>} />
          
          {/* مسارات السائق */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/dashboard" element={<DriverRoute><DriverDashboard /></DriverRoute>} />
          <Route path="/driver/orders" element={<DriverRoute><DriverOrders /></DriverRoute>} />
          <Route path="/driver/earnings" element={<DriverRoute><DriverEarnings /></DriverRoute>} />
          <Route path="/driver/map" element={<DriverRoute><DriverMap /></DriverRoute>} />
          
          {/* مسارات الأدمن */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/restaurants" element={<AdminRoute><AdminRestaurants /></AdminRoute>} />
          <Route path="/admin/drivers" element={<AdminRoute><AdminDrivers /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/fees" element={<AdminRoute><AdminFees /></AdminRoute>} />
          
          {/* مسارات مشتركة */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;