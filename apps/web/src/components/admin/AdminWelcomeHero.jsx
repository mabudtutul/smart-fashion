import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Store, ArrowRight } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminPrimaryBtn } from '@/components/admin/adminUi.js';
import { ADMIN_OWNER_DISPLAY_NAME, ADMIN_STORE_DISPLAY_NAME } from '@/lib/adminBranding.js';

/**
 * Premium personalized greeting for the store owner.
 */
export function AdminWelcomeHero({ loading = false }) {
  const { t } = useTranslationWithFallback();

  return (
    <section
      className="group relative mb-8 sm:mb-10 overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-br from-orange-50/95 via-white/85 to-amber-50/70 backdrop-blur-2xl shadow-[0_12px_48px_rgba(255,140,0,0.14)] ring-1 ring-orange-100/60 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,140,0,0.18)] hover:ring-orange-200/80"
      aria-label={t('admin.dashboard.welcomeHero', 'স্বাগতম বার্তা')}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#FF8C00]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 admin-welcome-shimmer"
        aria-hidden
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-6 py-8 sm:px-10 sm:py-10">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/70 px-3 py-1 text-xs font-semibold text-[#FF8C00] shadow-sm backdrop-blur-sm">
            <Store className="h-3.5 w-3.5" />
            {ADMIN_STORE_DISPLAY_NAME}
            <Sparkles className="h-3 w-3 opacity-70" />
          </div>

          {loading ? (
            <div className="mt-5 space-y-3 max-w-lg">
              <Skeleton className="h-8 w-56 rounded-lg" />
              <Skeleton className="h-10 w-72 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          ) : (
            <>
              <p className="mt-5 text-xl sm:text-2xl font-semibold text-slate-700 tracking-tight leading-snug">
                {t('admin.dashboard.greeting', 'আসসালামু আলাইকুম,')}
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl md:text-[2rem] font-bold text-slate-900 leading-tight tracking-tight">
                <span className="text-slate-600 font-semibold text-lg sm:text-xl">
                  {t('admin.dashboard.ownerLabel', 'মালিক')}:
                </span>{' '}
                <span className="bg-gradient-to-r from-slate-900 via-[#c45f00] to-[#FF8C00] bg-clip-text text-transparent">
                  {ADMIN_OWNER_DISPLAY_NAME}
                </span>
                <span className="inline-block ml-1.5 sm:ml-2 origin-bottom-right admin-wave-hand" role="img" aria-hidden>
                  👋
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                {t(
                  'admin.dashboard.personalSubtitle',
                  'আপনার স্টোরের পারফরম্যান্স এক নজরে — পণ্য ও ক্যাটাগরি সহজেই পরিচালনা করুন।'
                )}
              </p>
            </>
          )}
        </div>

        {!loading ? (
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button type="button" className={`${adminPrimaryBtn} rounded-xl h-11 px-5`} asChild>
              <Link to="/admin/products">
                {t('admin.products.add', 'পণ্য যোগ করুন')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-xl h-11 border-orange-200/80 bg-white/60 hover:bg-white" asChild>
              <Link to="/admin/categories">{t('admin.categories.add', 'ক্যাটাগরি যোগ')}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
