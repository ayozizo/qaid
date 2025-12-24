import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Package,
  Users,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('sales');
  const [salesData, setSalesData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates (last 7 days)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    setDateFrom(lastWeek.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  }, []);

  const loadSalesReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/sales', {
        params: { date_from: dateFrom, date_to: dateTo }
      });
      setSalesData(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل تقرير المبيعات');
    } finally {
      setLoading(false);
    }
  };

  const loadProductsReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/products', {
        params: { date_from: dateFrom, date_to: dateTo, limit: 10 }
      });
      setProductsData(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل تقرير المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/financial', {
        params: { date_from: dateFrom, date_to: dateTo }
      });
      setFinancialData(response.data.data);
    } catch (error) {
      toast.error('خطأ في تحميل التقرير المالي');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!dateFrom || !dateTo) {
      toast.error('يرجى تحديد التاريخ');
      return;
    }

    switch (reportType) {
      case 'sales':
        loadSalesReport();
        break;
      case 'products':
        loadProductsReport();
        break;
      case 'financial':
        loadFinancialReport();
        break;
      default:
        break;
    }
  };

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">التقارير والتحليلات</h2>
        <p className="text-gray-600">تقارير مفصلة عن المبيعات والأداء</p>
      </div>

      {/* Report Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            >
              <option value="sales">تقرير المبيعات</option>
              <option value="products">تقرير المنتجات</option>
              <option value="financial">التقرير المالي</option>
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

          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm disabled:opacity-50"
            >
              <FileText size={18} />
              {loading ? 'جاري التحميل...' : 'إنشاء التقرير'}
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-blue-600">
                {salesData ? 
                  `${salesData.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0).toLocaleString()} ريال`
                  : '0 ريال'
                }
              </p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد الطلبات</p>
              <p className="text-2xl font-bold text-green-600">
                {salesData ? 
                  salesData.reduce((sum, item) => sum + parseInt(item.total_orders || 0), 0)
                  : 0
                }
              </p>
            </div>
            <ShoppingCart className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط الطلب</p>
              <p className="text-2xl font-bold text-orange-600">
                {salesData && salesData.length > 0 ? 
                  `${(salesData.reduce((sum, item) => sum + parseFloat(item.avg_order_value || 0), 0) / salesData.length).toFixed(2)} ريال`
                  : '0 ريال'
                }
              </p>
            </div>
            <TrendingUp className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد المنتجات</p>
              <p className="text-2xl font-bold text-purple-600">
                {productsData ? productsData.length : 0}
              </p>
            </div>
            <Package className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      {reportType === 'sales' && salesData && salesData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">مبيعات الفترة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_amount" fill="#0ea5e9" name="المبيعات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Products Table */}
      {reportType === 'products' && productsData && productsData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">أفضل المنتجات مبيعاً</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الكمية المباعة</th>
                  <th>عدد الطلبات</th>
                  <th>إجمالي الإيرادات</th>
                  <th>متوسط السعر</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.name_ar && (
                          <p className="text-sm text-gray-600">{product.name_ar}</p>
                        )}
                      </div>
                    </td>
                    <td className="font-semibold">{product.total_quantity}</td>
                    <td>{product.order_count}</td>
                    <td className="font-bold text-green-600">
                      {parseFloat(product.total_revenue).toLocaleString()} ريال
                    </td>
                    <td>{parseFloat(product.avg_price).toFixed(2)} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      {reportType === 'financial' && financialData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-green-50">
            <h4 className="text-sm text-gray-600 mb-2">إجمالي الإيرادات</h4>
            <p className="text-3xl font-bold text-green-600">
              {financialData.summary?.revenue?.toLocaleString() || 0} ريال
            </p>
          </div>

          <div className="card bg-red-50">
            <h4 className="text-sm text-gray-600 mb-2">إجمالي المصروفات</h4>
            <p className="text-3xl font-bold text-red-600">
              {financialData.summary?.expenses?.toLocaleString() || 0} ريال
            </p>
          </div>

          <div className="card bg-blue-50">
            <h4 className="text-sm text-gray-600 mb-2">صافي الربح</h4>
            <p className="text-3xl font-bold text-blue-600">
              {financialData.summary?.profit?.toLocaleString() || 0} ريال
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !salesData && !productsData && !financialData && (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-300" size={64} />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">لا توجد بيانات</h3>
          <p className="mt-2 text-gray-600">اختر نوع التقرير والفترة الزمنية ثم اضغط إنشاء التقرير</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
