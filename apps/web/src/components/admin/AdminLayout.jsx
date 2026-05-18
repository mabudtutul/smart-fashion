import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layout,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminLogout, isAdminAuthenticated, useAdminAuth } from '@/lib/adminAuth.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const navItems = [
  { to: '/admin', end: true, icon: LayoutDashboard, labelKey: 'admin.nav.dashboard', fallback: 'ড্যাশবোর্ড' },
  { to: '/admin/products', icon: Package, labelKey: 'admin.nav.products', fallback: 'পণ্যসমূহ' },
  { to: '/admin/categories', icon: FolderTree, labelKey: 'admin.categories.title', fallback: 'ক্যাটাগরি' },
  { to: '/admin/homepage', icon: Layout, labelKey: 'admin.homepage.title', fallback: 'হোমপেজ' },
  { to: '/admin/orders', icon: ShoppingBag, labelKey: 'admin.orders.title', fallback: 'অর্ডারসমূহ' },
  { to: '/admin/users', icon: Users, labelKey: 'admin.users.title', fallback: 'ব্যবহারকারী' },
  { to: '/admin/settings', icon: Settings, labelKey: 'admin.settings.title', fallback: 'সেটিংস' },
];

const sidebarLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-500/30'
      : 'text-slate-600 hover:bg-white/90 hover:text-slate-900 hover:shadow-sm'
  }`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslationWithFallback();
  const authed = useAdminAuth();
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const item = navItems.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
    );
    return item ? t(item.labelKey, item.fallback) : t('admin.panel', 'অ্যাডমিন');
  }, [location.pathname, t]);

  useEffect(() => {
    const ok = authed || isAdminAuthenticated();
    setChecked(true);
    if (!ok) {
      navigate('/admin/login', { replace: true });
    }
  }, [authed, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-6">
        <Skeleton className="h-14 w-full max-w-4xl rounded-2xl mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!authed && !isAdminAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6">
        <Link
          to="/admin"
          className="flex items-center gap-2.5 group rounded-xl p-1 -m-1 hover:bg-orange-50/80 transition-colors cursor-pointer"
          title={t('admin.nav.dashboard', 'ড্যাশবোর্ড')}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8C00] to-amber-500 text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Store className="h-4 w-4" />
          </span>
          <div>
            <span className="font-bold text-slate-900 group-hover:text-[#FF8C00] transition">Smart Fashion</span>
            <span className="block text-[11px] text-slate-500 font-medium tracking-wide uppercase">
              {t('admin.panel', 'Admin')}
            </span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, end, icon: Icon, labelKey, fallback }) => (
          <NavLink key={to} to={to} end={end} className={sidebarLinkClass}>
            <Icon className="h-4 w-4 shrink-0 opacity-90" />
            {t(labelKey, fallback)}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 space-y-2 border-t border-slate-200/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-600 hover:text-[#FF8C00] hover:bg-orange-50/80 cursor-pointer"
          asChild
        >
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            {t('admin.viewStore', 'স্টোর দেখুন')}
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start rounded-xl border-slate-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('admin.logout', 'লগ আউট')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <Link
          to="/admin"
          className="font-semibold text-slate-900 hover:text-[#FF8C00] transition-colors cursor-pointer"
        >
          {pageTitle}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl"
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[min(100vw-3rem,18rem)] border-r border-white/80 bg-white/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-[17rem] lg:flex-col lg:fixed lg:inset-y-0 border-r border-white/80 bg-white/80 backdrop-blur-2xl">
          {sidebar}
        </aside>

        <div className="flex-1 lg:pl-[17rem] flex flex-col min-h-screen">
          {/* Desktop topbar */}
          <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between gap-4 px-8 py-4 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
            <Link
              to="/admin"
              className="rounded-lg px-1 py-0.5 -mx-1 hover:bg-orange-50/80 transition-colors cursor-pointer"
              title={t('admin.nav.dashboard', 'ড্যাশবোর্ড')}
            >
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                {t('admin.panel', 'Admin')}
              </p>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl hover:border-[#FF8C00]/50 hover:bg-orange-50/50 cursor-pointer"
              asChild
            >
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('admin.viewStore', 'স্টোর দেখুন')}
              </Link>
            </Button>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
