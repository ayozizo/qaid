import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Minus, Trash2, Search, ShoppingCart, Package } from 'lucide-react';

const NewOrder = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products', { params: { is_active: true } });
      setProducts(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل المنتجات');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error loading categories');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        name_ar: product.name_ar,
        price: product.price,
        quantity: 1
      }]);
    }
    toast.success(`تمت إضافة ${product.name} للسلة`);
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('يرجى إدخال رقم الطاولة');
      return;
    }

    setLoading(true);
    try {
      await api.post('/orders', {
        order_type: orderType,
        table_number: tableNumber,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_method: 'cash'
      });
      
      toast.success('تم إنشاء الطلب بنجاح');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطأ في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === parseInt(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.name_ar && product.name_ar.includes(searchTerm));
    return matchesCategory && matchesSearch && product.is_available;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">طلب جديد</h2>
        <p className="text-sm text-gray-500 mt-1">اختر المنتجات وأضفها للسلة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
              >
                <option value="all">كل الفئات</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">لا توجد منتجات</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-brand-300 transition-all overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ display: product.image_url ? 'none' : 'flex' }}>
                      <Package className="text-gray-300" size={32} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-bold text-sm">{product.price} ريال</p>
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="p-3 text-right">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                    {product.category_name && (
                      <p className="text-xs text-gray-500 mt-0.5">{product.category_name}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="text-brand-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">تفاصيل الطلب</h3>
              {cart.length > 0 && (
                <span className="mr-auto bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {cart.length} عنصر
                </span>
              )}
            </div>

            {/* Order Type & Table */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الطلب</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="dine-in">🍽️ داخلي</option>
                  <option value="takeaway">📦 سفري</option>
                  <option value="delivery">🚚 توصيل</option>
                </select>
              </div>

              {orderType === 'dine-in' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الطاولة</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="أدخل رقم الطاولة"
                  />
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.product_id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.price} ريال × {item.quantity}</p>
                        <p className="text-sm font-semibold text-brand-600 mt-1">{(item.price * item.quantity).toFixed(2)} ريال</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product_id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="w-7 h-7 flex items-center justify-center bg-error-50 text-error-600 rounded hover:bg-error-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 text-sm">السلة فارغة</p>
                    <p className="text-gray-400 text-xs mt-1">اختر المنتجات من القائمة</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            {cart.length > 0 && (
              <>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">الإجمالي:</span>
                    <span className="text-2xl font-bold text-brand-600">{calculateTotal().toFixed(2)} <span className="text-lg">ريال</span></span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || cart.length === 0}
                  className="w-full mt-4 px-4 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 active:bg-success-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      إنشاء الطلب
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
