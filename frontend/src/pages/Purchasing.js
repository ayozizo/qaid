import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, Package, Truck, DollarSign,
  Plus, Edit, Trash2, Eye, Search, Filter,
  Calendar, CheckCircle, XCircle, Clock,
  FileText, Download, Upload
} from 'lucide-react';

const Purchasing = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [purchaseForm, setPurchaseForm] = useState({
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    status: 'pending',
    notes: '',
    items: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [purchasesRes, suppliersRes, productsRes] = await Promise.all([
        api.get('/purchasing/orders'),
        api.get('/suppliers'),
        api.get('/products')
      ]);
      
      setPurchases(purchasesRes.data.data);
      setSuppliers(suppliersRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setPurchaseForm({
      supplier_id: '',
      purchase_date: new Date().toISOString().split('T')[0],
      expected_delivery: '',
      status: 'pending',
      notes: '',
      items: [{ product_id: '', quantity: 1, unit_price: 0, total_price: 0 }]
    });
    setShowPurchaseModal(true);
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setPurchaseForm({
      supplier_id: purchase.supplier_id || '',
      purchase_date: purchase.purchase_date?.split('T')[0] || '',
      expected_delivery: purchase.expected_delivery?.split('T')[0] || '',
      status: purchase.status || 'pending',
      notes: purchase.notes || '',
      items: purchase.items || [{ product_id: '', quantity: 1, unit_price: 0, total_price: 0 }]
    });
    setShowPurchaseModal(true);
  };

  const addItem = () => {
    setPurchaseForm({
      ...purchaseForm,
      items: [...purchaseForm.items, { product_id: '', quantity: 1, unit_price: 0, total_price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = purchaseForm.items.filter((_, i) => i !== index);
    setPurchaseForm({ ...purchaseForm, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...purchaseForm.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setPurchaseForm({ ...purchaseForm, items: newItems });
  };

  const calculateTotal = () => {
    return purchaseForm.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const purchaseData = {
        ...purchaseForm,
        total_amount: calculateTotal()
      };

      if (editingPurchase) {
        await api.put(`/purchasing/orders/${editingPurchase.id}`, purchaseData);
        toast.success('تم تحديث أمر الشراء بنجاح');
      } else {
        await api.post('/purchasing/orders', purchaseData);
        toast.success('تم إضافة أمر الشراء بنجاح');
      }
      
      setShowPurchaseModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ أمر الشراء');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/purchasing/orders/${id}/status`, { status });
      toast.success('تم تحديث الحالة بنجاح');
      loadData();
    } catch (error) {
      toast.error('خطأ في تحديث الحالة');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'في الانتظار', icon: Clock },
      ordered: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'تم الطلب', icon: ShoppingBag },
      received: { bg: 'bg-green-100', text: 'text-green-800', label: 'تم الاستلام', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغي', icon: XCircle }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.purchase_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المشتريات</h2>
          <p className="text-gray-600">إدارة أوامر الشراء والموردين</p>
        </div>
        <button
          onClick={handleAddPurchase}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          أمر شراء جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الأوامر</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
            <ShoppingBag className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">
                {purchases.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تم الاستلام</p>
              <p className="text-2xl font-bold text-green-600">
                {purchases.filter(p => p.status === 'received').length}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي القيمة</p>
              <p className="text-2xl font-bold text-brand-600">
                {purchases.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0).toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="text-brand-400" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'purchases', label: 'أوامر الشراء', icon: ShoppingBag },
              { id: 'suppliers', label: 'الموردين', icon: Truck }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث في أوامر الشراء..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="ordered">تم الطلب</option>
                  <option value="received">تم الاستلام</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              {/* Purchases Table */}
              {filteredPurchases.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أوامر شراء</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإضافة أمر شراء جديد</p>
                  <button
                    onClick={handleAddPurchase}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
                  >
                    <Plus size={18} />
                    أمر شراء جديد
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">رقم الأمر</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المورد</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">التاريخ</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المبلغ</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPurchases.map(purchase => (
                        <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                                <FileText className="text-brand-600" size={16} />
                              </div>
                              <span className="font-semibold text-gray-900 text-sm">{purchase.purchase_number}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-sm text-gray-900">{purchase.supplier_name}</p>
                              <p className="text-xs text-gray-500">{purchase.supplier_phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {new Date(purchase.purchase_date).toLocaleDateString('ar-SA')}
                              </p>
                              {purchase.expected_delivery && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Truck size={12} />
                                  متوقع: {new Date(purchase.expected_delivery).toLocaleDateString('ar-SA')}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-sm">{parseFloat(purchase.total_amount).toFixed(2)} ريال</span>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(purchase.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditPurchase(purchase)}
                                className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                                title="تعديل"
                              >
                                <Edit size={14} />
                              </button>
                              
                              {purchase.status === 'pending' && (
                                <button
                                  onClick={() => updateStatus(purchase.id, 'ordered')}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="تأكيد الطلب"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              
                              {purchase.status === 'ordered' && (
                                <button
                                  onClick={() => updateStatus(purchase.id, 'received')}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                  title="تأكيد الاستلام"
                                >
                                  <Package size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                          <p className="text-sm text-gray-600">{supplier.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">البريد الإلكتروني:</span>
                        <span className="font-medium">{supplier.email || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العنوان:</span>
                        <span className="font-medium">{supplier.address || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي الطلبات:</span>
                        <span className="font-bold text-brand-600">
                          {purchases.filter(p => p.supplier_id === supplier.id).length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPurchase ? 'تعديل أمر الشراء' : 'أمر شراء جديد'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المورد</label>
                  <select
                    value={purchaseForm.supplier_id}
                    onChange={(e) => setPurchaseForm({...purchaseForm, supplier_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">اختر المورد</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الشراء</label>
                  <input
                    type="date"
                    value={purchaseForm.purchase_date}
                    onChange={(e) => setPurchaseForm({...purchaseForm, purchase_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التوصيل المتوقع</label>
                  <input
                    type="date"
                    value={purchaseForm.expected_delivery}
                    onChange={(e) => setPurchaseForm({...purchaseForm, expected_delivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select
                    value={purchaseForm.status}
                    onChange={(e) => setPurchaseForm({...purchaseForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="ordered">تم الطلب</option>
                    <option value="received">تم الاستلام</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  value={purchaseForm.notes}
                  onChange={(e) => setPurchaseForm({...purchaseForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">الأصناف</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    إضافة صنف
                  </button>
                </div>

                <div className="space-y-3">
                  {purchaseForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">المنتج</label>
                        <select
                          value={item.product_id}
                          onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                          required
                        >
                          <option value="">اختر المنتج</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">الكمية</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">سعر الوحدة</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">الإجمالي</label>
                        <input
                          type="text"
                          value={item.total_price?.toFixed(2) || '0.00'}
                          readOnly
                          className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                    <span className="text-xl font-bold text-brand-600">{calculateTotal().toFixed(2)} ريال</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingPurchase ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
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

export default Purchasing;
