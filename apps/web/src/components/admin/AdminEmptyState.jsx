import React from 'react';
import { Button } from '@/components/ui/button';
import { adminGlassCard } from '@/components/admin/adminUi.js';

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className={`${adminGlassCard} flex flex-col items-center justify-center text-center px-6 py-14 sm:py-16`}
    >
      {Icon ? (
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-[#FF8C00] shadow-inner mb-4">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? (
        <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button type="button" className="mt-6 bg-[#FF8C00] hover:bg-[#e67e00] shadow-md" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
