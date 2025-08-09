import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart, cartItems, restaurantId } = useCart();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantResponse = await restaurantService.getRestaurantById(id);
        const productsResponse = await restaurantService.getRestaurantProducts(id);
        
        setRestaurant(restaurantResponse.restaurant);
        setProducts(productsResponse.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleAddToCart = (product) => {
    if (restaurantId && restaurantId !== id) {
      toast.error('لا يمكنك إضافة منتجات من مطاعم مختلفة في نفس الطلب');
      return;
    }
    
    addToCart(product);
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const getCategories = () => {
    const categories = ['all'];
    products.forEach(product => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    return categories;
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getProductQuantity = (productId) => {
    const cartItem = cartItems.find(item => item._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Link to="/restaurants" className="btn btn-primary mt-3">
          العودة إلى المطاعم
        </Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="alert alert-warning">
        المطعم غير موجود
        <Link to="/restaurants" className="btn btn-primary mt-3">
          العودة إلى المطاعم
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page">
      {/* Restaurant Header */}
      <div className="restaurant-header glass p-4 mb-4">
        <div className="restaurant-image">
          <img src={restaurant.image} alt={restaurant.name} />
        </div>
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="restaurant-description">{restaurant.description}</p>
          <div className="restaurant-meta">
            <span>⭐ {restaurant.rating}</span>
            <span>⏱️ {restaurant.deliveryTime} دقيقة</span>
            <span>🚚 {restaurant.deliveryFee} ريال</span>
            <span>📍 {restaurant.address}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-filter mb-4">
        <div className="d-flex overflow-auto">
          {getCategories().map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'outline'}
              className="me-2"
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'الكل' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <div className="glass p-5 text-center">
            <h3>لا توجد منتجات في هذه الفئة</h3>
          </div>
        ) : (
          <div className="grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card glass">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {!product.available && (
                    <div className="product-unavailable">
                      <span>غير متوفر</span>
                    </div>
                  )}
                </div>
                <div className="product-info p-3">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">{product.price} ريال</span>
                    <span className="product-prep-time">⏱️ {product.preparationTime} دقيقة</span>
                  </div>
                  
                  {product.available ? (
                    isInCart(product._id) ? (
                      <div className="quantity-control mt-3">
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => addToCart(product, -1)}
                        >
                          -
                        </Button>
                        <span className="quantity">{getProductQuantity(product._id)}</span>
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => addToCart(product, 1)}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="w-100 mt-3"
                        onClick={() => handleAddToCart(product)}
                      >
                        إضافة إلى السلة
                      </Button>
                    )
                  ) : (
                    <Button 
                      variant="secondary" 
                      className="w-100 mt-3"
                      disabled
                    >
                      غير متوفر
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;