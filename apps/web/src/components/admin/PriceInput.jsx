import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { adminInputClass } from '@/components/admin/adminUi.js';
import { BDT_SYMBOL } from '@/utils/formatPrice.js';

export function PriceInput({ className, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#FF8C00] pointer-events-none">
        {BDT_SYMBOL}
      </span>
      <Input className={cn(adminInputClass, 'pl-8', className)} {...props} />
    </div>
  );
}
