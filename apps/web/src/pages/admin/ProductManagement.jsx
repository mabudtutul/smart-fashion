import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, Sparkles } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminCatalog, isLaravelAdminCatalog } from '@/lib/adminCatalog/index.js';
import { afterProductSaved, enrichAdminList, isLaravelAdminMedia } from '@/lib/adminMedia/index.js';
import { getRecordImageUrl } from '@/lib/catalog/index.js';
import { toast } from 'sonner';
import {
  adminPageClass,
  adminPrimaryBtn,
  adminTableWrap,
  adminDialogContent,
  adminDialogBody,
  adminDialogHeader,
  adminInputClass,
  adminSelectClass,
  adminLabelClass,
  adminSectionTitle,
  adminGlassCard,
} from '@/components/admin/adminUi.js';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState.jsx';
import { ImageUploadZone } from '@/components/admin/ImageUploadZone.jsx';
import { CategoryCombobox } from '@/components/admin/CategoryCombobox.jsx';
import { PriceInput } from '@/components/admin/PriceInput.jsx';
import { formatPrice } from '@/utils/formatPrice.js';
import { useSubmitGuard } from '@/hooks/useSubmitGuard.js';
import { useFormIdempotencyKey } from '@/hooks/useFormIdempotencyKey.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  discount: '',
  featured: false,
  bestseller: false,
  new: false,
};

