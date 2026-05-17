import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const Footer = () => {
  const { t } = useTranslationWithFallback();
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-[#333333] text-white mt-12">
      {/* Newsletter Section */}
      <div className="bg-[#FF8C00] py-8">
        <div className="container-custom mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">{t('front.footer.newsletter', 'Subscribe to our newsletter')}</h3>
              <p className="text-white/90">{t('front.footer.newsletterDesc', 'Get the latest updates on new products and upcoming sales')}</p>
            </div>
            
            <div className="flex w-full min-w-0 flex-col gap-3 self-stretch md:w-auto md:min-w-[400px] md:flex-row md:gap-2 md:self-auto">
              <Input 
                type="email"
                placeholder={t('front.footer.enterEmail', 'Enter your email')}
                className="h-12 min-w-0 w-full shrink-0 border-0 bg-white text-gray-900 md:min-w-0 md:flex-1 md:shrink"
              />
              <Button 
                type="button"
                size="lg"
                className="touch-manipulation w-full shrink-0 bg-[#333333] text-white hover:bg-[#2a2a2a] font-semibold transition-all duration-200 active:scale-95 md:w-auto"
              >
                {t('front.footer.subscribe', 'Subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container-custom mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.support', 'সহায়তা')}</h4>
              <nav className="flex flex-col gap-2">
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.customerService', 'গ্রাহক সেবা')}</button>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.trackOrder', 'অর্ডার ট্র্যাক')}</button>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.returns', 'রিটার্ন')}</button>
              </nav>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.contactHeading', 'যোগাযোগ')}</h4>
              <nav className="flex flex-col gap-2">
                <a
                  href={`mailto:${t('front.footer.businessEmail', 'smartfashion.site@gmail.com')}`}
                  className="flex min-h-11 w-full touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60 [overflow-wrap:anywhere]"
                >
                  {t('front.footer.businessEmail', 'smartfashion.site@gmail.com')}
                </a>
                <a
                  href="tel:+8801345932726"
                  className="flex min-h-11 w-full touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  {t('front.footer.businessPhone', '০১৩৪৫৯৩২৭২৬')}
                </a>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.about', 'সম্পর্কে')}</button>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.nav.blog', 'ব্লগ')}</button>
              </nav>
            </div>
            
            {/* Categories Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.categories', 'Categories')}</h4>
              <nav className="flex flex-col gap-2">
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.sidebar.womensFashion', "Women's Fashion")}</button>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.sidebar.mensFashion', "Men's Fashion")}</button>
                <button type="button" className="flex min-h-11 w-full cursor-default touch-manipulation items-center border-0 bg-transparent p-0 text-left text-sm text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.sidebar.footwear', 'Footwear')}</button>
              </nav>
            </div>
          </div>
          
          <nav className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-gray-600 pt-8 md:justify-end" aria-label={t('front.footer.socialLabel', 'Social links')}>
            <button type="button" aria-label="Facebook" className="inline-flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded border-0 bg-transparent p-0 text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"><Facebook className="h-5 w-5" aria-hidden /></button>
            <button type="button" aria-label="Instagram" className="inline-flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded border-0 bg-transparent p-0 text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"><Instagram className="h-5 w-5" aria-hidden /></button>
            <button
              type="button"
              aria-label={t('front.footer.tiktok', 'TikTok')}
              className="inline-flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded border-0 bg-transparent p-0 text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              <TikTokIcon className="h-5 w-5" />
            </button>
            <button type="button" aria-label={t('front.footer.socialYoutube', 'YouTube')} className="inline-flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded border-0 bg-transparent p-0 text-gray-300 transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"><Youtube className="h-5 w-5" aria-hidden /></button>
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#2a2a2a] py-4">
        <div className="container-custom mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p className="min-w-0 max-w-full text-center md:text-left [overflow-wrap:anywhere]">
              © {year} {t('front.footer.copyrightBrand', 'স্মার্ট ফ্যাশন')}
              <br />
              {t('front.footer.proprietorLine', 'মালিক: মোহাম্মদ হোসেন')}
              <br />
              {t('front.footer.locationLine', 'ঢাকা — জামুনা ফিউচার পার্ক, বাংলাদেশ')}
            </p>
            <div className="flex flex-wrap gap-6" role="group" aria-label={t('front.footer.policies', 'Policies')}>
              <button type="button" className="inline-flex min-h-11 cursor-default touch-manipulation items-center border-0 bg-transparent px-0 py-1 text-inherit transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.privacy', 'Privacy Policy')}</button>
              <button type="button" className="inline-flex min-h-11 cursor-default touch-manipulation items-center border-0 bg-transparent px-0 py-1 text-inherit transition-colors duration-200 hover:text-white active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60">{t('front.footer.terms', 'Terms of Service')}</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;