import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  Package,
  FolderTree,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { adminCatalog } from '@/lib/adminCatalog/index.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { adminGlassCard, adminPageClass, adminStatCard, adminPrimaryBtn } from '@/components/admin/adminUi.js';
import { AdminWelcomeHero } from '@/components/admin/AdminWelcomeHero.jsx';

const AdminDashboard = () => {
  const { t } = useTranslationWithFallback();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminCatalog.listProducts(1, 1, { sort: '-created' }),
        adminCatalog.listCategories(1, 1, { sort: 'name' }),
      ]);
      setStats({
        products: productsRes?.totalItems ?? 0,
        categories: categoriesRes?.totalItems ?? 0,
      });
    } catch {
      setStats({ products: 0, categories: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statTiles = [
    {
      key: 'products',
      label: t('admin.dashboard.products', 'মোট পণ্য'),
      value: stats.products,
      icon: Package,
      to: '/admin/products',
      accent: 'from-orange-400/20 via-amber-50/80 to-white',
      ring: 'ring-orange-200/50',
    },
    {
      key: 'categories',
      label: t('admin.dashboard.categories', 'মোট ক্যাটাগরি'),
      value: stats.categories,
      icon: FolderTree,
      to: '/admin/categories',
      accent: 'from-violet-400/15 via-purple-50/80 to-white',
      ring: 'ring-violet-200/40',
    },
    {
      key: 'orders',
      label: t('admin.dashboard.orders', 'অর্ডার'),
      value: '—',
      icon: ShoppingBag,
      to: '/admin/orders',
      accent: 'from-sky-400/15 via-blue-50/80 to-white',
      ring: 'ring-sky-200/40',
      hint: t('admin.dashboard.ordersSoon', 'শীঘ্রই'),
    },
    {
      key: 'revenue',
      label: t('admin.dashboard.revenue', 'রাজস্ব'),
      value: '—',
      icon: TrendingUp,
      to: '/admin/orders',
      accent: 'from-emerald-400/15 via-green-50/80 to-white',
      ring: 'ring-emerald-200/40',
      hint: t('admin.dashboard.revenueSoon', 'শীঘ্রই'),
    },
  ];

  const quickLinks = [
    {
      to: '/admin/products',
      label: t('admin.products.add', 'নতুন পণ্য'),
      desc: t('admin.dashboard.addProductDesc', 'ছবি সহ পণ্য যোগ করুন'),
      icon: Package,
      cta: true,
    },
    {
      to: '/admin/categories',
      label: t('admin.categories.add', 'ক্যাটাগরি'),
      desc: t('admin.dashboard.addCategoryDesc', 'ব্যানার ও বিভাগ'),
      icon: FolderTree,
    },
    {
      to: '/admin/homepage',
      label: t('admin.homepage.title', 'হোমপেজ'),
      desc: t('admin.homepage.subtitle', 'স্লাইডার ও ব্যানার'),
      icon: LayoutGrid,
    },
    {
      to: '/admin/orders',
      label: t('admin.orders.title', 'অর্ডারসমূহ'),
      desc: t('admin.dashboard.ordersPlaceholder', 'শীঘ্রই উপলব্ধ'),
      icon: ShoppingBag,
    },
  ];

  return (
    <div className={adminPageClass}>
      <AdminWelcomeHero loading={loading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {statTiles.map(({ key, label, value, icon: Icon, to, accent, ring, hint }) => (
          <Link key={key} to={to} className="group block">
            <div
              className={`${adminStatCard} bg-gradient-to-br ${accent} ring-1 ${ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  {loading ? (
                    <Skeleton className="h-10 w-20 mt-2 rounded-lg" />
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 tabular-nums tracking-tight">
                      {value}
                      {hint ? (
                        <span className="block text-xs font-normal text-slate-400 mt-1">{hint}</span>
                      ) : null}
                    </p>
                  )}
                </div>
                <span className="rounded-2xl bg-white/90 p-3 text-[#FF8C00] shadow-md ring-1 ring-white group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${adminGlassCard} p-6 sm:p-8`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-[#FF8C00]" />
              <h2 className="text-lg font-bold text-slate-900">
                {t('admin.dashboard.quickActions', 'দ্রুত কাজ')}
              </h2>
            </div>
            <Button type="button" size="sm" className={adminPrimaryBtn} asChild>
              <Link to="/admin/products">
                <Plus className="h-4 w-4 mr-1" />
                {t('admin.products.add', 'পণ্য')}
              </Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {quickLinks.map(({ to, label, desc, icon: Icon, cta }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-all duration-200 ${
                    cta
                      ? 'border-orange-200/80 bg-gradient-to-r from-orange-50/90 to-amber-50/50 hover:shadow-md hover:border-orange-300'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        cta ? 'bg-[#FF8C00] text-white shadow-md' : 'bg-white text-[#FF8C00] shadow-sm ring-1 ring-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">{label}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${adminGlassCard} p-6 sm:p-8 flex flex-col`}>
          <h2 className="text-lg font-bold text-slate-900">
            {t('admin.dashboard.recentOrders', 'সাম্প্রতিক অর্ডার')}
          </h2>
          <p className="text-sm text-slate-500 mt-2 flex-1 leading-relaxed">
            {t('admin.dashboard.ordersPlaceholder', 'অর্ডার মডিউল শীঘ্রই যুক্ত হবে।')}
          </p>
          <Button type="button" variant="outline" size="sm" asChild className="w-full rounded-xl mt-4 h-10">
            <Link to="/admin/orders">{t('admin.orders.title', 'অর্ডারসমূহ')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
