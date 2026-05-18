import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

/**
 * Drag-and-drop image picker with preview card and optional upload progress.
 */
export function ImageUploadZone({
  file,
  onFileChange,
  previewUrl = null,
  label,
  hint,
  disabled = false,
  uploadPct = null,
  required = false,
}) {
  const { t } = useTranslationWithFallback();
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = localPreview || previewUrl;
  const hasImage = Boolean(displayUrl);

  const pickFile = useCallback(
    (next) => {
      if (disabled) return;
      if (!next || !next.type?.startsWith('image/')) {
        onFileChange(null);
        return;
      }
      onFileChange(next);
    },
    [disabled, onFileChange]
  );

  const onInputChange = (e) => {
    pickFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    pickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const clear = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="text-[#FF8C00] ml-0.5">*</span> : null}
        </label>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={onInputChange}
      />

      {hasImage ? (
        <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden group">
          <img
            src={displayUrl}
            alt=""
            className="w-full h-44 sm:h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {!disabled ? (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-md hover:bg-white transition"
              >
                {t('admin.upload.replace', 'পরিবর্তন')}
              </button>
              <button
                type="button"
                onClick={clear}
                className="rounded-lg bg-white/95 p-1.5 text-slate-800 shadow-md hover:bg-red-50 hover:text-red-600 transition"
                aria-label={t('common.delete', 'মুছুন')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          {file ? (
            <p className="absolute bottom-2 left-2 right-2 truncate text-xs text-white/95 drop-shadow-md px-1">
              {file.name}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'w-full rounded-2xl border-2 border-dashed px-4 py-8 sm:py-10 text-center transition-all duration-200',
            dragOver
              ? 'border-[#FF8C00] bg-orange-50/80 scale-[1.01] shadow-inner'
              : 'border-slate-200 bg-slate-50/60 hover:border-[#FF8C00]/60 hover:bg-orange-50/40',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-[#FF8C00] mb-3">
            {dragOver ? <Upload className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
          </span>
          <p className="text-sm font-semibold text-slate-800">
            {t('admin.upload.dropTitle', 'ছবি টেনে আনুন বা ক্লিক করুন')}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {hint ||
              t('admin.upload.dropHint', 'JPG, PNG, WebP — সর্বোচ্চ ৮ MB')}
          </p>
        </button>
      )}

      {uploadPct != null ? (
        <div className="space-y-1.5 pt-1">
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF8C00] to-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center font-medium">
            {t('admin.upload.progress', 'আপলোড')} — {uploadPct}%
          </p>
        </div>
      ) : null}
    </div>
  );
}
