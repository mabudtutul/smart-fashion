import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import I18nProvider from './components/I18nProvider.jsx';

// Admin placeholders layout wrapper
import ProductManagement from './pages/admin/ProductManagement.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import CategoryManagement from './pages/admin/CategoryManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';

function App() {
  return (
    <I18nProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Routes Demo */}
          <Route path="/admin">
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </I18nProvider>
  );
}

export default App;