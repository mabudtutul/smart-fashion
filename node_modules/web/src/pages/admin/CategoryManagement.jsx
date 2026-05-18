import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FolderTree, Sparkles } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminCatalog, isLaravelAdminCatalog } from '@/lib/adminCatalog/index.js';
import { afterCategorySaved, enrichAdminList, isLaravelAdminMedia } from '@/lib/adminMedia/index.js';
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
  adminLabelClass,
  adminSectionTitle,
  adminGlassCard,
} from '@/components/admin/adminUi.js';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState.jsx';
import { ImageUploadZone } from '@/components/admin/ImageUploadZone.jsx';
import { useSubmitGuard } from '@/hooks/useSubmitGuard.js';
import { useFormIdempotencyKey } from '@/hooks/useFormIdempotencyKey.js';

const emptyForm = { name: '', description: '', sort_order: '0' };

function CategoryCard({ category, t, onEdit, onDelete }) {
  const img = getRecordImageUrl({ ...category, collectionName: 'categories' }, { thumb: '120x120' });
  return (
    <article className={`${adminGlassCard} p-4 flex items-center gap-4`}>
      <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300">
            <FolderTree className="h-7 w-7" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900">{category.name}</h3>
        {category.description ? (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{category.description}</p>
        ) : null}
      </div>
      <div className="flex gap-1 shrink-0">
        <Button type="button" variant="outline" size="icon" className="rounded-lg h-9 w-9" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-red-600" onClick={() => onDelete(category)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

const CategoryManagement = () => {
  const { t } = useTranslationWithFallback();
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
      const res = await adminCatalog.listCategories(1, 100, { sort: 'sort_order' });
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
    setImageRemoved(false);
    setDialogOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || '',
      description: category.description || '',
      sort_order: String(category.sort_order ?? 0),
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
    if (!form.name.trim()) {
      toast.error(t('admin.categories.nameRequired', 'ক্যাটাগরির নাম আবশ্যক'));
      return;
    }

    const outcome = await submit.run(async () => {
      setUploadPct(null);
      const saveToastId = 'category-save';
      const uploadToastId = 'category-image-upload';
      toast.loading(t('admin.submit.saving', 'সেভ হচ্ছে…'), { id: saveToastId });

      try {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          sort_order: Number(form.sort_order) || 0,
        };
        if (imageFile && !isLaravelAdminCatalog()) payload.image = imageFile;

        let record;
        if (editing) {
          record = await adminCatalog.updateCategory(editing.id, payload);
          toast.success(t('admin.categories.updated', 'ক্যাটাগরি আপডেট হয়েছে'));
        } else {
          record = await adminCatalog.createCategory(payload, {
            idempotencyKey: idempotencyKeyRef.current,
          });
          toast.success(t('admin.categories.created', 'ক্যাটাগরি যোগ হয়েছে'));
        }

        if (isLaravelAdminMedia()) {
          if (imageFile) {
            toast.loading(t('admin.categories.uploading', 'আপলোড হচ্ছে…'), { id: uploadToastId });
          }
          record = await afterCategorySaved(record, imageFile, {
            onProgress: imageFile ? (pct) => setUploadPct(pct) : undefined,
            idempotencyKey: idempotencyKeyRef.current,
            removeImage: Boolean(editing && imageRemoved && !imageFile),
          });
          if (imageFile) {
            toast.success(t('admin.categories.imageUploaded', 'ছবি সফলভাবে আপলোড হয়েছে'));
          } else if (editing && imageRemoved) {
            toast.success(t('admin.categories.imageRemoved', 'ছবি সরানো হয়েছে'));
          }
        }

        setDialogOpen(false);
        await load();
      } catch (err) {
        toast.error(err?.message || t('admin.categories.saveFailed', 'সংরক্ষণ ব্যর্থ'));
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

  const handleDelete = async (category) => {
    if (!window.confirm(t('admin.categories.deleteConfirm', 'এই ক্যাটাগরিটি মুছবেন?'))) return;
    try {
      await adminCatalog.deleteCategory(category.id);
      toast.success(t('admin.categories.deleted', 'ক্যাটাগরি মুছে ফেলা হয়েছে'));
      load();
    } catch (err) {
      toast.error(err?.message || t('admin.categories.deleteFailed', 'মুছতে ব্যর্থ'));
    }
  };

  const existingPreview =
    editing && !imageFile && !imageRemoved
      ? getRecordImageUrl({ ...editing, collectionName: 'categories' }, { thumb: '400x400' })
      : null;

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={t('admin.categories.title', 'ক্যাটাগরি')}
        subtitle={t('admin.categories.subtitle', 'শপ বিভাগ ও ব্যানার ছবি পরিচালনা')}
        actionLabel={t('admin.categories.add', 'ক্যাটাগরি যোগ করুন')}
        actionIcon={Plus}
        onAction={openCreate}
      />

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <AdminEmptyState
          icon={FolderTree}
          title={t('admin.categories.emptyTitle', 'কোনো ক্যাটাগরি নেই')}
          description={t('admin.categories.emptyDesc', 'ক্যাটাগরি যোগ করে পণ্য সাজান।')}
          actionLabel={t('admin.categories.add', 'ক্যাটাগরি যোগ করুন')}
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 mb-6 lg:hidden">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} t={t} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>

          <div className={`hidden lg:block ${adminTableWrap} overflow-x-auto`}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.categories.image', 'ছবি')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.categories.name', 'নাম')}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('admin.categories.description', 'বিবরণ')}
                  </th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => {
                  const img = getRecordImageUrl(
                    { ...category, collectionName: 'categories' },
                    { thumb: '80x80' }
                  );
                  return (
                    <tr key={category.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-5 py-4">
                        {img ? (
                          <img src={img} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-100" />
                        ) : (
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                            <FolderTree className="h-5 w-5" />
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">{category.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-500 max-w-md truncate">
                        {category.description || '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button type="button" variant="ghost" size="icon" className="rounded-lg" onClick={() => openEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="rounded-lg text-red-600" onClick={() => handleDelete(category)}>
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
                ? t('admin.categories.edit', 'ক্যাটাগরি সম্পাদনা করুন')
                : t('admin.categories.add', 'ক্যাটাগরি যোগ করুন')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className={adminDialogBody} {...submit.formHandlers}>
            <fieldset disabled={submit.isLocked} className="min-w-0 border-0 p-0 m-0">
            <section className="space-y-3 mb-6">
              <p className={adminSectionTitle}>{t('admin.categories.image', 'ব্যানার ছবি')}</p>
              <ImageUploadZone
                file={imageFile}
                onFileChange={handleImageFileChange}
                previewUrl={existingPreview}
                disabled={saving}
                uploadPct={uploadPct}
              />
            </section>
            <section className="space-y-4">
              <p className={adminSectionTitle}>{t('admin.categories.details', 'তথ্য')}</p>
              <div className="space-y-2">
                <Label htmlFor="category-name" className={adminLabelClass}>
                  {t('admin.categories.name', 'নাম')}
                </Label>
                <Input
                  id="category-name"
                  required
                  className={adminInputClass}
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-desc" className={adminLabelClass}>
                  {t('admin.categories.description', 'বিবরণ')}
                </Label>
                <Textarea
                  id="category-desc"
                  rows={3}
                  className="rounded-xl resize-none"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-sort" className={adminLabelClass}>
                  {t('admin.homepage.sortOrder', 'ক্রম (হোমপেজ)')}
                </Label>
                <Input
                  id="category-sort"
                  type="number"
                  min="0"
                  className={adminInputClass}
                  value={form.sort_order}
                  onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                />
              </div>
            </section>
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

export default CategoryManagement;
