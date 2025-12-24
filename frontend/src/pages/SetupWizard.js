import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Palette,
  CreditCard,
  Printer,
  Upload,
  Zap,
  Users,
  Store
} from 'lucide-react';

const SetupWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const businessType = location.state?.businessType || 'restaurant';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    // Step 1: System Configuration
    currency: 'SAR',
    language: 'ar',
    timezone: 'Asia/Riyadh',
    taxRate: 15,
    
    // Step 2: Business Customization
    primaryColor: '#3B82F6',
    logoUrl: '',
    businessHours: {
      open: '08:00',
      close: '22:00'
    },
    
    // Step 3: Payment Methods
    paymentMethods: {
      cash: true,
      card: false,
      digital: false
    },
    
    // Step 4: Hardware Setup
    printerEnabled: false,
    barcodeScanner: false,
    cashDrawer: false,
    
    // Step 5: Initial Data
    importData: false,
    sampleData: true
  });

  const steps = [
    {
      id: 1,
      title: 'إعدادات النظام',
      description: 'العملة واللغة والضرائب',
      icon: Settings
    },
    {
      id: 2,
      title: 'تخصيص المظهر',
      description: 'الألوان والشعار وساعات العمل',
      icon: Palette
    },
    {
      id: 3,
      title: 'طرق الدفع',
      description: 'تفعيل وسائل الدفع المختلفة',
      icon: CreditCard
    },
    {
      id: 4,
      title: 'الأجهزة والطابعات',
      description: 'ربط الطابعات والماسحات',
      icon: Printer
    },
    {
      id: 5,
      title: 'البيانات الأولية',
      description: 'استيراد أو إنشاء بيانات تجريبية',
      icon: Upload
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete setup
      completeSetup();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = () => {
    // Save setup data and navigate to dashboard
    console.log('Setup completed:', setupData);
    navigate('/app/dashboard');
  };

  const updateSetupData = (field, value) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Building2 className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إعداد النظام</h1>
                <p className="text-gray-600">خطوات بسيطة لتخصيص نظامك</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              الخطوة {currentStep} من {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                        : isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle size={24} /> : <Icon size={24} />}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`font-bold text-sm ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 max-w-20">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            
            {/* Step 1: System Configuration */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">إعدادات النظام الأساسية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">العملة</label>
                    <select 
                      value={setupData.currency}
                      onChange={(e) => updateSetupData('currency', e.target.value)}
                      className="input"
                    >
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="AED">درهم إماراتي (AED)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">المنطقة الزمنية</label>
                    <select 
                      value={setupData.timezone}
                      onChange={(e) => updateSetupData('timezone', e.target.value)}
                      className="input"
                    >
                      <option value="Asia/Riyadh">الرياض</option>
                      <option value="Asia/Dubai">دبي</option>
                      <option value="Asia/Kuwait">الكويت</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">معدل الضريبة (%)</label>
                    <input
                      type="number"
                      value={setupData.taxRate}
                      onChange={(e) => updateSetupData('taxRate', parseFloat(e.target.value))}
                      className="input"
                      placeholder="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">لغة النظام</label>
                    <select 
                      value={setupData.language}
                      onChange={(e) => updateSetupData('language', e.target.value)}
                      className="input"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Customization */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">تخصيص مظهر النظام</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اللون الأساسي</label>
                    <div className="flex gap-4">
                      {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSetupData('primaryColor', color)}
                          className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
                            setupData.primaryColor === color ? 'ring-4 ring-gray-300 scale-110' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ساعة الفتح</label>
                      <input
                        type="time"
                        value={setupData.businessHours.open}
                        onChange={(e) => updateSetupData('businessHours', {
                          ...setupData.businessHours,
                          open: e.target.value
                        })}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ساعة الإغلاق</label>
                      <input
                        type="time"
                        value={setupData.businessHours.close}
                        onChange={(e) => updateSetupData('businessHours', {
                          ...setupData.businessHours,
                          close: e.target.value
                        })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} />
                السابق
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">
                  {Math.round((currentStep / steps.length) * 100)}% مكتمل
                </div>
                <div className="w-48 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                onClick={handleNext}
                className="btn btn-primary group"
              >
                {currentStep === steps.length ? 'إنهاء الإعداد' : 'التالي'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
