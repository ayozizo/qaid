import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, Clock, Phone, User, CheckCircle, 
  XCircle, AlertCircle, RefreshCw, Plus,
  QrCode, Smartphone, Bell, TrendingUp
} from 'lucide-react';

const DigitalQueue = () => {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_name: '',
    customer_phone: '',
    party_size: 1,
    service_type: 'dine-in'
  });

  useEffect(() => {
    loadQueue();
    loadStats();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadQueue();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const response = await api.get('/queue/current');
      setQueue(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الطابور');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/queue/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddToQueue = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/queue/join', {
        ...newCustomer,
        branch_id: 1 // Default branch, should be dynamic
      });
      
      toast.success(response.data.message);
      setShowAddModal(false);
      setNewCustomer({
        customer_name: '',
        customer_phone: '',
        party_size: 1,
        service_type: 'dine-in'
      });
      loadQueue();
      loadStats();
    } catch (error) {
      toast.error('خطأ في إضافة العميل للطابور');
    }
  };

  const handleCallCustomer = async (id) => {
    try {
      const response = await api.put(`/queue/${id}/call`);
      toast.success(response.data.message);
      loadQueue();
      loadStats();
    } catch (error) {
      toast.error('خطأ في استدعاء العميل');
    }
  };

  const handleServeCustomer = async (id) => {
    try {
      const response = await api.put(`/queue/${id}/serve`);
      toast.success(response.data.message);
      loadQueue();
      loadStats();
    } catch (error) {
      toast.error('خطأ في خدمة العميل');
    }
  };

  const handleCancelCustomer = async (id) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا العميل؟')) {
      try {
        const response = await api.delete(`/queue/${id}`);
        toast.success(response.data.message);
        loadQueue();
        loadStats();
      } catch (error) {
        toast.error('خطأ في إلغاء العميل');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'called': return 'bg-blue-100 text-blue-800';
      case 'served': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'في الانتظار';
      case 'called': return 'تم الاستدعاء';
      case 'served': return 'تم الخدمة';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">الطابور الرقمي</h1>
        <div className="flex gap-3">
          <button
            onClick={loadQueue}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="h-4 w-4" />
            تحديث
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            إضافة عميل
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{stats.waiting_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">تم الاستدعاء</p>
              <p className="text-2xl font-bold text-gray-900">{stats.called_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">تم خدمتهم اليوم</p>
              <p className="text-2xl font-bold text-gray-900">{stats.served_today || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">متوسط الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avg_wait_time ? Math.round(stats.avg_wait_time) : 0} د
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">قائمة الانتظار</h3>
        </div>
        
        {queue.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">لا يوجد عملاء في الطابور حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {queue.map((customer) => (
              <div key={customer.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {customer.queue_number}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {customer.customer_name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {customer.customer_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {customer.customer_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {customer.party_size} أشخاص
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(customer.created_at).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                    {getStatusText(customer.status)}
                  </span>
                  
                  <div className="flex gap-2">
                    {customer.status === 'waiting' && (
                      <button
                        onClick={() => handleCallCustomer(customer.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="استدعاء العميل"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                    )}
                    
                    {customer.status === 'called' && (
                      <button
                        onClick={() => handleServeCustomer(customer.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="تم خدمة العميل"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    
                    {customer.status !== 'served' && (
                      <button
                        onClick={() => handleCancelCustomer(customer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="إلغاء العميل"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة عميل جديد للطابور</h3>
            
            <form onSubmit={handleAddToQueue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer({...newCustomer, customer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={newCustomer.customer_phone}
                  onChange={(e) => setNewCustomer({...newCustomer, customer_phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأشخاص
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newCustomer.party_size}
                  onChange={(e) => setNewCustomer({...newCustomer, party_size: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الخدمة
                </label>
                <select
                  value={newCustomer.service_type}
                  onChange={(e) => setNewCustomer({...newCustomer, service_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dine-in">تناول في المطعم</option>
                  <option value="takeaway">طلب خارجي</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  إضافة للطابور
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
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

export default DigitalQueue;
