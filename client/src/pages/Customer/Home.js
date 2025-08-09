import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'restaurants', name: 'مطاعم', icon: '🍔' },
    { id: 'supermarkets', name: 'سوبر ماركت', icon: '🛒' },
    { id: 'sweets', name: 'حلويات', icon: '🧁' },
    { id: 'cafes', name: 'مقاهي', icon: '☕' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getRestaurants({ featured: true, limit: 6 });
        setFeaturedRestaurants(response.restaurants);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero glass p-5 mb-5 text-center">
        <h1>منصة توصيل الطلعات المحلية</h1>
        <p className="lead">اطلب أطعمتك المفضلة من أفضل المطاعم والمحلات في منطقتك</p>
        <div className="hero-actions mt-4">
          <Link to="/restaurants">
            <Button variant="primary" size="large">اطلب الآن</Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories mb-5">
        <h2 className="text-center mb-4">تصفح حسب الفئة</h2>
        <div className="grid">
          {categories.map(category => (
            <Link key={category.id} to={`/restaurants?category=${category.id}`} className="category-card glass p-4 text-center">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="featured-restaurants mb-5">
        <div className="flex justify-between items-center mb-4">
          <h2>المطاعم المميزة</h2>
          <Link to="/restaurants">
            <Button variant="outline">عرض الكل</Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="grid">
            {featuredRestaurants.map(restaurant => (
              <Link key={restaurant._id} to={`/restaurant/${restaurant._id}`} className="restaurant-card glass">
                <div className="restaurant-image">
                  <img src={restaurant.image} alt={restaurant.name} />
                </div>
                <div className="restaurant-info p-3">
                  <h3>{restaurant.name}</h3>
                  <div className="restaurant-meta">
                    <span>⭐ {restaurant.rating}</span>
                    <span>⏱️ {restaurant.deliveryTime} دقيقة</span>
                    <span>🚚 {restaurant.deliveryFee} ريال</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works glass p-5 mb-5">
        <h2 className="text-center mb-4">كيف يعمل التطبيق</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>اختر مطعمك</h3>
            <p>تصفح قائمة المطاعم والمحلات المتاحة واختر ما يناسبك</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>اطلب طعامك</h3>
            <p>اختر الأطباق التي تريدها وأضفها إلى سلة التسوق</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>أكد طلبك</h3>
            <p>أدخل عنوانك وتأكد من طلبك واختر الدفع عند الاستلام</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>استمتع بطلبك</h3>
            <p>تتبع طلبك واستمتع بتوصيله إلى باب منزلك</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;