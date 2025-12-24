import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Truck, Settings, ToggleLeft, ToggleRight, 
  MapPin, Clock, DollarSign, Star,
  Smartphone, Wifi, AlertCircle, CheckCircle,
  Plus, Edit, Trash2, Eye, RefreshCw
} from 'lucide-react';

const DeliveryIntegration = () => {
  const [integrations, setIntegrations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    api_key: '',
    secret_key: '',
    webhook_url: '',
    commission_rate: 0,
    is_active: true,
    auto_accept_orders: false,
    delivery_radius: 10
  });

  const platforms = [
    { 
      id: 'talabat', 
      name: 'طلبات', 
      color: 'bg-orange-500',
      icon: '🍔',
      description: 'منصة طلبات الرائدة في المنطقة'
    },
    { 
      id: 'careem', 
      name: 'كريم ناو', 
      color: 'bg-green-500',
      icon: '🚗',
      description: 'خدمة التوصيل من كريم'
    },
    { 
      id: 'uber_eats', 
      name: 'أوبر إيتس', 
      color: 'bg-black',
      icon: '🍕',
      description: 'منصة أوبر للطعام'
    },
    { 
      id: 'hungerstation', 
      name: 'هنقرستيشن', 
      color: 'bg-red-500',
      icon: '🍽️',
      description: 'تطبيق هنقرستيشن للطعام'
    },
    { 
      id: 'jahez', 
      name: 'جاهز', 
      color: 'bg-blue-500',
      icon: '⚡',
      description: 'تطبيق جاهز للتوصيل السريع'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [integrationsRes, ordersRes] = await Promise.all([
        api.get('/delivery/integrations'),
        api.get('/delivery/orders')
      ]);
      
      setIntegrations(integrationsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingIntegration(null);
    setFormData({
      platform: '',
      api_key: '',
      secret_key: '',
      webhook_url: '',
      commission_rate: 0,
      is_active: true,
      auto_accept_orders: false,
      delivery_radius: 10
    });
    setShowConfigModal(true);
  };

  const handleEdit = (integration) => {
    setEditingIntegration(integration);
    setFormData({
      platform: integration.platform || '',
      api_key: integration.api_key || '',
      secret_key: integration.secret_key || '',
      webhook_url: integration.webhook_url || '',
      commission_rate: integration.commission_rate || 0,
      is_active: integration.is_active !== false,
      auto_accept_orders: integration.auto_accept_orders || false,
      delivery_radius: integration.delivery_radius || 10
    });
    setShowConfigModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingIntegration) {
        await api.put(`/delivery/integrations/${editingIntegration.id}`, formData);
        toast.success('تم تحديث التكامل بنجاح');
      } else {
        await api.post('/delivery/integrations', formData);
        toast.success('تم إضافة التكامل بنجاح');
      }
      
      setShowConfigModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ التكامل');
    }
  };

  const toggleIntegration = async (id, isActive) => {
    try {
      await api.put(`/delivery/integrations/${id}`, { is_active: !isActive });
      toast.success(isActive ? 'تم إيقاف التكامل' : 'تم تفعيل التكامل');
      loadData();
    } catch (error) {
      toast.error('خطأ في تحديث التكامل');
    }
  };

  const syncOrders = async (platformId) => {
    try {
      await api.post(`/delivery/sync/${platformId}`);
      toast.success('تم مزامنة الطلبات بنجاح');
      loadData();
    } catch (error) {
      toast.error('خطأ في مزامنة الطلبات');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'جديد' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'مقبول' },
      preparing: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد التحضير' },
      ready: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'جاهز' },
      picked_up: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'تم الاستلام' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'تم التوصيل' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغي' }
    };
    
    const badge = badges[status] || badges.new;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getPlatformInfo = (platformId) => {
    return platforms.find(p => p.id === platformId) || { name: platformId, color: 'bg-gray-500', icon: '📱' };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تكامل التوصيل</h2>
          <p className="text-gray-600">إدارة التكامل مع تطبيقات التوصيل</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          تكامل جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">التكاملات النشطة</p>
              <p className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.is_active).length}
              </p>
            </div>
            <Wifi className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات اليوم</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.created_at?.split('T')[0] === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <Truck className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبيعات التوصيل</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0).toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="text-purple-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط التقييم</p>
              <p className="text-2xl font-bold text-yellow-600">4.8</p>
            </div>
            <Star className="text-yellow-400" size={32} />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">التكاملات المتاحة</h3>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <RefreshCw size={16} />
            تحديث
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(platform => {
            const integration = integrations.find(i => i.platform === platform.id);
            const isActive = integration?.is_active;
            
            return (
              <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                      <p className="text-xs text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  
                  {integration ? (
                    <button
                      onClick={() => toggleIntegration(integration.id, isActive)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isActive ? (
                        <ToggleRight className="text-green-500" size={24} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={24} />
                      )}
                    </button>
                  ) : (
                    <AlertCircle className="text-yellow-500" size={20} />
                  )}
                </div>

                {integration ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الحالة:</span>
                      <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {isActive ? 'نشط' : 'متوقف'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">العمولة:</span>
                      <span className="font-medium">{integration.commission_rate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">نطاق التوصيل:</span>
                      <span className="font-medium">{integration.delivery_radius} كم</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(integration)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors text-sm"
                      >
                        <Settings size={14} />
                        إعدادات
                      </button>
                      <button
                        onClick={() => syncOrders(platform.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                      >
                        <RefreshCw size={14} />
                        مزامنة
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">غير مكون</p>
                    <button
                      onClick={() => {
                        setFormData({...formData, platform: platform.id});
                        handleAdd();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      إعداد التكامل
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">طلبات التوصيل الأخيرة</h3>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="mx-auto text-gray-300 mb-4" size={64} />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات توصيل</h4>
            <p className="text-gray-500">سيتم عرض طلبات التوصيل هنا عند وصولها</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المنصة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">رقم الطلب</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">العميل</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المبلغ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الوقت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 10).map(order => {
                  const platform = getPlatformInfo(order.platform);
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${platform.color} rounded flex items-center justify-center text-white text-sm`}>
                            {platform.icon}
                          </div>
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm">{order.external_order_id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm">{parseFloat(order.total_amount).toFixed(2)} ريال</span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500">
                          <p>{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                          <p>{new Date(order.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingIntegration ? 'تعديل التكامل' : 'تكامل جديد'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنصة</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">اختر المنصة</option>
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مفتاح API</label>
                <input
                  type="text"
                  value={formData.api_key}
                  onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المفتاح السري</label>
                <input
                  type="password"
                  value={formData.secret_key}
                  onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط Webhook</label>
                <input
                  type="url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="https://yourapp.com/webhook/delivery"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({...formData, commission_rate: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نطاق التوصيل (كم)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.delivery_radius}
                    onChange={(e) => setFormData({...formData, delivery_radius: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    تفعيل التكامل
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto_accept"
                    checked={formData.auto_accept_orders}
                    onChange={(e) => setFormData({...formData, auto_accept_orders: e.target.checked})}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="auto_accept" className="text-sm font-medium text-gray-700">
                    قبول الطلبات تلقائياً
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingIntegration ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
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

export default DeliveryIntegration;
