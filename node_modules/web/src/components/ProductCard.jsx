import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRecordImageUrl } from '@/lib/catalog';
import { formatPrice } from '@/utils/formatPrice.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { useCart } from '@/context/CartContext.jsx';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { i18n, t } = useTranslationWithFallback();
  const { addItem } = useCart();

  const imageUrl =
    getRecordImageUrl(product, { thumb: '300x300' }) ??
    'https://via.placeholder.com/300x300?text=No+Image';

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price;

  const formattedDiscountedPrice = formatPrice(discountedPrice, i18n.language);
  const formattedOriginalPrice = formatPrice(product.price, i18n.language);
  const detailTo = `/product/${product.id}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ${t('front.cart.added', 'added to cart')}`);
  };

  return (
    <div className="group relative rounded-lg bg-white transition-all duration-300 hover:shadow-lg">
      <Link
        to={detailTo}
        className="block overflow-hidden rounded-t-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-2"
        aria-label={`${product.name} — ${t('front.product.view', 'View product')}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute left-3 top-3 rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-black">
              -{product.discount}%
            </div>
          )}
          {product.new && (
            <div className="absolute right-3 top-3 rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">
              {t('front.product.newBadge', 'NEW')}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link
          to={detailTo}
          className="mb-2 block min-h-[2.5rem] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-1"
        >
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-[#FF8C00]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-[#FF8C00]">{formattedDiscountedPrice}</span>
                <span className="text-sm text-gray-400 line-through">{formattedOriginalPrice}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#FF8C00]">{formattedOriginalPrice}</span>
            )}
          </div>

          <Button
            type="button"
            size="icon"
            className="touch-manipulation shrink-0 rounded-full bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 active:scale-95"
            onClick={handleAdd}
            aria-label={t('front.cart.add', 'Add to cart')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
