import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">التصنيفات</h2>
        <button className="btn btn-primary">
          <Plus size={20} />
          تصنيف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="card hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">{category.name}</h3>
            {category.name_ar && (
              <p className="text-gray-600 mb-2">{category.name_ar}</p>
            )}
            {category.description && (
              <p className="text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
