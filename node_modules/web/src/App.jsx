import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import I18nProvider from './components/I18nProvider.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CartPage from './pages/CartPage.jsx';

import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminForgotPassword from './pages/admin/AdminForgotPassword.jsx';
import AdminResetPassword from './pages/admin/AdminResetPassword.jsx';
import AdminChangePassword from './pages/admin/AdminChangePassword.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ProductManagement from './pages/admin/ProductManagement.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import CategoryManagement from './pages/admin/CategoryManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import HomepageManagement from './pages/admin/HomepageManagement.jsx';

function App() {
  return (
    <I18nProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="change-password" element={<AdminChangePassword />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="homepage" element={<HomepageManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </I18nProvider>
  );
}

export default App;