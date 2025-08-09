import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const RestaurantProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    image: '',
    available: true
  });
  const [categories, setCategories] = useState([
    'مقبلات',
    'أطباق رئيسية',
    'حلويات',
    'مشروبات',
    'وجبات خفيفة'
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the restaurant's products from an API
        // For now, we'll use mock data
        const mockProducts = [
          {
            _id: '1',
            name: 'برجر لحم',
            description: 'برجر لحم شهي مع الخضروات الطازجة',
            price: 25,
            category: 'أطباق رئيسية',
            preparationTime: 15,
            image: 'https://via.placeholder.com/150',
            available: true
          },
          {
            _id: '2',
            name: 'بيتزا',
            description: 'بيتزا إيطالية أصيلة مع صلصة الطماطم',
            price: 35,
            category: 'أطباق رئيسية',
            preparationTime: 20,
            image: 'https://via.placeholder.com/150',
            available: true
          },
          {
            _id: '3',
            name: 'سلطة',
            description: 'سلطة خضراء طازجة مع صلصة الزيتون',
            price: 15,
            category: 'مقبلات',
            preparationTime: 5,
            image: 'https://via.placeholder.com/150',
            available: false
          }
        ];
        
        setProducts(mockProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(product =>
          product._id === editingProduct._id ? { ...formData, _id: editingProduct._id } : product
        );
        setProducts(updatedProducts);
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        // Add new product
        const newProduct = {
          ...formData,
          _id: Date.now().toString()
        };
        setProducts([...products, newProduct]);
        toast.success('تمت إضافة المنتج بنجاح');
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'فشل حفظ المنتج');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      preparationTime: product.preparationTime,
      image: product.image,
      available: product.available
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذا المنتج؟')) {
      try {
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
        toast.success('تم حذف المنتج بنجاح');
      } catch (error) {
        toast.error(error.message || 'فشل حذف المنتج');
      }
    }
  };

  const handleToggleAvailability = async (productId) => {
    try {
      const updatedProducts = products.map(product =>
        product._id === productId ? { ...product, available: !product.available } : product
      );
      setProducts(updatedProducts);
      toast.success('تم تحديث حالة المنتج بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل تحديث حالة المنتج');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      image: '',
      available: true
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="restaurant-products">
      <div className="products-header flex justify-between items-center mb-4">
        <h1>إدارة المنتجات</h1>
        <Button variant="primary" onClick={openAddModal}>
          إضافة منتج جديد
        </Button>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="glass p-5 text-center">
          <h3>لا توجد منتجات</h3>
          <p>ابدأ بإضافة منتجاتك الأولى</p>
          <Button variant="primary" onClick={openAddModal} className="mt-3">
            إضافة منتج
          </Button>
        </div>
      ) : (
        <div className="products-list">
          <div className="grid">
            {products.map(product => (
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
                    <span className="product-category">{product.category}</span>
                    <span className="product-prep-time">⏱️ {product.preparationTime} دقيقة</span>
                  </div>
                  
                  <div className="product-actions mt-3">
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleEdit(product)}
                      className="me-2"
                    >
                      تعديل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleToggleAvailability(product._id)}
                      className={product.available ? 'warning' : 'success'}
                    >
                      {product.available ? 'تعطيل' : 'تفعيل'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleDelete(product._id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onClose={closeModal} title={editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="اسم المنتج"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <div className="form-group">
            <label>وصف المنتج</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
          
          <Input
            type="number"
            label="السعر"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
          
          <div className="form-group">
            <label>الفئة</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">اختر الفئة</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <Input
            type="number"
            label="وقت التحضير (بالدقائق)"
            name="preparationTime"
            value={formData.preparationTime}
            onChange={handleInputChange}
            min="1"
            required
          />
          
          <Input
            type="url"
            label="رابط الصورة"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
          
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="available">
              متوفر
            </label>
          </div>
          
          <div className="modal-actions mt-4">
            <Button variant="outline" type="button" onClick={closeModal}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantProducts;