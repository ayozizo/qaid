import React, { useState } from 'react';
import { Pill, Plus, Edit, Trash2, Search, Filter, AlertTriangle, Calendar } from 'lucide-react';

const Medicines = () => {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: 'باراسيتامول 500mg',
      category: 'مسكنات',
      price: 15,
      cost: 8,
      stock: 150,
      minStock: 50,
      expiryDate: '2025-06-15',
      barcode: '1234567890123',
      manufacturer: 'شركة الدواء المصرية',
      requiresPrescription: false,
      available: true
    },
    {
      id: 2,
      name: 'أموكسيسيلين 250mg',
      category: 'مضادات حيوية',
      price: 30,
      cost: 18,
      stock: 80,
      minStock: 30,
      expiryDate: '2025-03-20',
      barcode: '2345678901234',
      manufacturer: 'شركة النيل للأدوية',
      requiresPrescription: true,
      available: true
    },
    {
      id: 3,
      name: 'فيتامين د3',
      category: 'فيتامينات',
      price: 45,
      cost: 25,
      stock: 25,
      minStock: 40,
      expiryDate: '2024-12-30',
      barcode: '3456789012345',
      manufacturer: 'شركة الصحة الدولية',
      requiresPrescription: false,
      available: true
    },
    {
      id: 4,
      name: 'شراب السعال',
      category: 'أدوية الجهاز التنفسي',
      price: 25,
      cost: 12,
      stock: 5,
      minStock: 20,
      expiryDate: '2024-12-20',
      barcode: '4567890123456',
      manufacturer: 'شركة الشفاء',
      requiresPrescription: false,
      available: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', 'مسكنات', 'مضادات حيوية', 'فيتامينات', 'أدوية الجهاز التنفسي'];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // تحديد حالة الدواء
  const getMedicineStatus = (medicine) => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry <= 30) return { status: 'expiring', color: 'red', text: 'ينتهي قريباً' };
    if (medicine.stock <= medicine.minStock) return { status: 'lowStock', color: 'orange', text: 'مخزون منخفض' };
    if (!medicine.available) return { status: 'unavailable', color: 'gray', text: 'غير متوفر' };
    return { status: 'good', color: 'green', text: 'متوفر' };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Pill className="text-red-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الأدوية</h1>
              <p className="text-gray-600">إدارة مخزون الصيدلية</p>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={20} />
            إضافة دواء جديد
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث في الأدوية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">إجمالي الأدوية</p>
              <p className="text-2xl font-bold">{medicines.length}</p>
            </div>
            <Pill size={32} className="text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">مخزون منخفض</p>
              <p className="text-2xl font-bold">{medicines.filter(m => m.stock <= m.minStock).length}</p>
            </div>
            <AlertTriangle size={32} className="text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">ينتهي قريباً</p>
              <p className="text-2xl font-bold">
                {medicines.filter(m => {
                  const days = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return days <= 30;
                }).length}
              </p>
            </div>
            <Calendar size={32} className="text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">يحتاج وصفة</p>
              <p className="text-2xl font-bold">{medicines.filter(m => m.requiresPrescription).length}</p>
            </div>
            <Pill size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">اسم الدواء</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">الفئة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">السعر</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">المخزون</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">تاريخ الانتهاء</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.map(medicine => {
                const status = getMedicineStatus(medicine);
                return (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-500">{medicine.manufacturer}</p>
                        {medicine.requiresPrescription && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            يحتاج وصفة
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{medicine.category}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{medicine.price} ر.س</p>
                        <p className="text-sm text-gray-500">التكلفة: {medicine.cost} ر.س</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${medicine.stock <= medicine.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {medicine.stock}
                        </p>
                        <p className="text-sm text-gray-500">الحد الأدنى: {medicine.minStock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{medicine.expiryDate}</p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} يوم متبقي
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.color === 'green' ? 'bg-green-100 text-green-800' :
                        status.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        status.color === 'red' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <Pill size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد أدوية</h3>
          <p className="text-gray-600 mb-6">لم يتم العثور على أدوية تطابق البحث</p>
          <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all">
            إضافة دواء جديد
          </button>
        </div>
      )}
    </div>
  );
};

export default Medicines;
