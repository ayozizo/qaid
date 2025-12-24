import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Fingerprint, Clock, CheckCircle, XCircle, 
  User, MapPin, Smartphone, Calendar,
  RefreshCw, Search, Filter, Download
} from 'lucide-react';

const BiometricAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [biometricData, setBiometricData] = useState({
    biometric_id: '',
    location_lat: null,
    location_lng: null,
    device_info: {}
  });
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    employee_id: ''
  });

  useEffect(() => {
    loadEmployees();
    loadAttendanceHistory();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadAttendanceStatus(selectedEmployee);
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الموظفين');
    }
  };

  const loadAttendanceHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      
      const response = await api.get(`/biometric/history?${params}`);
      setAttendanceHistory(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل سجل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStatus = async (employeeId) => {
    try {
      const response = await api.get(`/biometric/status/${employeeId}`);
      setAttendanceStatus(response.data.data);
    } catch (error) {
      console.error('Error loading attendance status:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBiometricData(prev => ({
            ...prev,
            location_lat: position.coords.latitude,
            location_lng: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString()
    };
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/biometric/checkin', {
        employee_id: currentEmployee.id,
        biometric_id: biometricData.biometric_id,
        location_lat: biometricData.location_lat,
        location_lng: biometricData.location_lng,
        device_info: getDeviceInfo()
      });

      toast.success(response.data.message);
      setShowCheckInModal(false);
      setBiometricData({ ...biometricData, biometric_id: '' });
      loadAttendanceStatus(currentEmployee.id);
      loadAttendanceHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في تسجيل الدخول');
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/biometric/checkout', {
        employee_id: currentEmployee.id,
        biometric_id: biometricData.biometric_id,
        location_lat: biometricData.location_lat,
        location_lng: biometricData.location_lng,
        device_info: getDeviceInfo()
      });

      toast.success(response.data.message);
      setShowCheckOutModal(false);
      setBiometricData({ ...biometricData, biometric_id: '' });
      loadAttendanceStatus(currentEmployee.id);
      loadAttendanceHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في تسجيل الخروج');
    }
  };

  const openCheckInModal = (employee) => {
    setCurrentEmployee(employee);
    setShowCheckInModal(true);
  };

  const openCheckOutModal = (employee) => {
    setCurrentEmployee(employee);
    setShowCheckOutModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-blue-100 text-blue-800';
      case 'not_checked_in': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'checked_in': return 'مسجل دخول';
      case 'checked_out': return 'مسجل خروج';
      case 'not_checked_in': return 'لم يسجل دخول';
      default: return status;
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h1 className="text-2xl font-bold text-gray-900">نظام البصمة</h1>
        <button
          onClick={loadAttendanceHistory}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4" />
          تحديث
        </button>
      </div>

      {/* Employee Selection & Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">تسجيل الحضور والانصراف</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الموظف
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر موظف...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} - {employee.employee_code}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && attendanceStatus && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">الحالة الحالية:</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(attendanceStatus.status)}`}>
                  {getStatusText(attendanceStatus.status)}
                </span>
              </div>
              
              <div className="flex gap-2">
                {attendanceStatus.can_check_in && (
                  <button
                    onClick={() => openCheckInModal(employees.find(e => e.id == selectedEmployee))}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    تسجيل دخول
                  </button>
                )}
                
                {attendanceStatus.can_check_out && (
                  <button
                    onClick={() => openCheckOutModal(employees.find(e => e.id == selectedEmployee))}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    تسجيل خروج
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">فلترة السجلات</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموظف
            </label>
            <select
              value={filters.employee_id}
              onChange={(e) => setFilters({...filters, employee_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الموظفين</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={loadAttendanceHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">سجل البصمة</h3>
        </div>
        
        {attendanceHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Fingerprint className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">لا توجد سجلات بصمة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموظف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ والوقت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموقع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الجهاز
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.employee_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.check_type === 'in' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.check_type === 'in' ? (
                          <>
                            <CheckCircle className="h-3 w-3 ml-1" />
                            دخول
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 ml-1" />
                            خروج
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 ml-2" />
                        {formatDateTime(record.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.location_lat && record.location_lng ? (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-xs">
                            {record.location_lat.toFixed(4)}, {record.location_lng.toFixed(4)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">غير متوفر</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 text-gray-400 ml-2" />
                        <span className="text-xs">
                          {record.device_info?.platform || 'غير محدد'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              تسجيل دخول - {currentEmployee?.full_name}
            </h3>
            
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم البصمة أو الرمز *
                </label>
                <input
                  type="text"
                  required
                  value={biometricData.biometric_id}
                  onChange={(e) => setBiometricData({...biometricData, biometric_id: e.target.value})}
                  placeholder="ادخل رقم البصمة أو امسح البصمة"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    الموقع: {biometricData.location_lat ? 'تم تحديده' : 'غير متوفر'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  تسجيل دخول
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check Out Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              تسجيل خروج - {currentEmployee?.full_name}
            </h3>
            
            <form onSubmit={handleCheckOut} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم البصمة أو الرمز *
                </label>
                <input
                  type="text"
                  required
                  value={biometricData.biometric_id}
                  onChange={(e) => setBiometricData({...biometricData, biometric_id: e.target.value})}
                  placeholder="ادخل رقم البصمة أو امسح البصمة"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    الموقع: {biometricData.location_lat ? 'تم تحديده' : 'غير متوفر'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  تسجيل خروج
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckOutModal(false)}
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

export default BiometricAttendance;
