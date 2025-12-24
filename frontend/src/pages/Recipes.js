import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  ChefHat, Package, Plus, Edit, Trash2, Eye, Search,
  Clock, Users, DollarSign, Calculator
} from 'lucide-react';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    description: '',
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    instructions: '',
    ingredients: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipesRes, ingredientsRes, productsRes] = await Promise.all([
        api.get('/recipes'),
        api.get('/ingredients'),
        api.get('/products')
      ]);
      
      setRecipes(recipesRes.data.data);
      setIngredients(ingredientsRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecipe(null);
    setFormData({
      product_id: '',
      name: '',
      description: '',
      prep_time: 0,
      cook_time: 0,
      servings: 1,
      instructions: '',
      ingredients: [{ ingredient_id: '', quantity: 0, unit: 'g' }]
    });
    setShowModal(true);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      product_id: recipe.product_id || '',
      name: recipe.name || '',
      description: recipe.description || '',
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 1,
      instructions: recipe.instructions || '',
      ingredients: recipe.ingredients || [{ ingredient_id: '', quantity: 0, unit: 'g' }]
    });
    setShowModal(true);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredient_id: '', quantity: 0, unit: 'g' }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const calculateCost = () => {
    return formData.ingredients.reduce((sum, ing) => {
      const ingredient = ingredients.find(i => i.id === ing.ingredient_id);
      return sum + (ingredient ? (ingredient.cost_per_unit * ing.quantity) : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recipeData = {
        ...formData,
        total_cost: calculateCost()
      };

      if (editingRecipe) {
        await api.put(`/recipes/${editingRecipe.id}`, recipeData);
        toast.success('تم تحديث الوصفة بنجاح');
      } else {
        await api.post('/recipes', recipeData);
        toast.success('تم إضافة الوصفة بنجاح');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ الوصفة');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الوصفات</h2>
          <p className="text-gray-600">إدارة وصفات الطعام والمكونات</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          وصفة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الوصفات</p>
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
            </div>
            <ChefHat className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المكونات</p>
              <p className="text-2xl font-bold text-blue-600">{ingredients.length}</p>
            </div>
            <Package className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط وقت التحضير</p>
              <p className="text-2xl font-bold text-green-600">
                {recipes.length > 0 ? Math.round(recipes.reduce((sum, r) => sum + (r.prep_time || 0), 0) / recipes.length) : 0} د
              </p>
            </div>
            <Clock className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط التكلفة</p>
              <p className="text-2xl font-bold text-purple-600">
                {recipes.length > 0 ? (recipes.reduce((sum, r) => sum + (r.total_cost || 0), 0) / recipes.length).toFixed(2) : 0} ريال
              </p>
            </div>
            <DollarSign className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <ChefHat className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد وصفات</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة وصفة جديدة</p>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
          >
            <Plus size={18} />
            وصفة جديدة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Clock size={16} />
                      <span className="font-semibold">{(recipe.prep_time || 0) + (recipe.cook_time || 0)}</span>
                    </div>
                    <p className="text-xs text-gray-500">دقيقة</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Users size={16} />
                      <span className="font-semibold">{recipe.servings || 1}</span>
                    </div>
                    <p className="text-xs text-gray-500">حصة</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-purple-600">
                    <Calculator size={16} />
                    <span className="font-bold">{(recipe.total_cost || 0).toFixed(2)} ريال</span>
                  </div>
                  <span className="text-xs text-gray-500">{recipe.ingredients?.length || 0} مكون</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRecipe ? 'تعديل الوصفة' : 'وصفة جديدة'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنتج</label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  >
                    <option value="">اختر المنتج (اختياري)</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الوصفة</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وقت التحضير (دقيقة)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prep_time}
                    onChange={(e) => setFormData({...formData, prep_time: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وقت الطبخ (دقيقة)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cook_time}
                    onChange={(e) => setFormData({...formData, cook_time: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عدد الحصص</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">المكونات</h4>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    إضافة مكون
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">المكون</label>
                        <select
                          value={ingredient.ingredient_id}
                          onChange={(e) => updateIngredient(index, 'ingredient_id', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                          required
                        >
                          <option value="">اختر المكون</option>
                          {ingredients.map(ing => (
                            <option key={ing.id} value={ing.id}>{ing.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">الكمية</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">الوحدة</label>
                        <select
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                        >
                          <option value="g">جرام</option>
                          <option value="kg">كيلوجرام</option>
                          <option value="ml">مل</option>
                          <option value="l">لتر</option>
                          <option value="piece">قطعة</option>
                          <option value="cup">كوب</option>
                          <option value="tbsp">ملعقة كبيرة</option>
                          <option value="tsp">ملعقة صغيرة</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="w-full px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">التكلفة الإجمالية:</span>
                    <span className="text-xl font-bold text-brand-600">{calculateCost().toFixed(2)} ريال</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طريقة التحضير</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                  placeholder="اكتب خطوات تحضير الوصفة..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingRecipe ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
