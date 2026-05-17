import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import OrangeNavBar from '@/components/OrangeNavBar.jsx';
import LeftSidebar from '@/components/LeftSidebar.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import FeaturedProductsCarousel from '@/components/FeaturedProductsCarousel.jsx';
import ShopCategoriesGrid from '@/components/ShopCategoriesGrid.jsx';
import PromotionalBanners from '@/components/PromotionalBanners.jsx';
import BestSellersCarousel from '@/components/BestSellersCarousel.jsx';
import PromoBanners2Col from '@/components/PromoBanners2Col.jsx';
import NewProductsCarousel from '@/components/NewProductsCarousel.jsx';
import BlogSection from '@/components/BlogSection.jsx';
import Footer from '@/components/Footer.jsx';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const map = {
      '#shop-categories': 'shop-categories',
      '#blog': 'blog',
      '#site-footer': 'site-footer'
    };
    const elId = map[location.hash];
    if (!elId) return;
    const id = window.setTimeout(() => {
      document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  return (
    <>
      <Helmet>
        <title>Smart Fashion</title>
        <meta name="description" content="Fashion and lifestyle in Dhaka. Shop online at Smart Fashion." />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <Header />
        <OrangeNavBar />
        
        <div className="relative z-0 container-custom mx-auto px-4 py-6">
          <div className="flex gap-6">
            <LeftSidebar />
            
            <div className="relative z-0 flex-1 overflow-hidden">
              <HeroSection />
            </div>
          </div>
        </div>
        
        <ShopCategoriesGrid />
        <NewProductsCarousel />
        <FeaturedProductsCarousel />
        <BestSellersCarousel />
        <PromotionalBanners />
        <PromoBanners2Col />
        <div id="blog">
          <BlogSection />
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;