function ProductMobileCard({ product, t, onEdit, onDelete }) {
  const img = getRecordImageUrl({ ...product, collectionName: 'products' }, { thumb: '120x120' });
  const flags = [
    product.featured && t('admin.products.featured', 'ফিচারড'),
    product.new && t('admin.products.new', 'নতুন'),
    product.bestseller && t('admin.products.bestseller', 'বেস্টসেলার'),
  ].filter(Boolean);

  return (
    <article className={`${adminGlassCard} p-4 flex gap-4`}>
      <div className="shrink-0 h-20 w-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300">
            <Package className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
        <p className="text-sm text-[#FF8C00] font-medium mt-0.5">{formatPrice(product.price, 'bn')}</p>
        <p className="text-xs text-slate-500 mt-1">{product.category}</p>
        {flags.length > 0 ? (
          <p className="text-[11px] text-slate-400 mt-1.5 truncate">{flags.join(' · ')}</p>
        ) : null}
        <div className="flex gap-1 mt-3">
          <Button type="button" variant="outline" size="sm" className="rounded-lg h-8" onClick={() => onEdit(product)}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            {t('common.edit', 'সম্পাদনা')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg h-8 text-red-600"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

const ProductManagement = () => {
  const { t } = useTranslationWithFallback();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);
  const submit = useSubmitGuard();
  const saving = submit.isPending;
  const idempotencyKeyRef = useFormIdempotencyKey(dialogOpen, editing?.id ?? 'create');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminCatalog.listProducts(1, 100, { sort: '-created' }),
        adminCatalog.listCategories(1, 100, { sort: 'name' }),
      ]);
      setProducts(enrichAdminList(productsRes.items));
      setCategories(enrichAdminList(categoriesRes.items));
    } catch (err) {
      toast.error(err?.message || t('admin.products.loadFailed', 'পণ্য লোড করা যায়নি'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.name || '' });
    setImageFile(null);
    setImageRemoved(false);
    setDialogOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      stock: product.stock != null ? String(product.stock) : '',
      discount: product.discount != null ? String(product.discount) : '',
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
      new: Boolean(product.new),
    });
    setImageFile(null);
    setImageRemoved(false);
    setDialogOpen(true);
  };

  const handleImageFileChange = (file) => {
    setImageFile(file);
    if (file) {
      setImageRemoved(false);
    } else if (editing) {
      setImageRemoved(true);
    }
  };

  const handleDialogOpen = (open) => {
    if (submit.isLocked) return;
    setDialogOpen(open);
  };

  const handleSubmit = submit.guardSubmit(async () => {
    if (!form.name.trim() || !form.category?.trim() || form.price === '') {
      toast.error(t('admin.products.requiredFields', 'নাম, ক্যাটাগরি ও মূল্য আবশ্যক'));
      return;
    }
    if (!editing && !imageFile) {
      toast.error(t('admin.products.imageRequired', 'নতুন পণ্যের জন্য ছবি আবশ্যক'));
      return;
    }

    const outcome = await submit.run(async () => {
      setUploadPct(null);
      const saveToastId = 'product-save';
      const uploadToastId = 'product-image-upload';
      toast.loading(t('admin.submit.saving', 'সেভ হচ্ছে…'), { id: saveToastId });

      try {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          featured: form.featured,
          bestseller: form.bestseller,
          new: form.new,
        };
        if (form.stock !== '') payload.stock = Number(form.stock);
        if (form.discount !== '') payload.discount = Number(form.discount);
        if (imageFile && !isLaravelAdminCatalog()) payload.image = imageFile;

        let record;
        if (editing) {
          record = await adminCatalog.updateProduct(editing.id, payload);
          toast.success(t('admin.products.updated', 'পণ্য আপডেট হয়েছে'));
        } else {
          record = await adminCatalog.createProduct(payload, {
            idempotencyKey: idempotencyKeyRef.current,
          });
          toast.success(t('admin.products.created', 'পণ্য যোগ হয়েছে'));
        }

        if (isLaravelAdminMedia()) {
          if (imageFile) {
            toast.loading(t('admin.products.uploading', 'আপলোড হচ্ছে…'), { id: uploadToastId });
          }
          record = await afterProductSaved(record, imageFile, {
            onProgress: imageFile ? (pct) => setUploadPct(pct) : undefined,
            idempotencyKey: idempotencyKeyRef.current,
            removeImage: Boolean(editing && imageRemoved && !imageFile),
          });
          if (imageFile) {
            toast.success(t('admin.products.imageUploaded', 'ছবি সফলভাবে আপলোড হয়েছে'));
          } else if (editing && imageRemoved) {
            toast.success(t('admin.products.imageRemoved', 'ছবি সরানো হয়েছে'));
          }
        }

        setDialogOpen(false);
        await load();
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[ProductManagement] save failed', {
            message: err?.message,
            status: err?.status,
            data: err?.data,
          });
        }
        toast.error(err?.message || t('admin.products.saveFailed', 'সংরক্ষণ ব্যর্থ'));
        throw err;
      } finally {
        toast.dismiss(saveToastId);
        toast.dismiss(uploadToastId);
        setUploadPct(null);
      }
    });

    if (outcome?.skipped) {
      return;
    }
  });

  const handleDelete = async (product) => {
    if (!window.confirm(t('admin.products.deleteConfirm', 'এই পণ্যটি মুছবেন?'))) return;
    try {
      await adminCatalog.deleteProduct(product.id);
      toast.success(t('admin.products.deleted', 'পণ্য মুছে ফেলা হয়েছে'));
      load();
    } catch (err) {
      toast.error(err?.message || t('admin.products.deleteFailed', 'মুছতে ব্যর্থ'));
    }
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const existingPreview =
    editing && !imageFile && !imageRemoved
      ? getRecordImageUrl({ ...editing, collectionName: 'products' }, { thumb: '400x400' })
      : null;

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={t('admin.nav.products', 'পণ্যসমূহ')}
        subtitle={t('admin.products.subtitle', 'স্টোরের সব পণ্য পরিচালনা করুন')}
        actionLabel={t('admin.products.add', 'পণ্য যোগ করুন')}
        actionIcon={Plus}
        onAction={openCreate}
      />

      {loading ? (
        <div className="space-y-4">
          <div className="hidden md:block">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="md:hidden grid gap-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <AdminEmptyState
          icon={Package}
          title={t('admin.products.emptyTitle', 'এখনও কোনো পণ্য নেই')}
          description={t('admin.products.emptyDesc', 'প্রথম পণ্য যোগ করে স্টোর শুরু করুন।')}
          actionLabel={t('admin.products.add', 'পণ্য যোগ করুন')}
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="md:hidden grid gap-3 mb-6">
            {products.map((product) => (
              <ProductMobileCard
                key={product.id}
                product={product}
                t={t}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className={`hidden md:block ${adminTableWrap} overflow-x-auto`}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.products.image', 'ছবি')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.products.name', 'পণ্যের নাম')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.products.price', 'মূল্য')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.products.category', 'ক্যাটাগরি')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.products.flags', 'হোমপেজ')}
                  </th>
                  <th className="px-5 py-3.5 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const img = getRecordImageUrl(
                    { ...product, collectionName: 'products' },
                    { thumb: '80x80' }
                  );
                  return (
                    <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-5 py-4">
                        {img ? (
                          <img src={img} alt="" className="h-14 w-14 object-cover rounded-xl ring-1 ring-slate-100" />
                        ) : (
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                            <Package className="h-5 w-5" />
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">{product.name}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[#FF8C00]">{formatPrice(product.price, 'bn')}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{product.category}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {[
                          product.featured && t('admin.products.featured', 'ফিচারড'),
                          product.new && t('admin.products.new', 'নতুন'),
                          product.bestseller && t('admin.products.bestseller', 'বেস্টসেলার'),
                        ]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button type="button" variant="ghost" size="icon" className="rounded-lg" onClick={() => openEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="rounded-lg text-red-600" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
        <DialogContent className={adminDialogContent}>
          <DialogHeader className={adminDialogHeader}>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF8C00]" />
              {editing
                ? t('admin.products.edit', 'পণ্য সম্পাদনা করুন')
                : t('admin.products.add', 'পণ্য যোগ করুন')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className={adminDialogBody} {...submit.formHandlers}>
            <fieldset disabled={submit.isLocked} className="min-w-0 border-0 p-0 m-0">
            <div className="space-y-6">
              <section className="space-y-3">
                <p className={adminSectionTitle}>{t('admin.products.image', 'ছবি')}</p>
                <ImageUploadZone
                  file={imageFile}
                  onFileChange={handleImageFileChange}
                  previewUrl={existingPreview}
                  required={!editing}
                  disabled={saving}
                  uploadPct={uploadPct}
                />
              </section>

              <section className="space-y-4">
                <p className={adminSectionTitle}>{t('admin.products.details', 'বিবরণ')}</p>
                <div className="space-y-2">
                  <Label htmlFor="product-name" className={adminLabelClass}>
                    {t('admin.products.name', 'পণ্যের নাম')}
                  </Label>
                  <Input
                    id="product-name"
                    required
                    className={adminInputClass}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-desc" className={adminLabelClass}>
                    {t('admin.products.description', 'বিবরণ')}
                  </Label>
                  <Textarea
                    id="product-desc"
                    rows={3}
                    className="rounded-xl resize-none"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price" className={adminLabelClass}>
                      {t('admin.products.price', 'মূল্য')}
                    </Label>
                    <PriceInput
                      id="product-price"
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={form.price}
                      onChange={(e) => setField('price', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category" className={adminLabelClass}>
                      {t('admin.products.category', 'ক্যাটাগরি')}
                    </Label>
                    <CategoryCombobox
                      id="product-category"
                      categories={categories}
                      value={form.category}
                      onChange={(name) => setField('category', name)}
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-stock" className={adminLabelClass}>
                      {t('admin.products.stock', 'স্টক')}
                    </Label>
                    <Input
                      id="product-stock"
                      type="number"
                      min="0"
                      className={adminInputClass}
                      value={form.stock}
                      onChange={(e) => setField('stock', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-discount" className={adminLabelClass}>
                      {t('admin.products.discount', 'ছাড় (%)')}
                    </Label>
                    <Input
                      id="product-discount"
                      type="number"
                      min="0"
                      max="100"
                      className={adminInputClass}
                      value={form.discount}
                      onChange={(e) => setField('discount', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <p className={adminSectionTitle}>{t('admin.products.flags', 'হোমপেজ')}</p>
                <div className="flex flex-wrap gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.featured} onCheckedChange={(v) => setField('featured', Boolean(v))} />
                    {t('admin.products.featured', 'ফিচারড')}
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.new} onCheckedChange={(v) => setField('new', Boolean(v))} />
                    {t('admin.products.new', 'নতুন')}
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.bestseller} onCheckedChange={(v) => setField('bestseller', Boolean(v))} />
                    {t('admin.products.bestseller', 'বেস্টসেলার')}
                  </label>
                </div>
              </section>
            </div>

            <Button type="submit" className={`w-full mt-6 h-11 rounded-xl ${adminPrimaryBtn}`} disabled={submit.isLocked}>
              {submit.isLocked
                ? uploadPct != null
                  ? t('admin.submit.uploading', 'আপলোড হচ্ছে…')
                  : t('admin.submit.saving', 'সেভ হচ্ছে…')
                : t('common.save', 'সংরক্ষণ')}
            </Button>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
