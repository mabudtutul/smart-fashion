import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { homepage } from '@/lib/homepage';
import { normalizeMediaUrl } from '@/lib/catalog';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const FALLBACK_SLIDES = [
  {
    id: 'fallback',
    title: 'Smart Fashion',
    subtitle: '',
    button_text: '',
    button_url: '/',
    image_desktop_url:
      'https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/f183080bf46077736ba789261d4c1901.png',
    image_mobile_url:
      'https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/f183080bf46077736ba789261d4c1901.png',
  },
];

function slideImageUrls(slide) {
  const desktop = normalizeMediaUrl(slide.image_desktop_url) || normalizeMediaUrl(slide.image_mobile_url);
  const mobile = normalizeMediaUrl(slide.image_mobile_url) || desktop;
  return { desktop, mobile };
}

const HeroSection = () => {
  const { t } = useTranslationWithFallback();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 22 });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await homepage.fetch();
        const active = (data.hero_slides ?? []).filter((s) => s.is_active !== false);
        if (!cancelled) {
          setSlides(active.length > 0 ? active : FALLBACK_SLIDES);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[HeroSection] load failed', err);
        if (!cancelled) setSlides(FALLBACK_SLIDES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slides.length < 2) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 5200);
    return () => window.clearInterval(id);
  }, [emblaApi, slides.length]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides]);

  const slideCount = slides.length;

  if (loading) {
    return (
      <section className="relative z-0 w-full overflow-hidden rounded-2xl">
        <Skeleton className="aspect-[4/5] w-full sm:aspect-[21/9] md:h-[500px] md:aspect-auto" />
      </section>
    );
  }

  return (
    <section className="relative z-0 w-full overflow-hidden rounded-2xl" aria-roledescription="carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => {
            const { desktop, mobile } = slideImageUrls(slide);
            const hasCta = Boolean(slide.button_text?.trim() && slide.button_url?.trim());

            return (
              <div className="min-w-0 shrink-0 grow-0 basis-full" key={slide.id}>
                <div className="relative aspect-[4/5] w-full sm:aspect-[21/9] md:h-[500px] md:max-h-[600px] md:aspect-auto">
                  <picture>
                    <source media="(min-width: 768px)" srcSet={desktop || undefined} />
                    <img
                      src={mobile || desktop || ''}
                      alt={slide.title || t('front.hero.slide', 'Hero slide')}
                      className="h-full w-full object-cover object-center"
                      draggable={false}
                      loading={slide.id === slides[0]?.id ? 'eager' : 'lazy'}
                    />
                  </picture>

                  {(slide.title || slide.subtitle || hasCta) && (
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 sm:p-8 md:p-10">
                      {slide.title ? (
                        <h2 className="max-w-xl text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl">
                          {slide.title}
                        </h2>
                      ) : null}
                      {slide.subtitle ? (
                        <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-base">{slide.subtitle}</p>
                      ) : null}
                      {hasCta ? (
                        <div className="mt-4">
                          <Link
                            to={slide.button_url}
                            className="inline-flex items-center rounded-full bg-[#FF8C00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#FF8C00]/90"
                          >
                            {slide.button_text}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {slideCount > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-2 md:flex">
            <button
              type="button"
              aria-label={t('front.hero.prevSlide', 'Previous slide')}
              className="pointer-events-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border-0 bg-black/30 text-white transition-opacity hover:bg-black/50"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={t('front.hero.nextSlide', 'Next slide')}
              className="pointer-events-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border-0 bg-black/30 text-white transition-opacity hover:bg-black/50"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="pointer-events-auto absolute bottom-3 left-0 right-0 z-[1] flex justify-center gap-2 md:bottom-4">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={`h-2 w-2 rounded-full transition-colors touch-manipulation ${
                  i === selected ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={t('front.hero.slideDot', { defaultValue: 'Slide {{n}}', n: i + 1 })}
                aria-current={i === selected}
                onClick={() => emblaApi?.scrollTo(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
};

export default HeroSection;
