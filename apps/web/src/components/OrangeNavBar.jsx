import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const navLinkClass =
  'shrink-0 cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-white hover:text-white/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 max-md:min-h-[44px] max-md:inline-flex max-md:items-center touch-manipulation';

const navLinkFlexClass =
  'flex shrink-0 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-sm font-medium text-white hover:text-white/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 max-md:min-h-[44px] max-md:inline-flex max-md:items-center touch-manipulation';

const OrangeNavBar = () => {
  const { t } = useTranslationWithFallback();
  const location = useLocation();

  const phoneRaw = t('front.footer.businessPhone', '01345932726');
  const digitsOnly = phoneRaw.replace(/\D/g, '');
  const telHref =
    digitsOnly.length >= 10
      ? `tel:+${digitsOnly.startsWith('880') ? digitsOnly : `880${digitsOnly.replace(/^0/, '')}`}`
      : null;

  const scrollToHash =
    (hash, elementId) =>
    (e) => {
      if (location.pathname !== '/') return;
      e.preventDefault();
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== hash) {
        window.history.replaceState(null, '', hash);
      }
    };

  return (
    <div className="relative z-20 bg-[#FF8C00] text-white">
      <div className="container-custom mx-auto px-4">
        <div className="flex min-w-0 items-center justify-between h-14">
          <nav
            className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide touch-pan-x [-webkit-overflow-scrolling:touch] pr-2 touch-manipulation"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            aria-label={t('front.nav.scrollLabel', 'Browse links — scroll sideways on small screens')}
          >
            <Link
              to="/#shop-categories"
              onClick={scrollToHash('#shop-categories', 'shop-categories')}
              className={navLinkFlexClass}
            >
              {t('front.nav.shopByCategory', 'SHOP BY CATEGORIES')}
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
            </Link>

            <Link
              to="/#site-footer"
              onClick={scrollToHash('#site-footer', 'site-footer')}
              className={navLinkClass}
            >
              {t('front.nav.aboutUs', 'About Us')}
            </Link>

            <Link
              to="/#shop-categories"
              onClick={scrollToHash('#shop-categories', 'shop-categories')}
              className={navLinkClass}
            >
              {t('front.nav.affiliates', 'Affiliates')}
            </Link>

            {telHref ? (
              <a href={telHref} className={navLinkClass}>
                {t('front.nav.contactUs', 'Contact Us')}
              </a>
            ) : (
              <Link
                to="/#site-footer"
                onClick={scrollToHash('#site-footer', 'site-footer')}
                className={navLinkClass}
              >
                {t('front.nav.contactUs', 'Contact Us')}
              </Link>
            )}

            <Link
              to="/#blog"
              onClick={scrollToHash('#blog', 'blog')}
              className={navLinkClass}
            >
              {t('front.nav.recentPosts', 'Recent Posts')}
            </Link>

            <Link
              to="/#site-footer"
              onClick={scrollToHash('#site-footer', 'site-footer')}
              className={navLinkClass}
            >
              {t('front.nav.conditions', 'Blogs & Conditions')}
            </Link>

            <Link
              to="/#shop-categories"
              onClick={scrollToHash('#shop-categories', 'shop-categories')}
              className={navLinkFlexClass}
            >
              {t('front.nav.more', 'More')}
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </nav>

          <Link
            to="/#shop-categories"
            onClick={scrollToHash('#shop-categories', 'shop-categories')}
            className="touch-manipulation shrink-0 hidden cursor-pointer items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#FF8C00] hover:bg-white/90 active:scale-95 md:inline-flex"
          >
            {t('front.nav.get20', 'Get 20%')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrangeNavBar;
