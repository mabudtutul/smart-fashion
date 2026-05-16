import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const Footer = () => {
  const { t } = useTranslationWithFallback();

  return (
    <footer className="bg-[#333333] text-white mt-12">
      {/* Newsletter Section */}
      <div className="bg-[#FF8C00] py-8">
        <div className="container-custom mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">{t('front.footer.newsletter', 'Subscribe to our newsletter')}</h3>
              <p className="text-white/90">{t('front.footer.newsletterDesc', 'Get the latest updates on new products and upcoming sales')}</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto md:min-w-[400px]">
              <Input 
                type="email"
                placeholder={t('front.footer.enterEmail', 'Enter your email')}
                className="bg-white text-gray-900 border-0 h-12"
              />
              <Button 
                size="lg"
                className="bg-[#333333] text-white hover:bg-[#2a2a2a] font-semibold transition-all duration-200 active:scale-95"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Help Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.help', 'Help')}</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Customer Service</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Track Order</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Returns</a>
              </nav>
            </div>
            
            {/* Navigate Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.navigate', 'Navigate')}</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.footer.about', 'About Us')}</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.footer.contact', 'Contact')}</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.nav.blog', 'Blog')}</a>
              </nav>
            </div>
            
            {/* Categories Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.categories', 'Categories')}</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.sidebar.womensFashion', "Women's Fashion")}</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.sidebar.mensFashion', "Men's Fashion")}</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t('front.sidebar.footwear', 'Footwear')}</a>
              </nav>
            </div>
            
            {/* Popular Brands Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('front.footer.popularBrands', 'Popular brands')}</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Nike</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Adidas</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Zara</a>
              </nav>
            </div>
          </div>
          
          {/* App Download Section */}
          <div className="mt-12 pt-8 border-t border-gray-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-gray-300 mb-3">{t('front.footer.downloadApp', 'Download our app')}</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="bg-transparent border-gray-500 text-white hover:bg-white/10 transition-all duration-200">
                    App Store
                  </Button>
                  <Button variant="outline" className="bg-transparent border-gray-500 text-white hover:bg-white/10 transition-all duration-200">
                    Google Play
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200"><Youtube className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#2a2a2a] py-4">
        <div className="container-custom mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 FlexCart. {t('front.footer.rights', 'All rights reserved.')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-200">{t('front.footer.privacy', 'Privacy Policy')}</a>
              <a href="#" className="hover:text-white transition-colors duration-200">{t('front.footer.terms', 'Terms of Service')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;