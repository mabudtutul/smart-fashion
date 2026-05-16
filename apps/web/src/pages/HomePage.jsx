import React from 'react';
import { Helmet } from 'react-helmet';
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
  return (
    <>
      <Helmet>
        <title>{`FlexCart - Your ultimate online shopping destination`}</title>
        <meta name="description" content="Discover the latest fashion trends, electronics, and lifestyle products at FlexCart. Shop from top brands with exclusive deals and fast shipping." />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <Header />
        <OrangeNavBar />
        
        <div className="container-custom mx-auto px-4 py-6">
          <div className="flex gap-6">
            <LeftSidebar />
            
            <div className="flex-1 overflow-hidden">
              <HeroSection />
            </div>
          </div>
        </div>
        
        <FeaturedProductsCarousel />
        <ShopCategoriesGrid />
        <PromotionalBanners />
        <BestSellersCarousel />
        <PromoBanners2Col />
        <NewProductsCarousel />
        <BlogSection />
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;