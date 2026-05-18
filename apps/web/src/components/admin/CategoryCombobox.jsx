import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { adminSelectClass } from '@/components/admin/adminUi.js';

/**
 * Searchable category picker (mobile-friendly combobox).
 */
export function CategoryCombobox({ categories, value, onChange, disabled = false, id }) {
  const { t } = useTranslationWithFallback();
  const [open, setOpen] = useState(false);

  const selected = categories.find((c) => c.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            adminSelectClass,
            'h-10 justify-between font-normal text-left',
            !value && 'text-slate-400'
          )}
        >
          <span className="truncate">
            {selected?.name || t('admin.products.selectCategory', 'ক্যাটাগরি নির্বাচন করুন')}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl" align="start">
        <Command>
          <CommandInput
            placeholder={t('admin.products.searchCategory', 'ক্যাটাগরি খুঁজুন…')}
            className="h-10"
          />
          <CommandList>
            <CommandEmpty>
              {t('admin.products.noCategoryMatch', 'কোনো ক্যাটাগরি পাওয়া যায়নি')}
            </CommandEmpty>
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={(current) => {
                    onChange(current === value ? '' : current);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn('mr-2 h-4 w-4 text-[#FF8C00]', value === cat.name ? 'opacity-100' : 'opacity-0')}
                  />
                  {cat.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
