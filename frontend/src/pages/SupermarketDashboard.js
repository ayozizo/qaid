import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, AlertTriangle, Barcode, DollarSign } from 'lucide-react';

const SupermarketDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 15420,
    todayTransactions: 234,
    lowStockItems: 12,
    totalProducts: 1847,
    topCategories: [
      { name: 'منتجات الألبان', sales: 3420, percentage: 22 },
      { name: 'الخضروات والفواكه', sales: 2890, percentage: 19 },
      { name: 'اللحوم والدواجن', sales: 2340, percentage: 15 },
      { name: 'المواد الغذائية', sales: 1980, percentage: 13 }
    ],
    lowStockProducts: [
      { name: 'حليب نادك 1 لتر', stock: 5, minStock: 20 },
      { name: 'خبز التوست', stock: 8, minStock: 25 },
      { name: 'بيض طازج', stock: 12, minStock: 30 },
      { name: 'زيت الطبخ', stock: 3, minStock: 15 }
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-green-100 rounded-xl">
            <ShoppingCart className="text-green-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم السوبر ماركت</h1>
            <p className="text-gray-600">إدارة شاملة لسوبر ماركت النور</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">إيرادات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+15% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShoppingCart size={24} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">معاملات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayTransactions}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+8% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">مخزون منخفض</p>
              <p className="text-2xl font-bold">{stats.lowStockItems}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="text-sm">يحتاج تجديد</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={24} />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span className="text-sm">متنوع</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={24} />
            الفئات الأكثر مبيعاً
          </h3>
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.percentage}% من المبيعات</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{category.sales.toLocaleString()} ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={24} />
            تنبيهات المخزون المنخفض
          </h3>
          <div className="space-y-4">
            {stats.lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">الحد الأدنى: {product.minStock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{product.stock} متبقي</p>
                  <p className="text-xs text-red-500">يحتاج تجديد</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 transition-colors">
            <Package className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة المخزون</p>
          </button>
          <button className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 transition-colors">
            <Barcode className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">مسح الباركود</p>
          </button>
          <button className="bg-white hover:bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200 transition-colors">
            <TrendingUp className="text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تقارير المبيعات</p>
          </button>
          <button className="bg-white hover:bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 transition-colors">
            <AlertTriangle className="text-orange-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">طلبات الشراء</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupermarketDashboard;
