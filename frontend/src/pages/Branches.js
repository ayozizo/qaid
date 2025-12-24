import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit, MapPin, Phone, Clock, TrendingUp, DollarSign, X, Trash2 } from 'lucide-react';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    phone: '',
    opening_time: '08:00',
    closing_time: '22:00',
    manager_id: '',
    is_active: true
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الفروع');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      phone: '',
      opening_time: '08:00',
      closing_time: '22:00',
      manager_id: '',
      is_active: true
    });
    setShowAddModal(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name || '',
      code: branch.code || '',
      address: branch.address || '',
      city: branch.city || '',
      phone: branch.phone || '',
      opening_time: branch.opening_time || '08:00',
      closing_time: branch.closing_time || '22:00',
      manager_id: branch.manager_id || '',
      is_active: branch.is_active !== false
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      toast.error('يرجى إدخال اسم الفرع والرمز');
      return;
    }

    try {
      if (editingBranch) {
        await api.put(`/branches/${editingBranch.id}`, formData);
        toast.success('تم تحديث الفرع بنجاح');
      } else {
        await api.post('/branches', formData);
        toast.success('تم إضافة الفرع بنجاح');
      }
      
      setShowAddModal(false);
      loadBranches();
    } catch (error) {
      toast.error(editingBranch ? 'خطأ في تحديث الفرع' : 'خطأ في إضافة الفرع');
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
      try {
        await api.delete(`/branches/${branchId}`);
        toast.success('تم حذف الفرع بنجاح');
        loadBranches();
      } catch (error) {
        toast.error('خطأ في حذف الفرع');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الفروع</h2>
          <p className="text-gray-600">إدارة جميع فروع المطاعم</p>
        </div>
        <button onClick={handleAddBranch} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm">
          <Plus size={18} />
          فرع جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الفروع</p>
              <p className="text-2xl font-bold text-blue-600">{branches.length}</p>
            </div>
            <MapPin className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الفروع النشطة</p>
              <p className="text-2xl font-bold text-green-600">
                {branches.filter(b => b.is_active).length}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبيعات اليوم</p>
              <p className="text-xl font-bold text-orange-600">0 ريال</p>
            </div>
            <DollarSign className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">أفضل فرع</p>
              <p className="text-sm font-bold text-purple-600">-</p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{branch.name}</h3>
                <span className="text-sm text-gray-500">#{branch.code}</span>
              </div>
              {branch.is_active ? (
                <span className="badge badge-success">نشط</span>
              ) : (
                <span className="badge badge-danger">غير نشط</span>
              )}
            </div>

            <div className="space-y-3">
              {branch.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{branch.address}</span>
                </div>
              )}

              {branch.city && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-700">{branch.city}</span>
                </div>
              )}

              {branch.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{branch.phone}</span>
                </div>
              )}

              {(branch.opening_time || branch.closing_time) && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-700">
                    {branch.opening_time} - {branch.closing_time}
                  </span>
                </div>
              )}

              {branch.manager_name && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">المدير</p>
                  <p className="text-sm font-medium text-gray-900">{branch.manager_name}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <button 
                onClick={() => handleEditBranch(branch)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors text-sm font-medium"
              >
                <Edit size={16} />
                تعديل
              </button>
              <button 
                onClick={() => handleDeleteBranch(branch.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="card text-center py-12">
          <MapPin className="mx-auto text-gray-300" size={64} />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">لا توجد فروع</h3>
          <p className="mt-2 text-gray-600">ابدأ بإضافة فرع جديد</p>
          <button onClick={handleAddBranch} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mt-4">
            <Plus size={18} />
            إضافة فرع
          </button>
        </div>
      )}

      {/* Add/Edit Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBranch ? 'تعديل الفرع' : 'إضافة فرع جديد'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الفرع *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز الفرع *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="مثال: MAIN"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت الفتح
                  </label>
                  <input
                    type="time"
                    value={formData.opening_time}
                    onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت الإغلاق
                  </label>
                  <input
                    type="time"
                    value={formData.closing_time}
                    onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  فرع نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingBranch ? 'تحديث الفرع' : 'إضافة الفرع'}
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

export default Branches;
