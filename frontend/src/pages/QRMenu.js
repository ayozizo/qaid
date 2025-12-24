import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  QrCode, Download, Eye, Share2, Settings,
  Smartphone, Monitor, Printer, Copy,
  Star, Clock, DollarSign, Image
} from 'lucide-react';

const QRMenu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [qrCodes, setQrCodes] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes, branchesRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products', { params: { is_active: true } }),
        api.get('/branches')
      ]);
      
      setCategories(categoriesRes.data.data);
      setProducts(productsRes.data.data);
      setBranches(branchesRes.data.data);
      
      if (branchesRes.data.data.length > 0) {
        setSelectedBranch(branchesRes.data.data[0].id);
      }
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (type, branchId) => {
    try {
      const response = await api.post('/qr/generate', {
        type: type, // 'menu', 'branch', 'table'
        branch_id: branchId,
        table_number: type === 'table' ? 1 : null
      });
      
      setQrCodes(prev => ({
        ...prev,
        [`${type}_${branchId}`]: response.data.data.qr_code
      }));
      
      toast.success('تم إنشاء رمز QR بنجاح');
    } catch (error) {
      toast.error('خطأ في إنشاء رمز QR');
    }
  };

  const downloadQRCode = (qrCode, filename) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('تم تحميل رمز QR');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ الرابط');
  };

  const previewMenu = (branchId) => {
    const menuUrl = `${window.location.origin}/menu/${branchId}`;
    setPreviewUrl(menuUrl);
    setShowPreview(true);
  };

  const categorizedProducts = categories.map(category => ({
    ...category,
    products: products.filter(product => product.category_id === category.id)
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">قوائم QR Code</h2>
          <p className="text-gray-600">إنشاء وإدارة قوائم QR للعملاء</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Image className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الفئات</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
            </div>
            <Star className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الفروع</p>
              <p className="text-2xl font-bold text-green-600">{branches.length}</p>
            </div>
            <Monitor className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط السعر</p>
              <p className="text-2xl font-bold text-purple-600">
                {products.length > 0 ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(0) : 0} ريال
              </p>
            </div>
            <DollarSign className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* QR Code Generation */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إنشاء رموز QR</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Menu QR */}
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-brand-600" size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">قائمة الطعام</h4>
            <p className="text-sm text-gray-600 mb-4">رمز QR للقائمة الكاملة</p>
            
            {qrCodes[`menu_${selectedBranch}`] ? (
              <div className="space-y-3">
                <img 
                  src={qrCodes[`menu_${selectedBranch}`]} 
                  alt="Menu QR Code" 
                  className="w-32 h-32 mx-auto border border-gray-200 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQRCode(qrCodes[`menu_${selectedBranch}`], 'menu-qr')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={14} />
                    تحميل
                  </button>
                  <button
                    onClick={() => previewMenu(selectedBranch)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye size={14} />
                    معاينة
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => generateQRCode('menu', selectedBranch)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
              >
                <QrCode size={18} />
                إنشاء رمز QR
              </button>
            )}
          </div>

          {/* Branch QR */}
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor className="text-blue-600" size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">معلومات الفرع</h4>
            <p className="text-sm text-gray-600 mb-4">رمز QR لمعلومات الفرع</p>
            
            {qrCodes[`branch_${selectedBranch}`] ? (
              <div className="space-y-3">
                <img 
                  src={qrCodes[`branch_${selectedBranch}`]} 
                  alt="Branch QR Code" 
                  className="w-32 h-32 mx-auto border border-gray-200 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQRCode(qrCodes[`branch_${selectedBranch}`], 'branch-qr')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={14} />
                    تحميل
                  </button>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/branch/${selectedBranch}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Copy size={14} />
                    نسخ
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => generateQRCode('branch', selectedBranch)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Monitor size={18} />
                إنشاء رمز QR
              </button>
            )}
          </div>

          {/* Table QR */}
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-purple-600" size={32} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">طاولة مع طلب</h4>
            <p className="text-sm text-gray-600 mb-4">رمز QR للطلب المباشر</p>
            
            {qrCodes[`table_${selectedBranch}`] ? (
              <div className="space-y-3">
                <img 
                  src={qrCodes[`table_${selectedBranch}`]} 
                  alt="Table QR Code" 
                  className="w-32 h-32 mx-auto border border-gray-200 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQRCode(qrCodes[`table_${selectedBranch}`], 'table-qr')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={14} />
                    تحميل
                  </button>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/order/${selectedBranch}/1`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Share2 size={14} />
                    مشاركة
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => generateQRCode('table', selectedBranch)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                <Smartphone size={18} />
                إنشاء رمز QR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Preview */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">معاينة القائمة</h3>
          <button
            onClick={() => previewMenu(selectedBranch)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
          >
            <Eye size={18} />
            معاينة كاملة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorizedProducts.map(category => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">{category.name}</h4>
              <div className="space-y-3">
                {category.products.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.description?.slice(0, 30)}...</p>
                      <p className="font-bold text-brand-600 text-sm">{product.price} ريال</p>
                    </div>
                  </div>
                ))}
                {category.products.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{category.products.length - 3} منتج آخر
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">كيفية الاستخدام</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Printer className="text-blue-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">1. اطبع الرمز</h4>
            <p className="text-sm text-gray-600">احفظ واطبع رمز QR على الطاولات أو في المطعم</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="text-green-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">2. مسح الرمز</h4>
            <p className="text-sm text-gray-600">العملاء يمسحون الرمز بكاميرا الهاتف</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="text-purple-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">3. تصفح القائمة</h4>
            <p className="text-sm text-gray-600">يتم فتح القائمة مباشرة في المتصفح</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">معاينة القائمة</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <iframe
                src={previewUrl}
                className="w-full h-96 border border-gray-200 rounded-lg"
                title="Menu Preview"
              />
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">رابط القائمة:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={previewUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(previewUrl)}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
                  >
                    <Copy size={14} />
                    نسخ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRMenu;
