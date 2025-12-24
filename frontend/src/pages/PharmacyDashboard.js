import React, { useState, useEffect } from 'react';
import { Heart, Pill, Calendar, AlertTriangle, TrendingUp, DollarSign, Clock } from 'lucide-react';

const PharmacyDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 8750,
    todayPrescriptions: 89,
    expiringMedicines: 7,
    totalMedicines: 2341,
    topMedicines: [
      { name: 'باراسيتامول 500mg', sales: 45, revenue: 675 },
      { name: 'أموكسيسيلين 250mg', sales: 32, revenue: 960 },
      { name: 'فيتامين د3', sales: 28, revenue: 840 },
      { name: 'أوميجا 3', sales: 24, revenue: 720 }
    ],
    expiringItems: [
      { name: 'أسبرين 100mg', expiryDate: '2024-12-15', stock: 25 },
      { name: 'شراب السعال', expiryDate: '2024-12-20', stock: 12 },
      { name: 'مرهم مضاد حيوي', expiryDate: '2024-12-25', stock: 8 },
      { name: 'فيتامين ب12', expiryDate: '2024-12-30', stock: 15 }
    ],
    prescriptionTypes: [
      { type: 'مضادات حيوية', count: 23, percentage: 26 },
      { type: 'مسكنات', count: 19, percentage: 21 },
      { type: 'فيتامينات', count: 17, percentage: 19 },
      { type: 'أدوية مزمنة', count: 15, percentage: 17 }
    ]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-red-100 rounded-xl">
            <Heart className="text-red-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الصيدلية</h1>
            <p className="text-gray-600">إدارة شاملة لصيدلية الشفاء</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="text-right">
              <p className="text-red-100 text-sm">إيرادات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+18% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Pill size={24} />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">وصفات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayPrescriptions}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm">+12% من أمس</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar size={24} />
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">أدوية منتهية الصلاحية</p>
              <p className="text-2xl font-bold">{stats.expiringMedicines}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="text-sm">يحتاج مراجعة</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Pill size={24} />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">إجمالي الأدوية</p>
              <p className="text-2xl font-bold">{stats.totalMedicines.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} />
            <span className="text-sm">متنوع</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Medicines */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Pill className="text-blue-600" size={24} />
            الأدوية الأكثر مبيعاً
          </h3>
          <div className="space-y-4">
            {stats.topMedicines.map((medicine, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{medicine.name}</p>
                    <p className="text-xs text-gray-600">{medicine.sales} وحدة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-sm">{medicine.revenue} ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Medicines */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-orange-600" size={24} />
            أدوية قاربت على الانتهاء
          </h3>
          <div className="space-y-4">
            {stats.expiringItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.stock} وحدة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 text-xs">{item.expiryDate}</p>
                  <p className="text-xs text-orange-500">ينتهي قريباً</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Types */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="text-red-600" size={24} />
            أنواع الوصفات
          </h3>
          <div className="space-y-4">
            {stats.prescriptionTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{type.type}</p>
                    <p className="text-sm text-gray-600">{type.percentage}% من الوصفات</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{type.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-red-50 p-4 rounded-xl shadow-sm border border-red-200 transition-colors">
            <Pill className="text-red-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">إدارة الأدوية</p>
          </button>
          <button className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 transition-colors">
            <Heart className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">الوصفات الطبية</p>
          </button>
          <button className="bg-white hover:bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 transition-colors">
            <Calendar className="text-orange-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تواريخ الانتهاء</p>
          </button>
          <button className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 transition-colors">
            <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium text-gray-900">تقارير المبيعات</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
