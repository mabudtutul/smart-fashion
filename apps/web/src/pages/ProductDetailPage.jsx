import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import OrangeNavBar from '@/components/OrangeNavBar.jsx';
import Footer from '@/components/Footer.jsx';
import { catalog, getRecordImageUrl } from '@/lib/catalog';
import { CATALOG_IMAGE_PLACEHOLDER } from '@/utils/catalogPlaceholder.js';
import { formatPrice } from '@/utils/formatPrice.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { useCart } from '@/context/CartContext.jsx';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslationWithFallback();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setMissing(false);
      try {
        const record = await catalog.getProduct(id);
        if (!cancelled) setProduct(record);
      } catch {
        if (!cancelled) {
          setProduct(null);
          setMissing(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const imageUrl = getRecordImageUrl(product, { thumb: '600x600' }) ?? CATALOG_IMAGE_PLACEHOLDER;

  const discounted =
    product && product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product?.price ?? 0;

  if (loading) {
    return (
      <>
        <Header />
        <OrangeNavBar />
        <div className="container-custom mx-auto min-h-[40vh] px-4 py-10">
          <Skeleton className="mx-auto mb-6 h-10 max-w-sm" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (missing || !product) {
    return (
      <>
        <Helmet>
          <title>{t('front.product.notFound', 'Product not found')}</title>
        </Helmet>
        <Header />
        <OrangeNavBar />
        <div className="container-custom mx-auto px-4 py-16 text-center">
          <p className="mb-6 text-lg text-gray-600">{t('front.product.notFound', 'Product not found')}</p>
          <Button asChild className="bg-[#FF8C00] font-semibold text-white hover:bg-[#FF8C00]/90">
            <Link to="/">{t('front.product.backHome', 'Back to home')}</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={product.description || product.name} />
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
        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = CATALOG_IMAGE_PLACEHOLDER;
              }}
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>
            <div className="mb-6 flex flex-wrap items-baseline gap-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-[#FF8C00]">{formatPrice(discounted, i18n.language)}</span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price, i18n.language)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#FF8C00]">{formatPrice(product.price, i18n.language)}</span>
              )}
            </div>
            {product.description ? (
              <p className="mb-8 text-gray-600 [overflow-wrap:anywhere]">{product.description}</p>
            ) : null}
            <Button
              type="button"
              size="lg"
              className="touch-manipulation w-full max-w-xs bg-[#FF8C00] font-semibold text-white hover:bg-[#FF8C00]/90 md:w-auto"
              onClick={() => {
                addItem(product);
                toast.success(`${product.name} ${t('front.cart.added', 'added to cart')}`);
              }}
            >
              <Plus className="mr-2 h-5 w-5" />
              {t('front.cart.add', 'Add to cart')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
