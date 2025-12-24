import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Eye, ShoppingCart, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-warning-100', text: 'text-warning-800', label: 'قيد الانتظار' },
      preparing: { bg: 'bg-brand-100', text: 'text-brand-800', label: 'قيد التحضير' },
      ready: { bg: 'bg-success-100', text: 'text-success-800', label: 'جاهز' },
      delivered: { bg: 'bg-success-100', text: 'text-success-800', label: 'تم التوصيل' },
      completed: { bg: 'bg-success-100', text: 'text-success-800', label: 'مكتمل' },
      cancelled: { bg: 'bg-error-100', text: 'text-error-800', label: 'ملغي' }
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getOrderTypeBadge = (type) => {
    const types = {
      'dine-in': { label: 'داخلي', bg: 'bg-blue-50', text: 'text-blue-700' },
      'takeaway': { label: 'سفري', bg: 'bg-purple-50', text: 'text-purple-700' },
      'delivery': { label: 'توصيل', bg: 'bg-orange-50', text: 'text-orange-700' }
    };
    
    const badge = types[type] || { label: type, bg: 'bg-gray-50', text: 'text-gray-700' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الطلبات</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} طلب</p>
        </div>
        <Link 
          to="/orders/new" 
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          طلب جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'الكل' },
            { value: 'pending', label: 'قيد الانتظار' },
            { value: 'preparing', label: 'قيد التحضير' },
            { value: 'ready', label: 'جاهز' },
            { value: 'completed', label: 'مكتمل' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500 text-sm mb-6">ابدأ بإضافة طلب جديد</p>
          <Link 
            to="/orders/new" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <Plus size={18} />
            طلب جديد
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">رقم الطلب</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">النوع</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الطاولة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجمالي</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="text-brand-600" size={16} />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{order.order_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getOrderTypeBadge(order.order_type)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.table_number || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900 text-sm">{parseFloat(order.total_amount).toFixed(2)}</span>
                      <span className="text-xs text-gray-500"> ريال</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} />
                        {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: ar })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors text-sm font-medium">
                        <Eye size={14} />
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
