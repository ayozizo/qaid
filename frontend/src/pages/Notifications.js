import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  MessageSquare, Send, Settings, Bell, 
  Smartphone, Mail, Users, Clock,
  Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

const Notifications = () => {
  const [templates, setTemplates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'sms',
    trigger: 'order_confirmed',
    subject: '',
    message: '',
    is_active: true
  });

  const triggerTypes = [
    { value: 'order_confirmed', label: 'تأكيد الطلب' },
    { value: 'order_ready', label: 'الطلب جاهز' },
    { value: 'order_delivered', label: 'تم التوصيل' },
    { value: 'reservation_confirmed', label: 'تأكيد الحجز' },
    { value: 'reservation_reminder', label: 'تذكير الحجز' },
    { value: 'loyalty_points_earned', label: 'ربح نقاط ولاء' },
    { value: 'birthday_offer', label: 'عرض عيد ميلاد' },
    { value: 'promotional', label: 'عرض ترويجي' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, notificationsRes, settingsRes] = await Promise.all([
        api.get('/notifications/templates'),
        api.get('/notifications/history'),
        api.get('/notifications/settings')
      ]);
      
      setTemplates(templatesRes.data.data);
      setNotifications(notificationsRes.data.data);
      setSettings(settingsRes.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      type: 'sms',
      trigger: 'order_confirmed',
      subject: '',
      message: '',
      is_active: true
    });
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name || '',
      type: template.type || 'sms',
      trigger: template.trigger || 'order_confirmed',
      subject: template.subject || '',
      message: template.message || '',
      is_active: template.is_active !== false
    });
    setShowTemplateModal(true);
  };

  const handleSubmitTemplate = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTemplate) {
        await api.put(`/notifications/templates/${editingTemplate.id}`, templateForm);
        toast.success('تم تحديث القالب بنجاح');
      } else {
        await api.post('/notifications/templates', templateForm);
        toast.success('تم إضافة القالب بنجاح');
      }
      
      setShowTemplateModal(false);
      loadData();
    } catch (error) {
      toast.error('خطأ في حفظ القالب');
    }
  };

  const toggleTemplate = async (id, isActive) => {
    try {
      await api.put(`/notifications/templates/${id}`, { is_active: !isActive });
      toast.success(isActive ? 'تم إيقاف القالب' : 'تم تفعيل القالب');
      loadData();
    } catch (error) {
      toast.error('خطأ في تحديث القالب');
    }
  };

  const sendTestNotification = async (templateId) => {
    try {
      await api.post(`/notifications/test/${templateId}`);
      toast.success('تم إرسال الإشعار التجريبي');
    } catch (error) {
      toast.error('خطأ في إرسال الإشعار');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      sent: { bg: 'bg-green-100', text: 'text-green-800', label: 'مرسل', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'فشل', icon: XCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'في الانتظار', icon: Clock }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      sms: Smartphone,
      whatsapp: MessageSquare,
      email: Mail
    };
    return icons[type] || Bell;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">نظام الإشعارات</h2>
          <p className="text-gray-600">إدارة إشعارات SMS و WhatsApp والبريد الإلكتروني</p>
        </div>
        <button
          onClick={handleAddTemplate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          قالب جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <Bell className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مرسلة بنجاح</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">فشلت</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
            </div>
            <XCircle className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">القوالب النشطة</p>
              <p className="text-2xl font-bold text-blue-600">
                {templates.filter(t => t.is_active).length}
              </p>
            </div>
            <Settings className="text-blue-400" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'templates', label: 'القوالب', icon: Settings },
              { id: 'history', label: 'السجل', icon: Clock },
              { id: 'settings', label: 'الإعدادات', icon: Bell }
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
          {activeTab === 'templates' && (
            <div className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد قوالب</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإنشاء قالب إشعار جديد</p>
                  <button
                    onClick={handleAddTemplate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm mx-auto"
                  >
                    <Plus size={18} />
                    قالب جديد
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => {
                    const TypeIcon = getTypeIcon(template.type);
                    const trigger = triggerTypes.find(t => t.value === template.trigger);
                    
                    return (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                              <TypeIcon className="text-brand-600" size={20} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600">{trigger?.label}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleTemplate(template.id, template.is_active)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {template.is_active ? (
                              <ToggleRight className="text-green-500" size={24} />
                            ) : (
                              <ToggleLeft className="text-gray-400" size={24} />
                            )}
                          </button>
                        </div>

                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <p className="text-sm text-gray-700 line-clamp-3">{template.message}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            template.type === 'sms' ? 'bg-blue-100 text-blue-800' :
                            template.type === 'whatsapp' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {template.type.toUpperCase()}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendTestNotification(template.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="إرسال تجريبي"
                            >
                              <Send size={14} />
                            </button>
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                              title="تعديل"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد سجل</h3>
                  <p className="text-gray-500">سيتم عرض سجل الإشعارات هنا</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">النوع</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المستقبل</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الرسالة</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {notifications.slice(0, 20).map(notification => {
                        const TypeIcon = getTypeIcon(notification.type);
                        
                        return (
                          <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="text-gray-400" size={16} />
                                <span className="text-sm font-medium">{notification.type.toUpperCase()}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-sm text-gray-900">{notification.recipient_name}</p>
                                <p className="text-xs text-gray-500">{notification.recipient_contact}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-gray-700 line-clamp-2">{notification.message}</p>
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(notification.status)}</td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-500">
                                <p>{new Date(notification.created_at).toLocaleDateString('ar-SA')}</p>
                                <p>{new Date(notification.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SMS Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">إعدادات SMS</h3>
                      <p className="text-sm text-gray-600">تكوين خدمة الرسائل النصية</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">مقدم الخدمة</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none">
                        <option>Twilio</option>
                        <option>AWS SNS</option>
                        <option>Unifonic</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="sms_enabled"
                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <label htmlFor="sms_enabled" className="text-sm font-medium text-gray-700">
                        تفعيل SMS
                      </label>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">إعدادات WhatsApp</h3>
                      <p className="text-sm text-gray-600">تكوين WhatsApp Business API</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        placeholder="+966501234567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="whatsapp_enabled"
                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <label htmlFor="whatsapp_enabled" className="text-sm font-medium text-gray-700">
                        تفعيل WhatsApp
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                  <Settings size={18} />
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'تعديل القالب' : 'قالب جديد'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmitTemplate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم القالب</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({...templateForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  >
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">البريد الإلكتروني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحفز</label>
                <select
                  value={templateForm.trigger}
                  onChange={(e) => setTemplateForm({...templateForm, trigger: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  {triggerTypes.map(trigger => (
                    <option key={trigger.value} value={trigger.value}>{trigger.label}</option>
                  ))}
                </select>
              </div>

              {templateForm.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                <textarea
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                  placeholder="اكتب رسالتك هنا... يمكنك استخدام {{customer_name}} و {{order_number}} كمتغيرات"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">المتغيرات المتاحة:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <span>{{customer_name}} - اسم العميل</span>
                  <span>{{order_number}} - رقم الطلب</span>
                  <span>{{restaurant_name}} - اسم المطعم</span>
                  <span>{{total_amount}} - إجمالي المبلغ</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="template_active"
                  checked={templateForm.is_active}
                  onChange={(e) => setTemplateForm({...templateForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="template_active" className="text-sm font-medium text-gray-700">
                  قالب نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  {editingTemplate ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
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

export default Notifications;
