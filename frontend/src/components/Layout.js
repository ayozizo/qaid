import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ChefHat,
  Warehouse,
  Building2,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Calculator,
  Receipt,
  Star,
  Calendar,
  Truck,
  ShoppingBag,
  Clock,
  Fingerprint
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/pos', icon: Calculator, label: 'نقاط البيع' },
    { path: '/orders', icon: ShoppingCart, label: 'الطلبات' },
    { path: '/kitchen', icon: ChefHat, label: 'المطبخ' },
    { path: '/invoices', icon: Receipt, label: 'الفواتير' },
    { path: '/loyalty', icon: Star, label: 'نقاط الولاء' },
    { path: '/reservations', icon: Calendar, label: 'الحجوزات' },
    { path: '/queue', icon: Clock, label: 'الطابور الرقمي' },
    { path: '/delivery', icon: Truck, label: 'التوصيل' },
    { path: '/notifications', icon: Bell, label: 'الإشعارات' },
    { path: '/products', icon: Package, label: 'المنتجات' },
    { path: '/inventory', icon: Warehouse, label: 'المخزون' },
    { path: '/customers', icon: Users, label: 'العملاء' },
    { path: '/employees', icon: Users, label: 'الموظفين' },
    { path: '/biometric', icon: Fingerprint, label: 'نظام البصمة' },
    { path: '/branches', icon: Building2, label: 'الفروع' },
    { path: '/reports', icon: BarChart3, label: 'التقارير' },
  ];

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 transition-all duration-500 ease-in-out flex flex-col fixed h-full z-50 lg:relative ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } backdrop-blur-xl shadow-2xl`}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 50%, rgba(17, 24, 39, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Logo & Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/images/logo.png" 
                  alt="سفرة برو" 
                  className="w-10 h-10 rounded-xl object-cover shadow-lg ring-2 ring-white/20"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">سفرة برو</h1>
                <p className="text-xs text-gray-400">نظام إدارة المطاعم</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item group relative ${
                    isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                  } mx-2 my-1`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-full"></div>
                  )}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : 'group-hover:bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </div>
                  {sidebarOpen && (
                    <span className={`flex-1 font-medium transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4 mt-auto">
          {sidebarOpen ? (
            <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.full_name || 'المدير'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.role || 'مدير النظام'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 mx-2"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-red-500/20 transition-all duration-300">
              <LogOut className="w-5 h-5" />
            </div>
            {sidebarOpen && <span className="flex-1 font-medium">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-6 flex items-center justify-between z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative hidden sm:block">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في سفرة برو..."
                className="w-80 pr-12 pl-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative flex items-center justify-center w-12 h-12 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105 group">
              <Bell size={20} />
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                3
              </span>
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-r border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {new Date().getDate()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
          <div className="p-6 md:p-8 mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
