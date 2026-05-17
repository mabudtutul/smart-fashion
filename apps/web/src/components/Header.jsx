import React from 'react';
import { Search, Phone, User, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { useCart } from '@/context/CartContext.jsx';

const Header = () => {
  const { t } = useTranslationWithFallback();
  const { totalQuantity } = useCart();
  const badge = totalQuantity > 99 ? '99+' : String(totalQuantity);

  return (
    <header className="relative z-30 bg-white border-b border-gray-200">
      <div className="container-custom mx-auto px-4">
        <div className="flex min-w-0 w-full items-center justify-between h-20 gap-3 max-[319px]:gap-2 md:gap-8">
          {/* Logo */}
          <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity duration-200">
            <img 
              src="https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/e2fd0920f302c630ef1fc79de2da3f98.png"
              alt="Smart Fashion Logo"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden />
              <Input 
                type="text"
                placeholder={t('front.header.search', 'Search products')}
                className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00] text-gray-900"
              />
            </div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex min-w-0 items-center shrink-0 gap-3 max-[319px]:gap-1 md:gap-4 lg:gap-6">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Contact Info */}
            <div className="hidden xl:flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-[#FF8C00]" />
              <span className="text-gray-700 font-medium">{t('front.header.contact', '+1-800-123-4567')}</span>
            </div>
            
            {/* Account Icon */}
            <Button 
              variant="ghost" 
              size="icon"
              title={t('front.header.account', 'Account')}
              className="text-gray-700 hover:text-[#FF8C00] transition-colors duration-200 max-md:size-11 max-md:min-h-[44px] max-md:min-w-[44px]"
            >
              <User className="h-5 w-5" />
            </Button>
            
            {/* Wishlist Icon */}
            <Button 
              variant="ghost" 
              size="icon"
              title={t('front.header.wishlist', 'Wishlist')}
              className="text-gray-700 hover:text-[#FF8C00] transition-colors duration-200 relative max-md:size-11 max-md:min-h-[44px] max-md:min-w-[44px]"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative max-md:size-11 max-md:min-h-[44px] max-md:min-w-[44px]" asChild>
              <Link
                to="/cart"
                title={t('front.header.cart', 'Cart')}
                aria-label={`${t('front.header.cart', 'Cart')}${totalQuantity ? ` (${totalQuantity})` : ''}`}
                className="inline-flex h-9 w-9 items-center justify-center text-gray-700 transition-colors duration-200 hover:text-[#FF8C00]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#FF8C00] text-xs font-semibold text-white">
                  {badge}
                </span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search & Lang Switcher */}
        <div className="flex min-w-0 gap-2 pb-4 md:hidden">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden />
            <Input 
              type="text"
              placeholder={t('front.header.search', 'Search products')}
              className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00] text-gray-900"
            />
          </div>
          <div className="flex shrink-0 items-center sm:hidden max-md:[&_button]:min-h-11 max-md:[&_button]:min-w-11">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;