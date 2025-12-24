import React, { useState, useEffect } from 'react';
import { Coffee, TrendingUp, Users, Clock, Star, DollarSign } from 'lucide-react';

const CafeDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 2850,
    todayOrders: 47,
    avgOrderValue: 60.6,
    customerSatisfaction: 4.8,
    popularDrinks: [
      { name: 'لاتيه', orders: 23, revenue: 690 },
      { name: 'كابتشينو', orders: 18, revenue: 540 },
      { name: 'إسبريسو', orders: 15, revenue: 375 },
      { name: 'فرابيه', orders: 12, revenue: 480 }
    ],
    peakHours: [
      { time: '7:00-9:00', orders: 15 },
      { time: '12:00-14:00', orders: 12 },
      { time: '16:00-18:00', orders: 20 }
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Coffee className="text-amber-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الكافيه</h1>
            <p className="text-gray-600">إدارة شاملة لكافيه الصباح</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-amber-100 text-sm">إيرادات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+12% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Coffee size={24} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">طلبات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+8% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">متوسط الطلب</p>
              <p className="text-2xl font-bold">{stats.avgOrderValue} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+5% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Star size={24} />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">رضا العملاء</p>
              <p className="text-2xl font-bold">{stats.customerSatisfaction}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} />
            <span className="text-sm">ممتاز</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Drinks */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Coffee className="text-amber-600" size={24} />
            المشروبات الأكثر طلباً
          </h3>
          <div className="space-y-4">
            {stats.popularDrinks.map((drink, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Coffee className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{drink.name}</p>
                    <p className="text-sm text-gray-600">{drink.orders} طلب</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">{drink.revenue} ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            أوقات الذروة
          </h3>
          <div className="space-y-4">
            {stats.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{hour.time}</p>
                    <p className="text-sm text-gray-600">فترة ذروة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{hour.orders} طلب</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-amber-50 p-4 rounded-xl shadow-sm border border-amber-200 transition-colors">
            <Coffee className="text-amber-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">قائمة المشروبات</p>
          </button>
          <button className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 transition-colors">
            <Users className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">برنامج الولاء</p>
          </button>
          <button className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 transition-colors">
            <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تقارير المبيعات</p>
          </button>
          <button className="bg-white hover:bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200 transition-colors">
            <Star className="text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تقييمات العملاء</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CafeDashboard;
