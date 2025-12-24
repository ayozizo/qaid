import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff,
  ArrowRight,
  CheckCircle,
  Utensils,
  ShoppingCart,
  Coffee,
  Heart,
  Globe,
  Store
} from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Business Info
    businessName: '',
    businessType: '',
    city: '',
    address: '',
    
    // Step 3: Business Details
    employeesCount: '',
    expectedOrders: '',
    hasMultipleBranches: false
  });

  const businessTypes = [
    {
      id: 'restaurant',
      icon: Utensils,
      title: 'مطعم',
      description: 'إدارة المطاعم والوجبات السريعة',
      features: ['نقاط البيع', 'إدارة الطاولات', 'قوائم الطعام', 'التوصيل']
    },
    {
      id: 'cafe',
      icon: Coffee,
      title: 'كافيه',
      description: 'إدارة الكافيهات والمشروبات',
      features: ['قائمة المشروبات', 'برنامج الولاء', 'العروض', 'الطلبات السريعة']
    },
    {
      id: 'supermarket',
      icon: ShoppingCart,
      title: 'سوبر ماركت',
      description: 'إدارة البقالة والمواد الغذائية',
      features: ['إدارة المخزون', 'الباركود', 'نقاط البيع', 'التقارير']
    },
    {
      id: 'pharmacy',
      icon: Heart,
      title: 'صيدلية',
      description: 'إدارة الصيدليات والأدوية',
      features: ['إدارة الأدوية', 'تواريخ الانتهاء', 'الوصفات', 'التأمين']
    },
    {
      id: 'retail',
      icon: Store,
      title: 'محل تجاري',
      description: 'إدارة المحلات التجارية العامة',
      features: ['نقاط البيع', 'إدارة العملاء', 'المبيعات', 'التقارير']
    },
    {
      id: 'ecommerce',
      icon: Globe,
      title: 'تجارة إلكترونية',
      description: 'إدارة المتاجر الإلكترونية',
      features: ['المتجر الإلكتروني', 'إدارة الطلبات', 'الدفع الإلكتروني', 'الشحن']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare registration data
      const registrationData = {
        username: formData.email.split('@')[0], // Use email prefix as username
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone,
        business_name: formData.businessName,
        business_type: formData.businessType,
        city: formData.city,
        address: formData.address,
        employees_count: formData.employeesCount,
        expected_orders: formData.expectedOrders,
        has_multiple_branches: formData.hasMultipleBranches
      };

      console.log('Registration data:', registrationData);

      // Send registration request
      const response = await api.post('/auth/register', registrationData);

      if (response.data.success) {
        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
        // Navigate to login page instead of setup wizard
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'خطأ في إنشاء الحساب';
      toast.error(errorMessage);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && 
               formData.password && formData.password === formData.confirmPassword;
      case 2:
        return formData.businessName && formData.businessType && formData.city;
      case 3:
        return formData.employeesCount && formData.expectedOrders;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Building2 className="text-white" size={28} />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">إدارة الأعمال</h1>
              <p className="text-sm text-gray-500">نظام شامل لجميع الأعمال التجارية</p>
            </div>
          </Link>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? <CheckCircle size={20} /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">معلوماتك الشخصية</h2>
                <p className="text-gray-600">ابدأ بإدخال معلوماتك الأساسية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input pr-12"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input pr-12"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input pr-12"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input pr-12 pl-12"
                      placeholder="كلمة مرور قوية"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input pr-12"
                      placeholder="أعد إدخال كلمة المرور"
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">كلمات المرور غير متطابقة</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Type */}
          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">نوع عملك التجاري</h2>
                <p className="text-gray-600">اختر نوع العمل الذي تريد إدارته</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {businessTypes.map((business) => {
                  const Icon = business.icon;
                  return (
                    <div
                      key={business.id}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: business.id }))}
                      className={`card cursor-pointer transition-all duration-300 ${
                        formData.businessType === business.id
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          formData.businessType === business.id
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{business.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{business.description}</p>
                      <div className="space-y-1">
                        {business.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="text-green-500 flex-shrink-0" size={14} />
                            <span className="text-xs text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم العمل التجاري</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="اسم مطعمك أو محلك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المدينة</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input pr-12"
                      placeholder="الرياض، جدة، الدمام..."
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان (اختياري)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="العنوان التفصيلي"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">تفاصيل عملك</h2>
                <p className="text-gray-600">ساعدنا في تخصيص النظام حسب احتياجاتك</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">عدد الموظفين</label>
                  <select
                    name="employeesCount"
                    value={formData.employeesCount}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">اختر عدد الموظفين</option>
                    <option value="1-5">1-5 موظفين</option>
                    <option value="6-15">6-15 موظف</option>
                    <option value="16-50">16-50 موظف</option>
                    <option value="50+">أكثر من 50 موظف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">متوسط الطلبات اليومية المتوقعة</label>
                  <select
                    name="expectedOrders"
                    value={formData.expectedOrders}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">اختر متوسط الطلبات</option>
                    <option value="1-20">1-20 طلب</option>
                    <option value="21-50">21-50 طلب</option>
                    <option value="51-100">51-100 طلب</option>
                    <option value="100+">أكثر من 100 طلب</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasMultipleBranches"
                      checked={formData.hasMultipleBranches}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      لدي أو أخطط لفتح فروع متعددة
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">ملخص اختياراتك:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">نوع العمل:</span> {businessTypes.find(b => b.id === formData.businessType)?.title}</p>
                  <p><span className="font-semibold">اسم العمل:</span> {formData.businessName}</p>
                  <p><span className="font-semibold">المدينة:</span> {formData.city}</p>
                  <p><span className="font-semibold">عدد الموظفين:</span> {formData.employeesCount}</p>
                  <p><span className="font-semibold">الطلبات المتوقعة:</span> {formData.expectedOrders}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn btn-outline"
                >
                  السابق
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                لديك حساب؟ سجل دخولك
              </Link>
              <button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="btn btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 ? 'إنشاء الحساب' : 'التالي'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
