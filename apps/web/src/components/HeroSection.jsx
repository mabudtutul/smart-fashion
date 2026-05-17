import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const HERO_IMG =
  'https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/f183080bf46077736ba789261d4c1901.png';

const SLIDE_COUNT = 3;

const HeroSection = () => {
  const { t } = useTranslationWithFallback();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 22 });
  const [selected, setSelected] = useState(0);

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
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 5200);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section className="relative z-0 w-full overflow-hidden rounded-2xl" aria-roledescription="carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <div className="min-w-0 shrink-0 grow-0 basis-full" key={i}>
              <div className="relative aspect-video w-full md:aspect-auto md:h-[500px] lg:h-[600px]">
                <img
                  src={HERO_IMG}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-2 md:flex">
        <button
          type="button"
          aria-label={t('front.hero.prevSlide', 'Previous slide')}
          className="pointer-events-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border-0 bg-black/30 text-white transition-opacity hover:bg-black/50 active:opacity-90"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('front.hero.nextSlide', 'Next slide')}
          className="pointer-events-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border-0 bg-black/30 text-white transition-opacity hover:bg-black/50 active:opacity-90"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <div className="pointer-events-auto absolute bottom-3 left-0 right-0 z-[1] flex justify-center gap-2 md:bottom-4">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
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
    </section>
  );
};

export default HeroSection;
