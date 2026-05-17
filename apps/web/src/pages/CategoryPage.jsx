import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import OrangeNavBar from '@/components/OrangeNavBar.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { t } = useTranslationWithFallback();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decoded = categoryName ? decodeURIComponent(categoryName) : '';

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!decoded) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const safe = JSON.stringify(decoded);
        const records = await pb.collection('products').getList(1, 50, {
          filter: `category = ${safe}`,
          sort: '-created',
          $autoCancel: false
        });
        if (!cancelled) setProducts(records.items);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(t('front.category.loadError', 'Could not load products.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [decoded, t]);

  return (
    <>
      <Helmet>
        <title>{decoded || t('front.category.title', 'Category')}</title>
      </Helmet>
      <Header />
      <OrangeNavBar />
      <div className="container-custom mx-auto px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-block text-sm font-medium text-[#FF8C00] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
        >
          ← {t('front.product.backHome', 'Back to home')}
        </Link>
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">{decoded}</h1>

        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">{t('front.category.empty', 'No products in this category yet.')}</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
