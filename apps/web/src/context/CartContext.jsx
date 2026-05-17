import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getRecordImageUrl } from '@/lib/catalog';

const STORAGE_KEY = 'smart-fashion-cart-v1';

const CartContext = createContext(null);

const loadStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [lines, setLines] = useState(loadStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota */
    }
  }, [lines]);

  const addItem = useCallback((product) => {
    if (!product?.id) return;
    setLines((prev) => {
      const id = product.id;
      const idx = prev.findIndex((l) => l.productId === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name ?? 'Product',
          price: typeof product.price === 'number' ? product.price : 0,
          discount: typeof product.discount === 'number' ? product.discount : 0,
          imageUrl: getRecordImageUrl(product, { thumb: '96x96' }) ?? undefined,
          quantity: 1
        }
      ];
    });
  }, []);

  const totalQuantity = useMemo(
    () => lines.reduce((sum, l) => sum + (l.quantity || 0), 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      addItem,
      totalQuantity
    }),
    [lines, addItem, totalQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
