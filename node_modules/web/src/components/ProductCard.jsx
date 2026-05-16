import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { formatPrice } from '@/utils/formatPrice.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const ProductCard = ({ product, onAddToCart }) => {
  const { i18n } = useTranslationWithFallback();
  
  const imageUrl = product.image 
    ? pb.files.getUrl(product, product.image, { thumb: '300x300' })
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const formattedDiscountedPrice = formatPrice(discountedPrice, i18n.language);
  const formattedOriginalPrice = formatPrice(product.price, i18n.language);

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        {product.new && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-[#FF8C00]">
                  {formattedDiscountedPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formattedOriginalPrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#FF8C00]">
                {formattedOriginalPrice}
              </span>
            )}
          </div>
          
          <Button
            size="icon"
            className="rounded-full bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white transition-all duration-200 active:scale-95"
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;