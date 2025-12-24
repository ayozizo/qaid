import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import BusinessLayout from './components/BusinessLayout';

// Component to handle landing page logic
const LandingPageWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  
  // If user is already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  // Otherwise show landing page
  return <LandingPage />;
};

// Component to handle login page logic
const LoginWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  
  // If user is already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  // Otherwise show login page
  return <LoginSimple />;
};

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import LoginSimple from './pages/LoginSimple';
import Register from './pages/Register';
import SetupWizard from './pages/SetupWizard';
import Dashboard from './pages/Dashboard';
import BusinessDashboard from './components/BusinessDashboard';
import POS from './pages/POS';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Kitchen from './pages/Kitchen';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Branches from './pages/Branches';
import Reports from './pages/Reports';
import Invoices from './pages/Invoices';
import Loyalty from './pages/Loyalty';
import Reservations from './pages/Reservations';
import DeliveryIntegration from './pages/DeliveryIntegration';
import Notifications from './pages/Notifications';
import Recipes from './pages/Recipes';
import Purchasing from './pages/Purchasing';
import DigitalQueue from './pages/DigitalQueue';
import BiometricAttendance from './pages/BiometricAttendance';
import Drinks from './pages/Drinks';
import Medicines from './pages/Medicines';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/login" element={<LoginSimple />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-wizard" element={<SetupWizard />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={<PrivateRoute><BusinessLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<BusinessDashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<NewOrder />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="kitchen" element={<Kitchen />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="branches" element={<Branches />} />
            <Route path="reports" element={<Reports />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="loyalty" element={<Loyalty />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="delivery" element={<DeliveryIntegration />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="purchasing" element={<Purchasing />} />
            <Route path="queue" element={<DigitalQueue />} />
            <Route path="biometric" element={<BiometricAttendance />} />
            <Route path="drinks" element={<Drinks />} />
            <Route path="medicines" element={<Medicines />} />
          </Route>
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
