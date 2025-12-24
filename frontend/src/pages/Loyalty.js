import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Star, Gift, Award, Users, TrendingUp, 
  Plus, Edit, Trash2, Eye, Search, Filter,
  Crown, Zap, Target, Calendar
} from 'lucide-react';

const Loyalty = () => {
  const [customers, setCustomers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editingReward, setEditingReward] = useState(null);
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    points_per_riyal: 1,
    min_order_amount: 0,
    is_active: true
  });
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points_required: 100,
    reward_type: 'discount',
    reward_value: 0,
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, programsRes, rewardsRes] = await Promise.all([
        api.get('/loyalty/customers'),
        api.get('/loyalty/programs'),
        api.get('/loyalty/rewards')
      ]);
      
      setCustomers(customersRes.data.data);
      setPrograms(programsRes.data.data);
      setRewards(rewardsRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      name: '',
      description: '',
      points_per_riyal: 1,
      min_order_amount: 0,
      is_active: true
    });
    setShowProgramModal(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setProgramForm({
      name: program.name || '',
      description: program.description || '',
      points_per_riyal: program.points_per_riyal || 1,
      min_order_amount: program.min_order_amount || 0,
      is_active: program.is_active !== false
    });
    setShowProgramModal(true);
  };

  const handleSubmitProgram = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProgram) {
        await api.put(`/loyalty/programs/${editingProgram.id}`, programForm);
        toast.success('تم تحديث البرنامج بنجاح');
      } else {
        await api.post('/loyalty/programs', programForm);
        toast.success('تم إضافة البرنامج بنجاح');
      }
      
      setShowProgramModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ البرنامج');
    }
  };

  const handleAddReward = () => {
    setEditingReward(null);
    setRewardForm({
      name: '',
      description: '',
      points_required: 100,
      reward_type: 'discount',
      reward_value: 0,
      is_active: true
    });
    setShowRewardModal(true);
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setRewardForm({
      name: reward.name || '',
      description: reward.description || '',
      points_required: reward.points_required || 100,
      reward_type: reward.reward_type || 'discount',
      reward_value: reward.reward_value || 0,
      is_active: reward.is_active !== false
    });
    setShowRewardModal(true);
  };

  const handleSubmitReward = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReward) {
        await api.put(`/loyalty/rewards/${editingReward.id}`, rewardForm);
        toast.success('تم تحديث المكافأة بنجاح');
      } else {
        await api.post('/loyalty/rewards', rewardForm);
        toast.success('تم إضافة المكافأة بنجاح');
      }
      
      setShowRewardModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ المكافأة');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">نظام نقاط الولاء</h2>
          <p className="text-gray-600">إدارة برامج الولاء والمكافآت</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddProgram}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <Plus size={18} />
            برنامج جديد
          </button>
          <button
            onClick={handleAddReward}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <Gift size={18} />
            مكافأة جديدة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <Users className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">العملاء النشطين</p>
              <p className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.loyalty_points > 0).length}
              </p>
            </div>
            <Star className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي النقاط</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0).toLocaleString()}
              </p>
            </div>
            <Award className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المكافآت المتاحة</p>
              <p className="text-2xl font-bold text-purple-600">{rewards.length}</p>
            </div>
            <Gift className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'customers', label: 'العملاء', icon: Users },
              { id: 'programs', label: 'البرامج', icon: Star },
              { id: 'rewards', label: 'المكافآت', icon: Gift }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'customers' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث عن عميل..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Customers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                          <Users className="text-brand-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star size={16} />
                          <span className="font-bold">{customer.loyalty_points || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500">نقطة</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">إجمالي الطلبات</p>
                        <p className="font-semibold">{customer.total_orders || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">إجمالي الإنفاق</p>
                        <p className="font-semibold">{(customer.total_spent || 0).toLocaleString()} ريال</p>
                      </div>
                    </div>

                    {customer.loyalty_points >= 100 && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-700 font-medium">مؤهل للمكافآت!</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-4">
              {programs.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد برامج ولاء</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإنشاء برنامج ولاء جديد</p>
                  <button
                    onClick={handleAddProgram}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
                  >
                    <Plus size={18} />
                    برنامج جديد
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map(program => (
                    <div key={program.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                          <p className="text-sm text-gray-600">{program.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">نقاط لكل ريال:</span>
                          <span className="font-semibold">{program.points_per_riyal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحد الأدنى للطلب:</span>
                          <span className="font-semibold">{program.min_order_amount} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحالة:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {program.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {rewards.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مكافآت</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإنشاء مكافأة جديدة</p>
                  <button
                    onClick={handleAddReward}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm mx-auto"
                  >
                    <Gift size={18} />
                    مكافأة جديدة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map(reward => (
                    <div key={reward.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Gift className="text-green-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">النقاط المطلوبة:</span>
                          <span className="font-bold text-yellow-600">{reward.points_required}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نوع المكافأة:</span>
                          <span className="font-semibold">
                            {reward.reward_type === 'discount' ? 'خصم' : 
                             reward.reward_type === 'free_item' ? 'منتج مجاني' : 'نقاط إضافية'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">القيمة:</span>
                          <span className="font-semibold">
                            {reward.reward_type === 'discount' ? `${reward.reward_value}%` : reward.reward_value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProgram ? 'تعديل البرنامج' : 'برنامج ولاء جديد'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmitProgram} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم البرنامج</label>
                <input
                  type="text"
                  value={programForm.name}
                  onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={programForm.description}
                  onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نقاط لكل ريال</label>
                <input
                  type="number"
                  step="0.1"
                  value={programForm.points_per_riyal}
                  onChange={(e) => setProgramForm({...programForm, points_per_riyal: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للطلب (ج)</label>
                <input
                  type="number"
                  step="0.01"
                  value={programForm.min_order_amount}
                  onChange={(e) => setProgramForm({...programForm, min_order_amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="program_active"
                  checked={programForm.is_active}
                  onChange={(e) => setProgramForm({...programForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="program_active" className="text-sm font-medium text-gray-700">
                  برنامج نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingProgram ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingReward ? 'تعديل المكافأة' : 'مكافأة جديدة'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmitReward} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المكافأة</label>
                <input
                  type="text"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({...rewardForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النقاط المطلوبة</label>
                <input
                  type="number"
                  value={rewardForm.points_required}
                  onChange={(e) => setRewardForm({...rewardForm, points_required: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المكافأة</label>
                <select
                  value={rewardForm.reward_type}
                  onChange={(e) => setRewardForm({...rewardForm, reward_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  <option value="discount">خصم</option>
                  <option value="free_item">منتج مجاني</option>
                  <option value="bonus_points">نقاط إضافية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {rewardForm.reward_type === 'discount' ? 'نسبة الخصم (%)' : 'القيمة'}
                </label>
                <input
                  type="number"
                  step={rewardForm.reward_type === 'discount' ? '1' : '0.01'}
                  value={rewardForm.reward_value}
                  onChange={(e) => setRewardForm({...rewardForm, reward_value: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="reward_active"
                  checked={rewardForm.is_active}
                  onChange={(e) => setRewardForm({...rewardForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="reward_active" className="text-sm font-medium text-gray-700">
                  مكافأة نشطة
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {editingReward ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
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

export default Loyalty;
