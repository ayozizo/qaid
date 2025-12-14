import { useState } from "react";
import { useLocation } from "wouter";
import { Scale, Sparkles, Eye, EyeOff, Mail, User, Shield } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN ?? "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('[Login] Submitting form with data:', { name: formData.name, email: formData.email });

    try {
      // Create a form element and submit it to handle the redirect properly
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${backendOrigin}/api/local-login`;
      
      // Add form data
      const nameField = document.createElement('input');
      nameField.type = 'hidden';
      nameField.name = 'name';
      nameField.value = formData.name;
      form.appendChild(nameField);
      
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'email';
      emailField.value = formData.email;
      form.appendChild(emailField);
      
      const passwordField = document.createElement('input');
      passwordField.type = 'hidden';
      passwordField.name = 'password';
      passwordField.value = formData.password;
      form.appendChild(passwordField);
      
      console.log('[Login] Submitting form to:', form.action);
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  console.log('[Login] Login page rendered');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-background to-background" />
      
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
            <Scale className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-gold">قيد</span>
          </h1>
          <p className="text-muted-foreground">نظام إدارة القضايا القانونية المتقدم</p>
        </div>

        {/* Login Card */}
        <div className="bg-card text-card-foreground border rounded-xl shadow-sm p-6">
          <div className="text-center pb-4">
            <h2 className="text-2xl font-bold text-foreground">تسجيل الدخول</h2>
            <p className="text-muted-foreground text-sm mt-2">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-right flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg text-right"
                dir="rtl"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-right flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg text-right"
                dir="rtl"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-right flex items-center gap-2 text-sm font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 pr-10 border rounded-lg text-right"
                  dir="rtl"
                />
                <button
                  type="button"
                  className="absolute left-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  تسجيل الدخول
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <button 
                onClick={() => setLocation('/signup')}
                className="text-gold hover:text-gold/80 font-medium"
              >
                إنشاء حساب جديد
              </button>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">
                  أمان وموثوقية
                </p>
                <p className="text-xs text-muted-foreground">
                  بياناتك محمية بأحدث تقنيات التشفير والخصوصية
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 قيد. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
