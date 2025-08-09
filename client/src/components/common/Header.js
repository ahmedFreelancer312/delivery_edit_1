import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import logo from "../../assets/logo.png";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="glass mb-4">
      <div className="container flex">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="منصة توصيل الطلعات المحلية" height="50" />
          </Link>
        </div>

        <nav className={`nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/restaurants">المطاعم</Link>
            </li>
            {currentUser ? (
              <>
                {currentUser.role === "customer" && (
                  <li>
                    <Link to="/cart" className="cart-link">
                      السلة
                      {getCartCount() > 0 && (
                        <span className="cart-count">{getCartCount()}</span>
                      )}
                    </Link>
                  </li>
                )}
                <li className="dropdown">
                  <button className="dropdown-toggle">
                    {currentUser.name}
                  </button>
                  <ul className="dropdown-menu">
                    {currentUser.role === "customer" && (
                      <li>
                        <Link to="/customer/profile">ملفي الشخصي</Link>
                      </li>
                    )}
                    {currentUser.role === "restaurant" && (
                      <li>
                        <Link to="/restaurant/dashboard">لوحة التحكم</Link>
                      </li>
                    )}
                    {currentUser.role === "driver" && (
                      <li>
                        <Link to="/driver/dashboard">لوحة التحكم</Link>
                      </li>
                    )}
                    {currentUser.role === "admin" && (
                      <li>
                        <Link to="/admin/dashboard">لوحة التحكم</Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogout}>تسجيل الخروج</button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/customer/login">تسجيل الدخول</Link>
                </li>
                <li>
                  <Link to="/customer/register">إنشاء حساب</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
