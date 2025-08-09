import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minRating: searchParams.get('minRating') || '',
    maxDeliveryTime: searchParams.get('maxDeliveryTime') || '',
    sort: searchParams.get('sort') || 'rating'
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.minRating) params.minRating = filters.minRating;
        if (filters.maxDeliveryTime) params.maxDeliveryTime = filters.maxDeliveryTime;
        if (filters.sort) params.sort = filters.sort;
        
        const response = await restaurantService.getRestaurants(params);
        setRestaurants(response.restaurants);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Update URL params
    const newParams = { ...filters };
    if (value) {
      newParams[name] = value;
    } else {
      delete newParams[name];
    }
    setSearchParams(newParams);
  };

  const applyFilters = () => {
    // Filters are already applied on change, but we can add a button to apply if needed
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minRating: '',
      maxDeliveryTime: '',
      sort: 'rating'
    });
    setSearchParams({});
  };

  return (
    <div className="restaurants-page">
      <h1 className="mb-4">المطاعم والمحلات</h1>
      
      {/* Filters Section */}
      <div className="filters glass p-4 mb-4">
        <div className="grid">
          <Input
            type="text"
            placeholder="بحث عن مطعم أو منتج"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          
          <div className="form-group">
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">جميع الفئات</option>
              <option value="restaurants">مطاعم</option>
              <option value="supermarkets">سوبر ماركت</option>
              <option value="sweets">حلويات</option>
              <option value="cafes">مقاهي</option>
            </select>
          </div>
          
          <div className="form-group">
            <select 
              name="minRating" 
              value={filters.minRating} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">أي تقييم</option>
              <option value="4">4+ نجوم</option>
              <option value="3">3+ نجوم</option>
              <option value="2">2+ نجوم</option>
            </select>
          </div>
          
          <div className="form-group">
            <select 
              name="maxDeliveryTime" 
              value={filters.maxDeliveryTime} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">أي وقت توصيل</option>
              <option value="30">30 دقيقة</option>
              <option value="45">45 دقيقة</option>
              <option value="60">60 دقيقة</option>
            </select>
          </div>
          
          <div className="form-group">
            <select 
              name="sort" 
              value={filters.sort} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="deliveryTime">الأسرع توصيلاً</option>
              <option value="deliveryFee">الأقل تكلفة</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions mt-3">
          <Button variant="outline" onClick={resetFilters}>
            إعادة تعيين
          </Button>
        </div>
      </div>
      
      {/* Restaurants List */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : restaurants.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد مطاعم تطابق معايير البحث</h3>
          <Button variant="primary" onClick={resetFilters} className="mt-3">
            إعادة تعيين الفلاتر
          </Button>
        </div>
      ) : (
        <div className="grid">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card glass">
              <div className="restaurant-image">
                <img src={restaurant.image} alt={restaurant.name} />
              </div>
              <div className="restaurant-info p-3">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-category">{restaurant.category}</p>
                <div className="restaurant-meta">
                  <span>⭐ {restaurant.rating}</span>
                  <span>⏱️ {restaurant.deliveryTime} دقيقة</span>
                  <span>🚚 {restaurant.deliveryFee} ريال</span>
                </div>
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={() => window.location.href = `/restaurant/${restaurant._id}`}
                >
                  عرض القائمة
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;