import React from 'react';
import { adminPrimaryBtn } from '@/components/admin/adminUi.js';
import { Button } from '@/components/ui/button';

export function AdminPageHeader({ title, subtitle, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-2xl leading-relaxed">{subtitle}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button type="button" className={`${adminPrimaryBtn} shrink-0`} onClick={onAction}>
          {ActionIcon ? <ActionIcon className="h-4 w-4 mr-2" /> : null}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
