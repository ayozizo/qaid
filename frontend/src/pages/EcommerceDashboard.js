import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, ShoppingCart, Package, DollarSign, Users, Truck, MousePointer } from 'lucide-react';

const EcommerceDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 18750,
    todayOrders: 127,
    websiteVisitors: 2847,
    conversionRate: 3.2,
    topProducts: [
      { name: 'لابتوب Dell XPS', sales: 12, revenue: 18000 },
      { name: 'هاتف iPhone 15', sales: 18, revenue: 16200 },
      { name: 'سماعات AirPods', sales: 24, revenue: 4800 },
      { name: 'ساعة ذكية', sales: 15, revenue: 3750 }
    ],
    orderStatus: [
      { status: 'قيد المعالجة', count: 23, color: 'blue' },
      { status: 'جاري الشحن', count: 45, color: 'yellow' },
      { status: 'تم التسليم', count: 89, color: 'green' },
      { status: 'ملغي', count: 7, color: 'red' }
    ],
    trafficSources: [
      { source: 'البحث المباشر', visitors: 1247, percentage: 44 },
      { source: 'وسائل التواصل', visitors: 856, percentage: 30 },
      { source: 'الإعلانات المدفوعة', visitors: 512, percentage: 18 },
      { source: 'المواقع المرجعية', visitors: 232, percentage: 8 }
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Globe className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم التجارة الإلكترونية</h1>
            <p className="text-gray-600">إدارة شاملة للمتجر الإلكتروني</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">إيرادات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+22% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShoppingCart size={24} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">طلبات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+18% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={24} />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">زوار الموقع</p>
              <p className="text-2xl font-bold">{stats.websiteVisitors.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+25% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <MousePointer size={24} />
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">معدل التحويل</p>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+0.5% من أمس</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-blue-600" size={24} />
            المنتجات الأكثر مبيعاً
          </h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} قطعة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-sm">{product.revenue.toLocaleString()} ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="text-green-600" size={24} />
            حالة الطلبات
          </h3>
          <div className="space-y-4">
            {stats.orderStatus.map((status, index) => (
              <div key={index} className={`flex items-center justify-between p-4 bg-${status.color}-50 rounded-xl`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${status.color}-100 rounded-full flex items-center justify-center`}>
                    <Truck className={`text-${status.color}-600`} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{status.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-${status.color}-600`}>{status.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="text-purple-600" size={24} />
            مصادر الزيارات
          </h3>
          <div className="space-y-4">
            {stats.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{source.source}</p>
                    <p className="text-sm text-gray-600">{source.percentage}% من الزيارات</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{source.visitors.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 transition-colors">
            <Package className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة المنتجات</p>
          </button>
          <button className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 transition-colors">
            <ShoppingCart className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة الطلبات</p>
          </button>
          <button className="bg-white hover:bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200 transition-colors">
            <Users className="text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة العملاء</p>
          </button>
          <button className="bg-white hover:bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 transition-colors">
            <TrendingUp className="text-orange-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تحليلات الموقع</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcommerceDashboard;
