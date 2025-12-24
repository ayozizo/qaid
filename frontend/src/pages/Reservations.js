import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Calendar, Clock, Users, MapPin, Phone, 
  Plus, Edit, Trash2, Eye, Search, Filter,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    table_id: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    special_requests: '',
    status: 'confirmed'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, tablesRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/tables')
      ]);
      
      setReservations(reservationsRes.data.data);
      setTables(tablesRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingReservation(null);
    setFormData({
      customer_name: '',
      customer_phone: '',
      table_id: '',
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '',
      party_size: 2,
      special_requests: '',
      status: 'confirmed'
    });
    setShowModal(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      customer_name: reservation.customer_name || '',
      customer_phone: reservation.customer_phone || '',
      table_id: reservation.table_id || '',
      reservation_date: reservation.reservation_date?.split('T')[0] || '',
      reservation_time: reservation.reservation_time || '',
      party_size: reservation.party_size || 2,
      special_requests: reservation.special_requests || '',
      status: reservation.status || 'confirmed'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReservation) {
        await api.put(`/reservations/${editingReservation.id}`, formData);
        toast.success('تم تحديث الحجز بنجاح');
      } else {
        await api.post('/reservations', formData);
        toast.success('تم إضافة الحجز بنجاح');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ الحجز');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      try {
        await api.delete(`/reservations/${id}`);
        toast.success('تم حذف الحجز بنجاح');
        loadData();
      } catch (error) {
        toast.error('خطأ في حذف الحجز');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'مؤكد', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'في الانتظار', icon: AlertCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغي', icon: XCircle },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مكتمل', icon: CheckCircle }
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

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customer_phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = reservation.reservation_date?.split('T')[0] === today;
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = reservation.reservation_date?.split('T')[0] === tomorrow.toISOString().split('T')[0];
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الحجوزات</h2>
          <p className="text-gray-600">إدارة حجوزات الطاولات</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          حجز جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
            <Calendar className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">حجوزات اليوم</p>
              <p className="text-2xl font-bold text-blue-600">
                {reservations.filter(r => r.reservation_date?.split('T')[0] === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <Clock className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الحجوزات المؤكدة</p>
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الطاولات المتاحة</p>
              <p className="text-2xl font-bold text-purple-600">{tables.filter(t => t.status === 'available').length}</p>
            </div>
            <MapPin className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="اسم العميل أو رقم الهاتف..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكد</option>
              <option value="pending">في الانتظار</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="tomorrow">غداً</option>
              <option value="week">هذا الأسبوع</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد حجوزات</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة حجز جديد</p>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
          >
            <Plus size={18} />
            حجز جديد
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">العميل</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الطاولة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">التاريخ والوقت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">عدد الأشخاص</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{reservation.customer_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={12} />
                          {reservation.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-gray-400" size={16} />
                        <span className="text-sm font-medium">طاولة {reservation.table_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(reservation.reservation_date).toLocaleDateString('ar-SA')}
                        </p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {reservation.reservation_time}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Users size={14} className="text-gray-400" />
                        <span className="font-medium">{reservation.party_size}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(reservation.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingReservation ? 'تعديل الحجز' : 'حجز جديد'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الطاولة</label>
                <select
                  value={formData.table_id}
                  onChange={(e) => setFormData({...formData, table_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">اختر الطاولة</option>
                  {tables.filter(t => t.status === 'available').map(table => (
                    <option key={table.id} value={table.id}>
                      طاولة {table.number} - {table.capacity} أشخاص
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={formData.reservation_date}
                    onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوقت</label>
                  <input
                    type="time"
                    value={formData.reservation_time}
                    onChange={(e) => setFormData({...formData, reservation_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأشخاص</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.party_size}
                  onChange={(e) => setFormData({...formData, party_size: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  <option value="confirmed">مؤكد</option>
                  <option value="pending">في الانتظار</option>
                  <option value="cancelled">ملغي</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طلبات خاصة</label>
                <textarea
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                  placeholder="أي طلبات خاصة للحجز..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingReservation ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default Reservations;
