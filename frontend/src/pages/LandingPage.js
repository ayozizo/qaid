import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  Globe,
  Coffee,
  ShoppingCart,
  Utensils,
  Heart,
  Building2,
  Smartphone,
  BarChart3,
  CreditCard,
  Headphones
} from 'lucide-react';

const LandingPage = () => {
  const businessTypes = [
    {
      icon: Utensils,
      title: 'المطاعم والكافيهات',
      description: 'إدارة شاملة للمطاعم مع نقاط البيع وإدارة الطاولات والطلبات',
      features: ['نقاط البيع', 'إدارة الطاولات', 'قوائم الطعام', 'التوصيل']
    },
    {
      icon: ShoppingCart,
      title: 'السوبر ماركت',
      description: 'نظام متكامل لإدارة المخازن والمبيعات والموردين',
      features: ['إدارة المخزون', 'الباركود', 'نقاط البيع', 'التقارير']
    },
    {
      icon: Coffee,
      title: 'الكافيهات',
      description: 'حلول مخصصة للكافيهات مع إدارة المشروبات والعروض',
      features: ['قائمة المشروبات', 'برنامج الولاء', 'العروض', 'الطلبات السريعة']
    },
    {
      icon: Heart,
      title: 'الصيدليات',
      description: 'نظام إدارة الصيدليات مع تتبع الأدوية وتواريخ الانتهاء',
      features: ['إدارة الأدوية', 'تواريخ الانتهاء', 'الوصفات', 'التأمين']
    },
    {
      icon: Building2,
      title: 'المحلات التجارية',
      description: 'حلول شاملة لجميع أنواع المحلات التجارية',
      features: ['نقاط البيع', 'إدارة العملاء', 'المبيعات', 'التقارير']
    },
    {
      icon: Globe,
      title: 'التجارة الإلكترونية',
      description: 'منصة متكاملة للبيع أونلاين مع إدارة الطلبات',
      features: ['المتجر الإلكتروني', 'إدارة الطلبات', 'الدفع الإلكتروني', 'الشحن']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'سرعة وأداء عالي',
      description: 'نظام سريع ومتجاوب يعمل بكفاءة عالية'
    },
    {
      icon: Shield,
      title: 'أمان متقدم',
      description: 'حماية بيانات عملائك بأحدث تقنيات الأمان'
    },
    {
      icon: Smartphone,
      title: 'متوافق مع الجوال',
      description: 'يعمل بسلاسة على جميع الأجهزة والشاشات'
    },
    {
      icon: BarChart3,
      title: 'تقارير تفصيلية',
      description: 'تقارير شاملة لمتابعة أداء عملك'
    },
    {
      icon: CreditCard,
      title: 'دفع متعدد',
      description: 'يدعم جميع طرق الدفع المحلية والعالمية'
    },
    {
      icon: Headphones,
      title: 'دعم فني 24/7',
      description: 'فريق دعم فني متاح على مدار الساعة'
    }
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      business: 'مطعم الأصالة',
      content: 'نظام رائع ساعدني في تنظيم مطعمي وزيادة الأرباح بنسبة 40%',
      rating: 5
    },
    {
      name: 'فاطمة علي',
      business: 'سوبر ماركت النور',
      content: 'إدارة المخزون أصبحت سهلة جداً والتقارير مفيدة للغاية',
      rating: 5
    },
    {
      name: 'محمد خالد',
      business: 'كافيه المدينة',
      content: 'العملاء راضيين عن سرعة الخدمة والنظام سهل الاستخدام',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة الأعمال</h1>
                <p className="text-xs text-gray-500">نظام شامل لجميع الأعمال التجارية</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              نظام إدارة شامل لجميع 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}الأعمال التجارية
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              مطاعم، كافيهات، سوبر ماركت، صيدليات، ومحلات تجارية - كل ما تحتاجه لإدارة عملك بكفاءة واحترافية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="btn btn-primary btn-lg group"
              >
                ابدأ تجربتك المجانية
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                to="#demo" 
                className="btn btn-outline btn-lg"
              >
                شاهد العرض التوضيحي
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                تجربة مجانية 30 يوم
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                بدون رسوم إعداد
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                دعم فني مجاني
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              مناسب لجميع أنواع الأعمال
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نظام مرن يتكيف مع احتياجات عملك مهما كان نوعه أو حجمه
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessTypes.map((business, index) => {
              const Icon = business.icon;
              return (
                <div key={index} className="card card-hover group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{business.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{business.description}</p>
                  <div className="space-y-2">
                    {business.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              مميزات تجعل عملك أكثر نجاحاً
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تقنيات حديثة وأدوات متطورة لإدارة عملك بكفاءة عالية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black mb-2">1000+</div>
              <div className="text-blue-100">عميل راضي</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">50+</div>
              <div className="text-blue-100">مدينة</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">99.9%</div>
              <div className="text-blue-100">وقت التشغيل</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">24/7</div>
              <div className="text-blue-100">دعم فني</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ماذا يقول عملاؤنا
            </h2>
            <p className="text-xl text-gray-600">
              آراء حقيقية من أصحاب الأعمال الذين يثقون بنا
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              جاهز لتطوير عملك؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ابدأ تجربتك المجانية اليوم واكتشف كيف يمكن لنظامنا تحسين إدارة عملك
            </p>
            <Link 
              to="/register" 
              className="btn btn-primary btn-lg group"
            >
              ابدأ الآن مجاناً
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white" size={20} />
                </div>
                <span className="text-lg font-bold">إدارة الأعمال</span>
              </div>
              <p className="text-gray-400">
                نظام شامل لإدارة جميع أنواع الأعمال التجارية بكفاءة واحترافية
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">المنتج</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التحديثات</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الدعم الفني</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الشركة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 إدارة الأعمال. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
