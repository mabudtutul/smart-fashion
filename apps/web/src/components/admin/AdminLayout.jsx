import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/lib/adminAuth.js';
import {
  canRedirectToAdminProducts,
  initializePocketBaseAuth,
} from '@/lib/pocketbaseClient.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm rounded-md ${isActive ? 'bg-[#FF8C00] text-white' : 'text-gray-700 hover:bg-gray-100'}`;

/** Set true only for emergency upload session without auth. */
const TEMP_ADMIN_AUTH_BYPASS = false;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslationWithFallback();
  const [authReady, setAuthReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);

  useEffect(() => {
    initializePocketBaseAuth();
    const ok = TEMP_ADMIN_AUTH_BYPASS || canRedirectToAdminProducts();
    setSessionOk(ok);
    setAuthReady(true);

    if (!TEMP_ADMIN_AUTH_BYPASS && !ok) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  if (!TEMP_ADMIN_AUTH_BYPASS && !authReady) {
    return null;
  }

  if (!TEMP_ADMIN_AUTH_BYPASS && !sessionOk) {
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto">
          <Link to="/" className="text-sm font-semibold text-[#FF8C00]">
            Smart Fashion
          </Link>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/admin/products" className={navLinkClass}>
              {t('admin.nav.products', 'পণ্যসমূহ')}
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass}>
              {t('admin.categories.title', 'ক্যাটাগরি')}
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              {t('admin.orders.title', 'অর্ডারসমূহ')}
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              {t('admin.users.title', 'ব্যবহারকারী')}
            </NavLink>
            <NavLink to="/admin/settings" className={navLinkClass}>
              {t('admin.settings.title', 'সাইট সেটিংস')}
            </NavLink>
          </nav>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link to="/admin/change-password">{t('admin.password.changeLink', 'পাসওয়ার্ড')}</Link>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
              {t('admin.logout', 'লগ আউট')}
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
