import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { homepage } from '@/lib/homepage';
import { normalizeMediaUrl } from '@/lib/catalog';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const FALLBACK_BANNERS = [
  { id: '1', title: 'Style Hat Cap', button_text: 'Shop Now', button_url: '/', image_url: null, accent: 'bg-yellow-400' },
  { id: '2', title: 'Daniel Wellington', button_text: 'Shop Now', button_url: '/', image_url: null, accent: 'bg-[#333333]' },
  { id: '3', title: 'Diamond Ring', button_text: 'Shop Now', button_url: '/', image_url: null, accent: 'bg-red-500' },
];

const PromotionalBanners = () => {
  const { t } = useTranslationWithFallback();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await homepage.fetch();
        const row = (data.banners ?? []).filter(
          (b) => b.is_active !== false && (b.placement === 'promo_row' || !b.placement)
        );
        if (!cancelled) setBanners(row.length > 0 ? row : FALLBACK_BANNERS);
      } catch {
        if (!cancelled) setBanners(FALLBACK_BANNERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="overflow-x-clip bg-white py-8">
        <div className="container-custom mx-auto grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="min-h-[280px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-clip bg-white py-8 sm:py-10">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {banners.slice(0, 3).map((banner, index) => {
            const imageUrl = normalizeMediaUrl(banner.image_url);
            const accent = banner.accent || ['bg-yellow-400', 'bg-[#333333]', 'bg-red-500'][index % 3];
            const lightText = accent.includes('yellow');

            return (
              <article
                key={banner.id}
                className={`relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl p-6 sm:min-h-[280px] sm:p-8 ${
                  imageUrl ? '' : accent
                }`}
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </>
                ) : null}
                <div className={`relative z-10 ${imageUrl || !lightText ? 'text-white' : 'text-gray-900'}`}>
                  <h3 className="mb-3 text-2xl font-bold sm:text-3xl">{banner.title}</h3>
                  {banner.subtitle ? <p className="mb-4 text-sm opacity-90">{banner.subtitle}</p> : null}
                  <Button
                    type="button"
                    size="sm"
                    className="touch-manipulation rounded-full bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 active:scale-95"
                    asChild
                  >
                    <Link to={banner.button_url || '/'}>
                      {banner.button_text || t('front.hero.shopNow', 'Shop Now')}
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;
