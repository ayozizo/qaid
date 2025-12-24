import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard'; // المطعم الافتراضي
import CafeDashboard from '../pages/CafeDashboard';
import SupermarketDashboard from '../pages/SupermarketDashboard';
import PharmacyDashboard from '../pages/PharmacyDashboard';
import RetailDashboard from '../pages/RetailDashboard';
import EcommerceDashboard from '../pages/EcommerceDashboard';

const BusinessDashboard = () => {
  const { user } = useAuth();
  
  // تحديد نوع العمل من اسم المستخدم
  const getBusinessType = () => {
    if (!user || !user.username) return 'restaurant';
    
    const username = user.username.toLowerCase();
    
    if (username.includes('cafe')) return 'cafe';
    if (username.includes('supermarket')) return 'supermarket';
    if (username.includes('pharmacy')) return 'pharmacy';
    if (username.includes('retail')) return 'retail';
    if (username.includes('ecommerce')) return 'ecommerce';
    if (username.includes('restaurant')) return 'restaurant';
    
    // افتراضي للحسابات العامة
    return 'restaurant';
  };

  const businessType = getBusinessType();

  // عرض Dashboard المناسب حسب نوع العمل
  switch (businessType) {
    case 'cafe':
      return <CafeDashboard />;
    case 'supermarket':
      return <SupermarketDashboard />;
    case 'pharmacy':
      return <PharmacyDashboard />;
    case 'retail':
      return <RetailDashboard />;
    case 'ecommerce':
      return <EcommerceDashboard />;
    case 'restaurant':
    default:
      return <Dashboard />;
  }
};

export default BusinessDashboard;
