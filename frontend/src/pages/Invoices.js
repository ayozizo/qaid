import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FileText, Download, Eye, Search, Filter, 
  Calendar, DollarSign, Receipt, QrCode,
  Printer, Mail, Check, X
} from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
    
    // Set default date range (last 30 days)
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30);
    
    setDateFrom(lastMonth.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  }, []);

  const loadInvoices = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/invoices', { params });
      setInvoices(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const response = await api.post(`/invoices/generate/${orderId}`);
      toast.success('تم إنشاء الفاتورة بنجاح');
      loadInvoices();
      return response.data.data;
    } catch (error) {
      toast.error('خطأ في إنشاء الفاتورة');
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('تم تحميل الفاتورة');
    } catch (error) {
      toast.error('خطأ في تحميل الفاتورة');
    }
  };

  const sendInvoiceByEmail = async (invoiceId) => {
    try {
      await api.post(`/invoices/${invoiceId}/send-email`);
      toast.success('تم إرسال الفاتورة بالبريد الإلكتروني');
    } catch (error) {
      toast.error('خطأ في إرسال الفاتورة');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مسودة' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مرسلة' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'مدفوعة' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغية' }
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (invoice.customer_name && invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الفواتير الإلكترونية</h2>
          <p className="text-gray-600">إدارة وإنشاء الفواتير الضريبية</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadInvoices}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <FileText size={18} />
            تحديث
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="رقم الفاتورة أو اسم العميل..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسلة</option>
              <option value="paid">مدفوعة</option>
              <option value="cancelled">ملغية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={loadInvoices}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <Filter size={18} />
            تطبيق الفلتر
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الفواتير</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الفواتير المدفوعة</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(inv => inv.status === 'paid').length}
              </p>
            </div>
            <Check className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الفواتير المعلقة</p>
              <p className="text-2xl font-bold text-yellow-600">
                {invoices.filter(inv => inv.status === 'sent').length}
              </p>
            </div>
            <Calendar className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المبلغ</p>
              <p className="text-2xl font-bold text-brand-600">
                {invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0).toLocaleString()} ريال
              </p>
            </div>
            <DollarSign className="text-brand-400" size={32} />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <Receipt className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد فواتير</h3>
          <p className="text-gray-500 text-sm">سيتم عرض الفواتير هنا عند إنشائها</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">رقم الفاتورة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">العميل</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">المبلغ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">QR Code</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                          <Receipt className="text-brand-600" size={16} />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{invoice.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{invoice.customer_name || 'عميل نقدي'}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900 text-sm">{parseFloat(invoice.total_amount).toFixed(2)}</span>
                      <span className="text-xs text-gray-500"> ج</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-3">
                      {invoice.qr_code && (
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                        >
                          <QrCode size={14} />
                          عرض
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                          title="عرض"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(invoice.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          title="تحميل"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => sendInvoiceByEmail(invoice.id)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="إرسال بالبريد"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="طباعة"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                فاتورة رقم {selectedInvoice.invoice_number}
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">فاتورة ضريبية</h2>
                  <p className="text-gray-600">رقم الفاتورة: {selectedInvoice.invoice_number}</p>
                  <p className="text-gray-600">التاريخ: {new Date(selectedInvoice.created_at).toLocaleDateString('ar-SA')}</p>
                </div>
                {selectedInvoice.qr_code && (
                  <div className="text-center">
                    <img 
                      src={selectedInvoice.qr_code} 
                      alt="QR Code" 
                      className="w-24 h-24 border border-gray-200 rounded"
                    />
                    <p className="text-xs text-gray-500 mt-2">QR Code</p>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">{selectedInvoice.customer_name || 'عميل نقدي'}</p>
                  {selectedInvoice.customer_phone && (
                    <p className="text-gray-600">الهاتف: {selectedInvoice.customer_phone}</p>
                  )}
                  {selectedInvoice.customer_address && (
                    <p className="text-gray-600">العنوان: {selectedInvoice.customer_address}</p>
                  )}
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الفاتورة</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الصنف</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الكمية</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">السعر</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(item.unit_price).toFixed(2)} ريال</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{parseFloat(item.total_price).toFixed(2)} ريال</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{parseFloat(selectedInvoice.subtotal || 0).toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الضريبة (15%):</span>
                      <span className="font-medium">{parseFloat(selectedInvoice.tax_amount || 0).toFixed(2)} ريال</span>
                    </div>
                    {selectedInvoice.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>الخصم:</span>
                        <span className="font-medium">-{parseFloat(selectedInvoice.discount_amount).toFixed(2)} ريال</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>الإجمالي:</span>
                      <span>{parseFloat(selectedInvoice.total_amount).toFixed(2)} ريال</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => downloadInvoice(selectedInvoice.id)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download size={18} />
                تحميل PDF
              </button>
              <button
                onClick={() => sendInvoiceByEmail(selectedInvoice.id)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail size={18} />
                إرسال بالبريد
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Printer size={18} />
                طباعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
