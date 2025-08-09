import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="glass mt-5">
      <div className="container">
        <div className="grid">
          <div className="footer-col">
            <h3>منصة توصيل الطلعات المحلية</h3>
            <p>نوصل لك طلباتك من أفضل المطاعم والمحلات في منطقتك</p>
          </div>

          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <ul>
              <li>
                <Link to="/">الرئيسية</Link>
              </li>
              <li>
                <Link to="/restaurants">المطاعم</Link>
              </li>
              <li>
                <Link to="/customer/register">إنشاء حساب</Link>
              </li>
              <li>
                <Link to="/restaurant/login">تسجيل المطعم</Link>
              </li>
              <li>
                <Link to="/driver/login">تسجيل سائق</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul>
              <li>البريد الإلكتروني: info@delivery-platform.com</li>
              <li>الهاتف: 123-456-7890</li>
              <li>العنوان: شارع الملك فهد، الرياض</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>تابعنا</h4>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} منصة توصيل الطلعات المحلية. جميع
            الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
