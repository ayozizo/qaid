import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, LogIn, ArrowRight, Building2, Mail, Lock, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, direction, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend expects 'username' field, but we're sending 'email'
      const loginData = {
        username: formData.email, // Backend accepts email as username
        password: formData.password
      };
      
      const response = await api.post('/auth/login', loginData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        toast.success(t('loginSuccess'));
        navigate('/app/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4" dir={direction}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">إدارة الأعمال</h1>
                <p className="text-gray-600">نظام شامل لجميع الأعمال التجارية</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              مرحباً بعودتك!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              سجل دخولك للوصول إلى لوحة التحكم وإدارة عملك بكفاءة
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-900">أداء سريع</h3>
                  <p className="text-gray-600 text-sm">نظام سريع ومتجاوب</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-900">أمان متقدم</h3>
                  <p className="text-gray-600 text-sm">حماية بيانات عالية المستوى</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-900">سهولة الاستخدام</h3>
                  <p className="text-gray-600 text-sm">واجهة بديهية وبسيطة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            
            {/* Language Toggle */}
            <div className="flex justify-end mb-4">
              <LanguageToggle />
            </div>
            
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">إدارة الأعمال</h1>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login')}</h2>
              <p className="text-gray-600">{isRTL ? 'أدخل بياناتك للوصول إلى حسابك' : 'Enter your credentials to access your account'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('username')}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`input ${isRTL ? 'pr-12' : 'pl-12'}`}
                    placeholder={t('username')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`input ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'}`}
                    placeholder={t('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700`}>
                    {isRTL ? 'تذكرني' : 'Remember me'}
                  </span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg font-bold group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {isRTL ? 'جاري تسجيل الدخول...' : 'Logging in...'}
                  </div>
                ) : (
                  <>
                    {t('loginButton')}
                    <ArrowRight className={`group-hover:${isRTL ? 'translate-x-1' : '-translate-x-1'} transition-transform ${isRTL ? '' : 'rotate-180'}`} size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {t('noAccount')}{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
                >
                  {t('registerButton')}
                </Link>
              </p>
            </div>

            {/* Business Demo Accounts */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
              <h4 className="font-bold text-blue-900 text-sm mb-3">🚀 {t('demoAccounts')}:</h4>
              
              {/* Create All Business Accounts Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await api.post('/auth/create-business-demos');
                      if (response.data.success) {
                        toast.success(isRTL ? 'تم إنشاء جميع الحسابات التجريبية بنجاح!' : 'All demo accounts created successfully!');
                        console.log('Business accounts created:', response.data);
                      }
                    } catch (error) {
                      console.error('Create business demos error:', error);
                      toast.error(isRTL ? 'خطأ في إنشاء الحسابات التجريبية' : 'Error creating demo accounts');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  {t('createAllAccounts')}
                </button>
              </div>

              {/* Business Account Options */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'restaurant_demo', password: 'demo123' })}
                  className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg transition-colors"
                >
                  🍽️ {t('restaurant')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'cafe_demo', password: 'demo123' })}
                  className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-lg transition-colors"
                >
                  ☕ {t('cafe')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'supermarket_demo', password: 'demo123' })}
                  className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg transition-colors"
                >
                  🛒 {t('supermarket')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'pharmacy_demo', password: 'demo123' })}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg transition-colors"
                >
                  💊 {t('pharmacy')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'retail_demo', password: 'demo123' })}
                  className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg transition-colors"
                >
                  🏪 {t('retail')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'ecommerce_demo', password: 'demo123' })}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg transition-colors"
                >
                  🌐 {t('ecommerce')}
                </button>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                <p><strong>{t('allAccountsPassword')}:</strong> demo123</p>
              </div>

              {/* Debug Tools */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await api.get('/auth/debug-users');
                      console.log('Users in database:', response.data);
                      toast.info(`يوجد ${response.data.count} مستخدم في قاعدة البيانات`);
                    } catch (error) {
                      console.error('Debug users error:', error);
                      toast.error('خطأ في جلب بيانات المستخدمين');
                    }
                  }}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium underline"
                >
                  تحقق من المستخدمين
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'demo', password: 'demo123' })}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  حساب عام
                </button>
              </div>
            </div>
          </div>

          {/* Back to Landing */}
          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
