import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { adminCatalog, isLaravelAdminCatalog } from '@/lib/adminCatalog/index.js';
import { afterProductSaved, enrichAdminList, isLaravelAdminMedia } from '@/lib/adminMedia/index.js';
import { getRecordImageUrl } from '@/lib/catalog/index.js';
import { toast } from 'sonner';

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

const ProductManagement = () => {
  const { t } = useTranslationWithFallback();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

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
    setForm({
      ...emptyForm,
      category: categories[0]?.name || '',
    });
    setImageFile(null);
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
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category || form.price === '') {
      toast.error(t('admin.products.requiredFields', 'নাম, ক্যাটাগরি ও মূল্য আবশ্যক'));
      return;
    }
    if (!editing && !imageFile) {
      toast.error(t('admin.products.imageRequired', 'নতুন পণ্যের জন্য ছবি আবশ্যক'));
      return;
    }

    setSaving(true);
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
      if (imageFile && !isLaravelAdminCatalog()) {
        payload.image = imageFile;
      }

      let record;
      if (editing) {
        record = await adminCatalog.updateProduct(editing.id, payload);
        toast.success(t('admin.products.updated', 'পণ্য আপডেট হয়েছে'));
      } else {
        record = await adminCatalog.createProduct(payload);
        toast.success(t('admin.products.created', 'পণ্য যোগ হয়েছে'));
      }

      if (isLaravelAdminMedia()) {
        if (imageFile) {
          toast.loading(t('admin.products.uploading', 'ছবি আপলোড হচ্ছে…'), {
            id: 'product-image-upload',
          });
        }
        record = await afterProductSaved(record, imageFile);
        toast.dismiss('product-image-upload');
      }

      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err?.message || t('admin.products.saveFailed', 'সংরক্ষণ ব্যর্থ'));
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">{t('admin.nav.products', 'পণ্যসমূহ')}</h1>
        <Button type="button" className="bg-[#FF8C00] hover:bg-[#FF8C00]/90" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.products.add', 'পণ্য যোগ করুন')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">{t('admin.products.image', 'ছবি')}</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">{t('admin.products.name', 'পণ্যের নাম')}</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">{t('admin.products.price', 'মূল্য')}</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">{t('admin.products.category', 'ক্যাটাগরি')}</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">{t('admin.products.flags', 'হোমপেজ')}</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {t('common.loading', 'লোড হচ্ছে...')}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {t('common.noResults', 'কোন ফলাফল পাওয়া যায়নি')}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {getRecordImageUrl(
                      { ...product, collectionName: 'products' },
                      { thumb: '80x80' }
                    ) ? (
                      <img
                        src={getRecordImageUrl(
                          { ...product, collectionName: 'products' },
                          { thumb: '80x80' }
                        )}
                        alt=""
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-sm">{product.price}</td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {[
                      product.featured && t('admin.products.featured', 'ফিচারড'),
                      product.new && t('admin.products.new', 'নতুন'),
                      product.bestseller && t('admin.products.bestseller', 'বেস্টসেলার'),
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.edit', 'সম্পাদনা করুন')}
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.delete', 'মুছুন')}
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t('admin.products.edit', 'পণ্য সম্পাদনা করুন')
                : t('admin.products.add', 'পণ্য যোগ করুন')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">{t('admin.products.name', 'পণ্যের নাম')}</Label>
              <Input
                id="product-name"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-desc">{t('admin.products.description', 'বিবরণ')}</Label>
              <Textarea
                id="product-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="product-price">{t('admin.products.price', 'মূল্য')}</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">{t('admin.products.category', 'ক্যাটাগরি')}</Label>
                <select
                  id="product-category"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                >
                  <option value="">{t('admin.products.selectCategory', 'ক্যাটাগরি নির্বাচন করুন')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="product-stock">{t('admin.products.stock', 'স্টক')}</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-discount">{t('admin.products.discount', 'ছাড় (%)')}</Label>
                <Input
                  id="product-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) => setField('discount', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image">{t('admin.products.image', 'ছবি')}</Label>
              <Input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editing && !imageFile && getRecordImageUrl(
                { ...editing, collectionName: 'products' },
                { thumb: '120x120' }
              ) && (
                <img
                  src={getRecordImageUrl(
                    { ...editing, collectionName: 'products' },
                    { thumb: '120x120' }
                  )}
                  alt=""
                  className="h-20 w-20 object-cover rounded mt-2"
                />
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.featured} onCheckedChange={(v) => setField('featured', Boolean(v))} />
                {t('admin.products.featured', 'ফিচারড')}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.new} onCheckedChange={(v) => setField('new', Boolean(v))} />
                {t('admin.products.new', 'নতুন')}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.bestseller}
                  onCheckedChange={(v) => setField('bestseller', Boolean(v))}
                />
                {t('admin.products.bestseller', 'বেস্টসেলার')}
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90"
              disabled={saving}
            >
              {saving ? t('common.saving', 'সংরক্ষণ করা হচ্ছে…') : t('common.save', 'সংরক্ষণ')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
