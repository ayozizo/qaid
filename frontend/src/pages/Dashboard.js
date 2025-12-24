import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'مبيعات اليوم',
      value: `${stats?.today?.total_sales?.toLocaleString() || 0}`,
      unit: 'ريال',
      icon: DollarSign,
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      change: '+12%',
      changePositive: true
    },
    {
      title: 'الطلبات اليوم',
      value: stats?.today?.total_orders || 0,
      icon: ShoppingCart,
      bgColor: 'bg-brand-50',
      iconColor: 'text-brand-600',
      change: '+8%',
      changePositive: true
    },
    {
      title: 'الطلبات النشطة',
      value: stats?.active_orders || 0,
      icon: TrendingUp,
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600'
    },
    {
      title: 'إجمالي العملاء',
      value: stats?.total_customers || 0,
      icon: Users,
      bgColor: 'bg-brand-50',
      iconColor: 'text-brand-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="card card-hover card-gradient group relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <Icon size={128} className="text-gray-400" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-semibold mb-3">{stat.title}</p>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">
                      {stat.value}
                      {stat.unit && <span className="text-lg font-medium text-gray-500 mr-2">{stat.unit}</span>}
                    </h3>
                    {stat.change && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          stat.changePositive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500">من الأمس</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${stat.iconColor} group-hover:scale-110 transition-transform duration-300`} size={24} strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      stat.changePositive 
                        ? 'from-emerald-400 to-emerald-600' 
                        : 'from-red-400 to-red-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.abs(parseFloat(stat.change || '0')) * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {stats?.low_stock_count > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start gap-4 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 text-lg mb-2">⚠️ تنبيه: نقص في المخزون</h4>
            <p className="text-amber-700 text-base mb-4">
              هناك <span className="font-bold text-amber-900">{stats.low_stock_count}</span> منتج وصل للحد الأدنى من المخزون
            </p>
            <Link 
              to="/inventory" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              عرض المخزون
              <Package size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Sales Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">مبيعات الأسبوع</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.week_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="day_name" stroke="#667085" style={{ fontSize: '12px' }} />
              <YAxis stroke="#667085" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E4E7EC',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03)'
                }}
              />
              <Bar dataKey="total_sales" fill="#465FFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">الأصناف الأكثر مبيعاً</h3>
          </div>
          {stats?.top_products && stats.top_products.length > 0 ? (
            <div className="space-y-3">
              {stats.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                      <Package className="text-brand-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.total_quantity} طلب</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">
                      {parseFloat(product.total_revenue).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">ريال</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 text-sm">لا توجد بيانات</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link 
            to="/orders/new" 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <ShoppingCart size={18} />
            طلب جديد
          </Link>
          <Link 
            to="/kitchen" 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <Package size={18} />
            المطبخ
          </Link>
          <Link 
            to="/products" 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <Package size={18} />
            المنتجات
          </Link>
          <Link 
            to="/reports" 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <TrendingUp size={18} />
            التقارير
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
