import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import OrangeNavBar from '@/components/OrangeNavBar.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext.jsx';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { formatPrice } from '@/utils/formatPrice.js';

const CartPage = () => {
  const { lines, totalQuantity } = useCart();
  const { t, i18n } = useTranslationWithFallback();

  return (
    <>
      <Helmet>
        <title>{t('front.cart.title', 'Cart')}</title>
      </Helmet>
      <Header />
      <OrangeNavBar />
      <div className="container-custom mx-auto min-h-[30vh] px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">{t('front.cart.title', 'Cart')}</h1>

        {totalQuantity === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            <p className="mb-4">{t('front.cart.empty', 'Your cart is empty.')}</p>
            <Button asChild className="bg-[#FF8C00] font-semibold text-white hover:bg-[#FF8C00]/90">
              <Link to="/">{t('front.product.backHome', 'Back to home')}</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {lines.map((line) => {
              const unit =
                (line.discount || 0) > 0 ? line.price - (line.price * (line.discount || 0)) / 100 : line.price;
              const lineTotal = unit * line.quantity;
              return (
                <li key={line.productId} className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  {line.imageUrl ? (
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-md bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 [overflow-wrap:anywhere]">{line.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(unit, i18n.language)} × {line.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-[#FF8C00]">{formatPrice(lineTotal, i18n.language)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
