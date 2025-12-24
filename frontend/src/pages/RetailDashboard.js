import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, Users, Package, DollarSign, ShoppingBag, CreditCard } from 'lucide-react';

const RetailDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 12340,
    todayTransactions: 156,
    totalCustomers: 1247,
    totalProducts: 892,
    topProducts: [
      { name: 'قميص قطني', sales: 34, revenue: 1020 },
      { name: 'بنطال جينز', sales: 28, revenue: 1400 },
      { name: 'حذاء رياضي', sales: 22, revenue: 1760 },
      { name: 'حقيبة يد', sales: 19, revenue: 950 }
    ],
    customerSegments: [
      { segment: 'عملاء دائمون', count: 89, percentage: 35 },
      { segment: 'عملاء جدد', count: 67, percentage: 43 },
      { segment: 'عملاء مميزون', count: 34, percentage: 22 }
    ],
    paymentMethods: [
      { method: 'بطاقة ائتمان', count: 78, percentage: 50 },
      { method: 'نقداً', count: 45, percentage: 29 },
      { method: 'تحويل بنكي', count: 33, percentage: 21 }
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Store className="text-purple-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المحل التجاري</h1>
            <p className="text-gray-600">إدارة شاملة لمحل التجارة</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">إيرادات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+14% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShoppingBag size={24} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">معاملات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayTransactions}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+9% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={24} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">إجمالي العملاء</p>
              <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="text-sm">قاعدة عملاء قوية</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={24} />
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span className="text-sm">متنوع</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-purple-600" size={24} />
            المنتجات الأكثر مبيعاً
          </h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} قطعة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{product.revenue} ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            شرائح العملاء
          </h3>
          <div className="space-y-4">
            {stats.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{segment.segment}</p>
                    <p className="text-sm text-gray-600">{segment.percentage}% من العملاء</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{segment.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="text-green-600" size={24} />
            طرق الدفع
          </h3>
          <div className="space-y-4">
            {stats.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{method.method}</p>
                    <p className="text-sm text-gray-600">{method.percentage}% من المعاملات</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{method.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200 transition-colors">
            <Package className="text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة المنتجات</p>
          </button>
          <button className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 transition-colors">
            <Users className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة العملاء</p>
          </button>
          <button className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 transition-colors">
            <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تقارير المبيعات</p>
          </button>
          <button className="bg-white hover:bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 transition-colors">
            <ShoppingBag className="text-orange-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">نقاط البيع</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetailDashboard;
