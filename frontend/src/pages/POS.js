import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Plus, Minus, Trash2, ShoppingCart, CreditCard, 
  DollarSign, Receipt, Search, Grid, List, Calculator,
  User, MapPin, Clock, Check
} from 'lucide-react';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { is_active: true }
      });
      setProducts(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الفئات');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.name_ar && product.name_ar.includes(searchTerm));
    const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, notes: '' }]);
    }
    toast.success(`تم إضافة ${product.name} للسلة`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setTableNumber('');
    setDiscount(0);
    setNotes('');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.15; // 15% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax - discount;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('يرجى إدخال رقم الطاولة');
      return;
    }

    try {
      const orderData = {
        order_type: orderType,
        table_number: tableNumber,
        customer_id: customer?.id,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        discount_amount: discount,
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        payment_status: 'paid',
        notes: notes,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          notes: item.notes
        }))
      };

      const response = await api.post('/orders', orderData);
      toast.success('تم إنشاء الطلب بنجاح');
      
      // Print receipt (placeholder)
      console.log('Printing receipt for order:', response.data.data);
      
      clearCart();
      setShowPaymentModal(false);
    } catch (error) {
      toast.error('خطأ في إنشاء الطلب');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">نقاط البيع</h1>
                <p className="text-sm text-gray-500">إدارة المبيعات والطلبات</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="input bg-white/90 backdrop-blur-sm border-gray-200 hover:border-blue-300 transition-all duration-300"
              >
                <option value="dine-in">🍽️ داخل المطعم</option>
                <option value="takeaway">📦 للخارج</option>
                <option value="delivery">🚚 توصيل</option>
              </select>
              
              {orderType === 'dine-in' && (
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="رقم الطاولة"
                  className="input w-32 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-blue-300 transition-all duration-300"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 ابحث عن منتج..."
                className="input pr-12 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-blue-300 transition-all duration-300"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input bg-white/90 backdrop-blur-sm border-gray-200 hover:border-blue-300 transition-all duration-300 min-w-[150px]"
            >
              <option value="">📂 جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-lg text-blue-600 transform scale-105' 
                    : 'hover:bg-white/50 text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-lg text-blue-600 transform scale-105' 
                    : 'hover:bg-white/50 text-gray-600 hover:text-gray-800'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="card card-hover group cursor-pointer relative overflow-hidden"
                >
                  {product.image_url && (
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                    {product.name_ar && (
                      <p className="text-xs text-gray-500">{product.name_ar}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-blue-600">{product.price} ريال</p>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Plus className="text-white" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="card card-hover group cursor-pointer flex items-center gap-4"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    {product.name_ar && (
                      <p className="text-sm text-gray-500">{product.name_ar}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-brand-600">{product.price} ريال</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white/90 backdrop-blur-xl border-l border-gray-200/50 flex flex-col shadow-2xl">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">السلة</h2>
                <p className="text-xs text-gray-500">{cart.length} منتج</p>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <Trash2 size={20} />
            </button>
          </div>
          
          {customer ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">{customer.name}</span>
                <p className="text-xs text-gray-500">عميل مسجل</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomerModal(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group"
            >
              <Plus size={16} />
              <span className="text-sm">إضافة عميل</span>
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={48} className="mb-4" />
              <p>السلة فارغة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.price} ريال</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold text-brand-600">
                      {(item.price * item.quantity).toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200/50 p-6 space-y-4 bg-gradient-to-t from-gray-50/50 to-transparent">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold">{calculateSubtotal().toFixed(2)} ريال</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>الضريبة (15%):</span>
                <span className="font-semibold">{calculateTax().toFixed(2)} ريال</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>الخصم:</span>
                  <span className="font-semibold">-{discount.toFixed(2)} ريال</span>
                </div>
              )}
              <div className="flex justify-between font-black text-xl border-t border-gray-200 pt-3 text-gray-900">
                <span>الإجمالي:</span>
                <span className="text-blue-600">{calculateTotal().toFixed(2)} ريال</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl"
            >
              <CreditCard size={20} />
              💳 متابعة الدفع
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">تأكيد الدفع</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  طريقة الدفع
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  <option value="cash">نقداً</option>
                  <option value="card">بطاقة ائتمان</option>
                  <option value="digital">محفظة رقمية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخصم (ج)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-center text-brand-600">
                  الإجمالي: {calculateTotal().toFixed(2)} ريال
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCheckout}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Check size={18} />
                تأكيد الدفع
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
