import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, UserCheck, UserX, Clock, Award, X, Users } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    employee_code: '',
    branch_id: '',
    position: '',
    department: '',
    hire_date: '',
    salary: '',
    employment_type: 'full-time',
    is_active: true
  });

  useEffect(() => {
    loadEmployees();
    loadBranches();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الموظفين');
    } finally {
      setLoading(false);
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

  const generateEmployeeCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `EMP${timestamp}`;
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      employee_code: generateEmployeeCode(),
      branch_id: '',
      position: '',
      department: '',
      hire_date: new Date().toISOString().split('T')[0],
      salary: '',
      employment_type: 'full-time',
      is_active: true
    });
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      username: employee.username || '',
      email: employee.email || '',
      password: '',
      full_name: employee.full_name || '',
      phone: employee.phone || '',
      employee_code: employee.employee_code || '',
      branch_id: employee.branch_id || '',
      position: employee.position || '',
      department: employee.department || '',
      hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
      salary: employee.salary || '',
      employment_type: employee.employment_type || 'full-time',
      is_active: employee.is_active !== false
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.employee_code) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني ورقم الموظف');
      return;
    }

    if (!editingEmployee && !formData.password) {
      toast.error('يرجى إدخال كلمة المرور للموظف الجديد');
      return;
    }

    try {
      const submitData = { ...formData };
      if (editingEmployee && !submitData.password) {
        delete submitData.password; // Don't update password if empty
      }

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, submitData);
        toast.success('تم تحديث الموظف بنجاح');
      } else {
        await api.post('/employees', submitData);
        toast.success('تم إضافة الموظف بنجاح');
      }
      
      setShowAddModal(false);
      loadEmployees();
    } catch (error) {
      toast.error(editingEmployee ? 'خطأ في تحديث الموظف' : 'خطأ في إضافة الموظف');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      try {
        await api.delete(`/employees/${employeeId}`);
        toast.success('تم حذف الموظف بنجاح');
        loadEmployees();
      } catch (error) {
        toast.error('خطأ في حذف الموظف');
      }
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await api.post(`/employees/${employeeId}/checkin`);
      toast.success('تم تسجيل الحضور بنجاح');
      loadEmployees();
    } catch (error) {
      toast.error('خطأ في تسجيل الحضور');
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await api.put(`/employees/${employeeId}/checkout`);
      toast.success('تم تسجيل الانصراف بنجاح');
      loadEmployees();
    } catch (error) {
      toast.error('خطأ في تسجيل الانصراف');
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
          <h2 className="text-2xl font-bold">إدارة الموظفين</h2>
          <p className="text-gray-600">إدارة بيانات الموظفين والحضور والانصراف</p>
        </div>
        <button onClick={handleAddEmployee} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm">
          <Plus size={18} />
          موظف جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
            </div>
            <UserCheck className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الموظفين النشطين</p>
              <p className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.is_active).length}
              </p>
            </div>
            <UserCheck className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الحاضرين اليوم</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <Clock className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موظف الشهر</p>
              <p className="text-sm font-bold text-purple-600">قريباً</p>
            </div>
            <Award className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>رقم الموظف</th>
              <th>الاسم</th>
              <th>الوظيفة</th>
              <th>القسم</th>
              <th>الفرع</th>
              <th>تاريخ التعيين</th>
              <th>الراتب</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td className="font-mono">{employee.employee_code}</td>
                  <td>
                    <div>
                      <p className="font-medium">{employee.full_name}</p>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                    </div>
                  </td>
                  <td>{employee.position || '-'}</td>
                  <td>{employee.department || '-'}</td>
                  <td>{employee.branch_name || '-'}</td>
                  <td>
                    {employee.hire_date 
                      ? format(new Date(employee.hire_date), 'dd/MM/yyyy')
                      : '-'
                    }
                  </td>
                  <td>
                    {employee.salary 
                      ? `${parseFloat(employee.salary).toLocaleString()} ريال`
                      : '-'
                    }
                  </td>
                  <td>
                    {employee.is_active ? (
                      <span className="badge badge-success">نشط</span>
                    ) : (
                      <span className="badge badge-danger">غير نشط</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheckIn(employee.id)}
                        className="btn btn-success btn-sm"
                        title="تسجيل حضور"
                      >
                        <UserCheck size={16} />
                      </button>
                      <button
                        onClick={() => handleCheckOut(employee.id)}
                        className="btn btn-secondary btn-sm"
                        title="تسجيل انصراف"
                      >
                        <UserX size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                        title="تعديل"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  لا يوجد موظفين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEmployee ? 'تعديل الموظف' : 'إضافة موظف جديد'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">المعلومات الشخصية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      required
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور {!editingEmployee && '*'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      required={!editingEmployee}
                      placeholder={editingEmployee ? "اتركها فارغة إذا لم ترد التغيير" : ""}
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">معلومات الوظيفة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الموظف *
                    </label>
                    <input
                      type="text"
                      value={formData.employee_code}
                      onChange={(e) => setFormData({...formData, employee_code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفرع
                    </label>
                    <select
                      value={formData.branch_id}
                      onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    >
                      <option value="">اختر الفرع</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنصب
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                      placeholder="مثال: كاشير، طباخ، مدير"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسم
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    >
                      <option value="">اختر القسم</option>
                      <option value="مطبخ">مطبخ</option>
                      <option value="خدمة العملاء">خدمة العملاء</option>
                      <option value="إدارة">إدارة</option>
                      <option value="محاسبة">محاسبة</option>
                      <option value="تسليم">تسليم</option>
                      <option value="تنظيف">تنظيف</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ التعيين
                    </label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الراتب (ريال)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع التوظيف
                    </label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    >
                      <option value="full-time">دوام كامل</option>
                      <option value="part-time">دوام جزئي</option>
                      <option value="contract">عقد مؤقت</option>
                      <option value="intern">متدرب</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="employee_is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="employee_is_active" className="text-sm font-medium text-gray-700">
                      موظف نشط
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingEmployee ? 'تحديث الموظف' : 'إضافة الموظف'}
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

export default Employees;
