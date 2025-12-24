import React, { useState } from 'react';
import { Coffee, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Drinks = () => {
  const { t, direction, isRTL } = useLanguage();
  const [drinks, setDrinks] = useState([
    {
      id: 1,
      name: { ar: 'لاتيه', en: 'Latte' },
      category: { ar: 'قهوة ساخنة', en: 'Hot Coffee' },
      price: 25,
      cost: 8,
      description: { ar: 'قهوة إسبريسو مع حليب مبخر', en: 'Espresso with steamed milk' },
      available: true,
      image: '/images/latte.jpg'
    },
    {
      id: 2,
      name: 'كابتشينو',
      category: 'قهوة ساخنة',
      price: 22,
      cost: 7,
      description: 'قهوة إسبريسو مع حليب ورغوة',
      available: true,
      image: '/images/cappuccino.jpg'
    },
    {
      id: 3,
      name: 'فرابيه',
      category: 'قهوة باردة',
      price: 28,
      cost: 10,
      description: 'قهوة باردة مع آيس كريم',
      available: true,
      image: '/images/frappe.jpg'
    },
    {
      id: 4,
      name: 'شاي أخضر',
      category: 'شاي',
      price: 15,
      cost: 3,
      description: 'شاي أخضر طبيعي',
      available: true,
      image: '/images/green-tea.jpg'
    },
    {
      id: 5,
      name: 'عصير برتقال',
      category: 'عصائر طبيعية',
      price: 20,
      cost: 6,
      description: 'عصير برتقال طازج',
      available: false,
      image: '/images/orange-juice.jpg'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', 'قهوة ساخنة', 'قهوة باردة', 'شاي', 'عصائر طبيعية'];

  const filteredDrinks = drinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || drink.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto" dir={direction}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Coffee className="text-amber-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('drinkMenu')}</h1>
              <p className="text-gray-600">{isRTL ? 'إدارة مشروبات الكافيه' : 'Manage cafe drinks'}</p>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={20} />
            {isRTL ? 'إضافة مشروب جديد' : 'Add New Drink'}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث في المشروبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[200px]"
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
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">إجمالي المشروبات</p>
              <p className="text-2xl font-bold">{drinks.length}</p>
            </div>
            <Coffee size={32} className="text-amber-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">متوفر</p>
              <p className="text-2xl font-bold">{drinks.filter(d => d.available).length}</p>
            </div>
            <Coffee size={32} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">غير متوفر</p>
              <p className="text-2xl font-bold">{drinks.filter(d => !d.available).length}</p>
            </div>
            <Coffee size={32} className="text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">الفئات</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Coffee size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrinks.map(drink => (
          <div key={drink.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image */}
            <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Coffee size={64} className="text-amber-600" />
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{drink.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  drink.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {drink.available ? 'متوفر' : 'غير متوفر'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{drink.category}</p>
              <p className="text-gray-700 text-sm mb-4">{drink.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-amber-600">{drink.price} ر.س</p>
                  <p className="text-xs text-gray-500">التكلفة: {drink.cost} ر.س</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    الربح: {drink.price - drink.cost} ر.س
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(((drink.price - drink.cost) / drink.price) * 100)}% هامش
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Edit size={16} />
                  تعديل
                </button>
                <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDrinks.length === 0 && (
        <div className="text-center py-12">
          <Coffee size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد مشروبات</h3>
          <p className="text-gray-600 mb-6">لم يتم العثور على مشروبات تطابق البحث</p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all">
            إضافة مشروب جديد
          </button>
        </div>
      )}
    </div>
  );
};

export default Drinks;
