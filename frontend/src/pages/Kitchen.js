import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Clock, CheckCircle, Play, AlertTriangle, 
  Utensils, Timer, RefreshCw, Filter,
  ChefHat, Package
} from 'lucide-react';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadKitchenOrders();
    loadStats();
    
    // Auto refresh every 15 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadKitchenOrders();
        loadStats();
      }, 15000);
    }
    
    return () => clearInterval(interval);
  }, []);

  const loadKitchenOrders = async () => {
    try {
      const response = await api.get('/kitchen/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error loading kitchen orders');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/kitchen/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/kitchen/orders/${orderId}/status`, { status });
      toast.success('تم تحديث الحالة');
      loadKitchenOrders();
      loadStats();
    } catch (error) {
      toast.error('خطأ في تحديث الحالة');
    }
  };

  const getStatusColor = (status, startedAt) => {
    const now = new Date();
    const started = startedAt ? new Date(startedAt) : null;
    const minutesElapsed = started ? Math.floor((now - started) / 60000) : 0;
    
    const colors = {
      pending: 'bg-yellow-100 border-yellow-400 border-l-4',
      preparing: minutesElapsed > 15 
        ? 'bg-red-100 border-red-400 border-l-4 animate-pulse' 
        : 'bg-blue-100 border-blue-400 border-l-4',
      completed: 'bg-green-100 border-green-400 border-l-4'
    };
    return colors[status] || 'bg-gray-100 border-gray-300';
  };

  const getTimeElapsed = (startedAt) => {
    if (!startedAt) return 0;
    return Math.floor((new Date() - new Date(startedAt)) / 60000);
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="text-brand-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">شاشة المطبخ</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadKitchenOrders();
                loadStats();
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              <RefreshCw size={16} />
              تحديث
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Timer size={16} />
              {autoRefresh ? 'تحديث تلقائي' : 'تحديث يدوي'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm"
          >
            <option value="all">جميع الطلبات</option>
            <option value="pending">في الانتظار</option>
            <option value="preparing">قيد التحضير</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-yellow-50">
          <h4 className="text-sm text-gray-600 mb-1">قيد الانتظار</h4>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="card bg-blue-50">
          <h4 className="text-sm text-gray-600 mb-1">قيد التحضير</h4>
          <p className="text-3xl font-bold text-blue-600">{stats?.preparing || 0}</p>
        </div>
        <div className="card bg-green-50">
          <h4 className="text-sm text-gray-600 mb-1">اكتمل اليوم</h4>
          <p className="text-3xl font-bold text-green-600">{stats?.completed_today || 0}</p>
        </div>
        <div className="card bg-purple-50">
          <h4 className="text-sm text-gray-600 mb-1">متوسط وقت التحضير</h4>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.avg_prep_time ? Math.round(stats.avg_prep_time) : 0} دقيقة
          </p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`p-4 border-2 rounded-lg ${getStatusColor(order.status, order.started_at)} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{order.order_number}</h3>
                  <p className="text-sm text-gray-600">طاولة {order.table_number || '-'}</p>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded">
                  {order.order_type === 'dine-in' ? 'داخلي' : 
                   order.order_type === 'takeaway' ? 'سفري' : 'توصيل'}
                </span>
              </div>

              <div className="bg-white rounded p-3 mb-3">
                <h4 className="font-semibold mb-2">{order.product_name}</h4>
                {order.product_name_ar && (
                  <p className="text-sm text-gray-600 mb-2">{order.product_name_ar}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold">الكمية: {order.quantity}</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock size={14} />
                    {order.preparation_time || 10} دقيقة
                  </span>
                </div>
                {order.item_notes && (
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    ملاحظة: {order.item_notes}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(order.id, 'preparing')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <Play size={16} />
                    بدء التحضير
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus(order.id, 'completed')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <CheckCircle size={16} />
                    إنهاء
                  </button>
                )}
              </div>

              {order.started_at && (
                <div className={`mt-3 text-center p-2 rounded-lg ${
                  getTimeElapsed(order.started_at) > 15 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <Timer size={14} />
                    {getTimeElapsed(order.started_at)} دقيقة
                    {getTimeElapsed(order.started_at) > 15 && (
                      <AlertTriangle size={14} className="text-red-600" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-xl">لا توجد طلبات في المطبخ حالياً</p>
            <p className="text-sm mt-2">سيتم عرض الطلبات الجديدة هنا تلقائياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
