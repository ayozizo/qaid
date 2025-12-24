import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AlertTriangle, Package, Plus, Edit, X, Search } from 'lucide-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    product_id: '',
    branch_id: '',
    quantity: '',
    unit: 'piece',
    min_quantity: '',
    max_quantity: '',
    location: ''
  });

  useEffect(() => {
    loadInventory();
    loadProducts();
    loadBranches();
  }, [showLowStock]);

  const loadInventory = async () => {
    try {
      const params = showLowStock ? { low_stock: true } : {};
      const response = await api.get('/inventory', { params });
      setInventory(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل المخزون');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل المنتجات');
    }
  };

  const loadBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الفروع');
    }
  };

  const handleAddInventory = () => {
    setEditingItem(null);
    setFormData({
      product_id: '',
      branch_id: '',
      quantity: '',
      unit: 'piece',
      min_quantity: '',
      max_quantity: '',
      location: ''
    });
    setShowAddModal(true);
  };

  const handleEditInventory = (item) => {
    setEditingItem(item);
    setFormData({
      product_id: item.product_id || '',
      branch_id: item.branch_id || '',
      quantity: item.quantity || '',
      unit: item.unit || 'piece',
      min_quantity: item.min_quantity || '',
      max_quantity: item.max_quantity || '',
      location: item.location || ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.branch_id || !formData.quantity) {
      toast.error('يرجى إدخال المنتج والفرع والكمية');
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, formData);
        toast.success('تم تحديث المخزون بنجاح');
      } else {
        await api.post('/inventory', formData);
        toast.success('تم إضافة المنتج للمخزون بنجاح');
      }
      
      setShowAddModal(false);
      loadInventory();
    } catch (error) {
      toast.error(editingItem ? 'خطأ في تحديث المخزون' : 'خطأ في إضافة المنتج للمخزون');
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.product_name_ar && item.product_name_ar.includes(searchTerm)) ||
    (item.branch_name && item.branch_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">المخزون</h2>
          <p className="text-sm text-gray-500 mt-1">{inventory.length} عنصر في المخزون</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
              showLowStock 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle size={18} />
            {showLowStock ? 'عرض الكل' : 'عرض المنخفض فقط'}
          </button>
          <button 
            onClick={handleAddInventory}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <Plus size={18} />
            إضافة للمخزون
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في المخزون..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد عناصر في المخزون</h3>
          <p className="text-gray-500 text-sm mb-4">ابدأ بإضافة منتجات للمخزون</p>
          <button 
            onClick={handleAddInventory}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
          >
            <Plus size={18} />
            إضافة للمخزون
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المنتج</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الفرع</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الكمية</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الوحدة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحد الأدنى</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الموقع</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map(item => {
                  const isLow = parseFloat(item.quantity) <= parseFloat(item.min_quantity);
                  return (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isLow ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isLow && <AlertTriangle size={16} className="text-red-500" />}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                            {item.product_name_ar && (
                              <p className="text-xs text-gray-500">{item.product_name_ar}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.branch_name || 'الفرع الرئيسي'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-sm ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.min_quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.location || '-'}</td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                            منخفض
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            جيد
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleEditInventory(item)}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'تعديل المخزون' : 'إضافة للمخزون'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنتج *
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">اختر المنتج</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفرع *
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">اختر الفرع</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوحدة
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  >
                    <option value="piece">قطعة</option>
                    <option value="kg">كيلو</option>
                    <option value="liter">لتر</option>
                    <option value="box">صندوق</option>
                    <option value="pack">عبوة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأدنى
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأقصى
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_quantity}
                    onChange={(e) => setFormData({...formData, max_quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="مثال: رف A1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingItem ? 'تحديث المخزون' : 'إضافة للمخزون'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
