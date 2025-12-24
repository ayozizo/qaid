import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// ترجمات النظام
const translations = {
  ar: {
    // Navigation & Layout
    dashboard: 'لوحة التحكم',
    pos: 'نقاط البيع',
    orders: 'الطلبات',
    products: 'المنتجات',
    inventory: 'المخزون',
    customers: 'العملاء',
    employees: 'الموظفين',
    reports: 'التقارير',
    notifications: 'الإشعارات',
    logout: 'تسجيل الخروج',
    
    // Login & Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    username: 'اسم المستخدم أو البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    loginButton: 'تسجيل الدخول',
    registerButton: 'إنشاء حساب جديد',
    forgotPassword: 'نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    
    // Business Types
    restaurant: 'مطعم',
    cafe: 'كافيه',
    supermarket: 'سوبر ماركت',
    pharmacy: 'صيدلية',
    retail: 'محل تجاري',
    ecommerce: 'تجارة إلكترونية',
    
    // Business Names
    restaurantName: 'مطعم الأصالة',
    cafeName: 'كافيه الصباح',
    supermarketName: 'سوبر ماركت النور',
    pharmacyName: 'صيدلية الشفاء',
    retailName: 'محل التجارة',
    ecommerceName: 'متجر إلكتروني',
    
    // Business Descriptions
    restaurantDesc: 'نظام إدارة المطاعم',
    cafeDesc: 'نظام إدارة الكافيهات',
    supermarketDesc: 'نظام إدارة السوبر ماركت',
    pharmacyDesc: 'نظام إدارة الصيدليات',
    retailDesc: 'نظام إدارة المحلات التجارية',
    ecommerceDesc: 'نظام التجارة الإلكترونية',
    
    // Cafe Specific
    drinks: 'قائمة المشروبات',
    drinkMenu: 'قائمة المشروبات',
    loyaltyProgram: 'برنامج الولاء',
    peakHours: 'أوقات الذروة',
    popularDrinks: 'المشروبات الأكثر طلباً',
    
    // Pharmacy Specific
    medicines: 'الأدوية',
    prescriptions: 'الوصفات الطبية',
    expiry: 'تواريخ الانتهاء',
    expiringMedicines: 'أدوية قاربت على الانتهاء',
    requiresPrescription: 'يحتاج وصفة',
    
    // Supermarket Specific
    barcode: 'مسح الباركود',
    categories: 'الفئات',
    suppliers: 'الموردين',
    lowStock: 'مخزون منخفض',
    alerts: 'تنبيهات المخزون',
    
    // Retail Specific
    payments: 'طرق الدفع',
    branches: 'الفروع',
    sales: 'المبيعات',
    
    // E-commerce Specific
    website: 'إدارة الموقع',
    analytics: 'تحليلات الموقع',
    shipping: 'الشحن والتوصيل',
    
    // Restaurant Specific
    kitchen: 'المطبخ',
    menu: 'قائمة الطعام',
    tables: 'الطاولات',
    reservations: 'الحجوزات',
    delivery: 'التوصيل',
    
    // Common Actions
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'البحث',
    filter: 'تصفية',
    
    // Stats & Numbers
    todayRevenue: 'إيرادات اليوم',
    todayOrders: 'طلبات اليوم',
    totalCustomers: 'إجمالي العملاء',
    totalProducts: 'إجمالي المنتجات',
    available: 'متوفر',
    unavailable: 'غير متوفر',
    
    // Demo Accounts
    demoAccounts: 'حسابات تجريبية للأعمال',
    createAllAccounts: 'إنشاء جميع الحسابات التجريبية',
    fillData: 'املأ البيانات',
    createDemoAccount: 'إنشاء حساب تجريبي',
    checkUsers: 'تحقق من المستخدمين',
    resetAccount: 'إعادة تعيين الحساب',
    generalAccount: 'حساب عام',
    allAccountsPassword: 'كلمة المرور لجميع الحسابات',
    
    // Messages
    loginSuccess: 'مرحباً بك! تم تسجيل الدخول بنجاح',
    loginError: 'خطأ في تسجيل الدخول',
    accountCreated: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول',
    accountCreationError: 'خطأ في إنشاء الحساب',
    
    // Language
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English'
  },
  
  en: {
    // Navigation & Layout
    dashboard: 'Dashboard',
    pos: 'Point of Sale',
    orders: 'Orders',
    products: 'Products',
    inventory: 'Inventory',
    customers: 'Customers',
    employees: 'Employees',
    reports: 'Reports',
    notifications: 'Notifications',
    logout: 'Logout',
    
    // Login & Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    username: 'Username or Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    loginButton: 'Login',
    registerButton: 'Create New Account',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    
    // Business Types
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    supermarket: 'Supermarket',
    pharmacy: 'Pharmacy',
    retail: 'Retail Store',
    ecommerce: 'E-commerce',
    
    // Business Names
    restaurantName: 'Authenticity Restaurant',
    cafeName: 'Morning Cafe',
    supermarketName: 'Al-Noor Supermarket',
    pharmacyName: 'Al-Shifa Pharmacy',
    retailName: 'Trade Store',
    ecommerceName: 'Online Store',
    
    // Business Descriptions
    restaurantDesc: 'Restaurant Management System',
    cafeDesc: 'Cafe Management System',
    supermarketDesc: 'Supermarket Management System',
    pharmacyDesc: 'Pharmacy Management System',
    retailDesc: 'Retail Store Management System',
    ecommerceDesc: 'E-commerce Management System',
    
    // Cafe Specific
    drinks: 'Drinks Menu',
    drinkMenu: 'Drinks Menu',
    loyaltyProgram: 'Loyalty Program',
    peakHours: 'Peak Hours',
    popularDrinks: 'Popular Drinks',
    
    // Pharmacy Specific
    medicines: 'Medicines',
    prescriptions: 'Prescriptions',
    expiry: 'Expiry Dates',
    expiringMedicines: 'Expiring Soon',
    requiresPrescription: 'Requires Prescription',
    
    // Supermarket Specific
    barcode: 'Barcode Scanner',
    categories: 'Categories',
    suppliers: 'Suppliers',
    lowStock: 'Low Stock',
    alerts: 'Stock Alerts',
    
    // Retail Specific
    payments: 'Payment Methods',
    branches: 'Branches',
    sales: 'Sales',
    
    // E-commerce Specific
    website: 'Website Management',
    analytics: 'Website Analytics',
    shipping: 'Shipping & Delivery',
    
    // Restaurant Specific
    kitchen: 'Kitchen',
    menu: 'Menu',
    tables: 'Tables',
    reservations: 'Reservations',
    delivery: 'Delivery',
    
    // Common Actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    
    // Stats & Numbers
    todayRevenue: "Today's Revenue",
    todayOrders: "Today's Orders",
    totalCustomers: 'Total Customers',
    totalProducts: 'Total Products',
    available: 'Available',
    unavailable: 'Unavailable',
    
    // Demo Accounts
    demoAccounts: 'Business Demo Accounts',
    createAllAccounts: 'Create All Demo Accounts',
    fillData: 'Fill Data',
    createDemoAccount: 'Create Demo Account',
    checkUsers: 'Check Users',
    resetAccount: 'Reset Account',
    generalAccount: 'General Account',
    allAccountsPassword: 'Password for all accounts',
    
    // Messages
    loginSuccess: 'Welcome! Login successful',
    loginError: 'Login error',
    accountCreated: 'Account created successfully! You can now login',
    accountCreationError: 'Account creation error',
    
    // Language
    language: 'Language',
    arabic: 'العربية',
    english: 'English'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // جلب اللغة من localStorage أو استخدام العربية كافتراضي
    return localStorage.getItem('language') || 'ar';
  });

  const [direction, setDirection] = useState(language === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    // حفظ اللغة في localStorage
    localStorage.setItem('language', language);
    
    // تحديث الاتجاه
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = newDirection;
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    direction,
    changeLanguage,
    t,
    isRTL: language === 'ar',
    isLTR: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
