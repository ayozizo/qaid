import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ className = '' }) => {
  const { language, changeLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-100 ${className}`}
      title={t('language')}
    >
      <Globe size={18} />
      <span className="hidden sm:inline">
        {language === 'ar' ? 'EN' : 'عر'}
      </span>
    </button>
  );
};

export default LanguageToggle;
