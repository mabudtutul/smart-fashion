import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { afterCategorySaved, enrichAdminList, isLaravelAdminMedia } from '@/lib/adminMedia/index.js';
import { getRecordImageUrl } from '@/lib/catalog/index.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const emptyForm = { name: '', description: '' };

const CategoryManagement = () => {
  const { t } = useTranslationWithFallback();
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
      const res = await pb.collection('categories').getList(1, 100, { sort: 'name' });
      setCategories(enrichAdminList(res.items));
    } catch (err) {
      toast.error(err?.message || t('admin.categories.loadFailed', 'ক্যাটাগরি লোড করা যায়নি'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || '',
      description: category.description || '',
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error(t('admin.categories.nameRequired', 'ক্যাটাগরির নাম আবশ্যক'));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };
      if (imageFile && !isLaravelAdminMedia()) {
        payload.image = imageFile;
      }

      let record;
      if (editing) {
        record = await pb.collection('categories').update(editing.id, payload);
        toast.success(t('admin.categories.updated', 'ক্যাটাগরি আপডেট হয়েছে'));
      } else {
        record = await pb.collection('categories').create(payload);
        toast.success(t('admin.categories.created', 'ক্যাটাগরি যোগ হয়েছে'));
      }

      if (isLaravelAdminMedia()) {
        if (imageFile) {
          toast.loading(t('admin.categories.uploading', 'ছবি আপলোড হচ্ছে…'), {
            id: 'category-image-upload',
          });
        }
        await afterCategorySaved(record, imageFile);
        toast.dismiss('category-image-upload');
      }

      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err?.message || t('admin.categories.saveFailed', 'সংরক্ষণ ব্যর্থ'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(t('admin.categories.deleteConfirm', 'এই ক্যাটাগরিটি মুছবেন?'))) return;
    try {
      await pb.collection('categories').delete(category.id);
      toast.success(t('admin.categories.deleted', 'ক্যাটাগরি মুছে ফেলা হয়েছে'));
      load();
    } catch (err) {
      toast.error(err?.message || t('admin.categories.deleteFailed', 'মুছতে ব্যর্থ'));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">{t('admin.categories.title', 'ক্যাটাগরি')}</h1>
        <Button type="button" className="bg-[#FF8C00] hover:bg-[#FF8C00]/90" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.categories.add', 'ক্যাটাগরি যোগ করুন')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-left min-w-[480px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">
                {t('admin.categories.image', 'ছবি')}
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">
                {t('admin.categories.name', 'নাম')}
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  {t('common.loading', 'লোড হচ্ছে...')}
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  {t('common.noResults', 'কোন ফলাফল পাওয়া যায়নি')}
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {getRecordImageUrl(
                      { ...category, collectionName: 'categories' },
                      { thumb: '80x80' }
                    ) ? (
                      <img
                        src={getRecordImageUrl(
                          { ...category, collectionName: 'categories' },
                          { thumb: '80x80' }
                        )}
                        alt=""
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.edit', 'সম্পাদনা করুন')}
                      onClick={() => openEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.delete', 'মুছুন')}
                      onClick={() => handleDelete(category)}
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
                ? t('admin.categories.edit', 'ক্যাটাগরি সম্পাদনা করুন')
                : t('admin.categories.add', 'ক্যাটাগরি যোগ করুন')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">{t('admin.categories.name', 'নাম')}</Label>
              <Input
                id="category-name"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-desc">{t('admin.categories.description', 'বিবরণ')}</Label>
              <Textarea
                id="category-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-image">{t('admin.categories.image', 'ছবি')}</Label>
              <Input
                id="category-image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editing && !imageFile && getRecordImageUrl(
                { ...editing, collectionName: 'categories' },
                { thumb: '120x120' }
              ) && (
                <img
                  src={getRecordImageUrl(
                    { ...editing, collectionName: 'categories' },
                    { thumb: '120x120' }
                  )}
                  alt=""
                  className="h-20 w-20 object-cover rounded mt-2"
                />
              )}
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

export default CategoryManagement;
