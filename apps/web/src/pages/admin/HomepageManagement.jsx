import React, { useCallback, useEffect, useState } from 'react';
import { Image, Layout, Monitor, Plus, Smartphone, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx';
import { ImageUploadZone } from '@/components/admin/ImageUploadZone.jsx';
import { adminHomepage, isHomepageCmsAvailable } from '@/lib/adminHomepage/index.js';
import { normalizeMediaUrl } from '@/lib/catalog';
import {
  adminPageClass,
  adminPrimaryBtn,
  adminDialogContent,
  adminDialogBody,
  adminDialogHeader,
  adminInputClass,
  adminLabelClass,
  adminGlassCard,
  adminSectionTitle,
} from '@/components/admin/adminUi.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { useSubmitGuard } from '@/hooks/useSubmitGuard.js';
import { useFormIdempotencyKey } from '@/hooks/useFormIdempotencyKey.js';

const emptySlideForm = {
  title: '',
  subtitle: '',
  button_text: '',
  button_url: '/',
  sort_order: '0',
  is_active: true,
};

const emptyBannerForm = {
  title: '',
  subtitle: '',
  button_text: '',
  button_url: '/',
  placement: 'promo_row',
  sort_order: '0',
  is_active: true,
};

const HomepageManagement = () => {
  const { t } = useTranslationWithFallback();
  const [tab, setTab] = useState('hero');
  const [slides, setSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slideDialog, setSlideDialog] = useState(false);
  const [bannerDialog, setBannerDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [slideForm, setSlideForm] = useState(emptySlideForm);
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(null);
  const [uploadLabel, setUploadLabel] = useState('');
  const slideSubmit = useSubmitGuard();
  const bannerSubmit = useSubmitGuard();
  const slideIdempotencyRef = useFormIdempotencyKey(slideDialog, editingSlide?.id ?? 'slide-create');
  const bannerIdempotencyRef = useFormIdempotencyKey(bannerDialog, editingBanner?.id ?? 'banner-create');

  const load = useCallback(async () => {
    if (!adminHomepage) return;
    setLoading(true);
    try {
      const [slidesRes, bannersRes, healthRes] = await Promise.all([
        adminHomepage.listHeroSlides(),
        adminHomepage.listBanners(),
        adminHomepage.fetchMediaHealth().catch(() => null),
      ]);
      setSlides(slidesRes.items ?? []);
      setBanners(bannersRes.items ?? []);
      setHealth(healthRes);
    } catch (err) {
      toast.error(err?.message || 'হোমপেজ ডেটা লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!isHomepageCmsAvailable()) {
    return (
      <div className={adminPageClass}>
        <p className="text-slate-600">হোমপেজ CMS শুধু Laravel অ্যাডমিন মোডে উপলব্ধ।</p>
      </div>
    );
  }

  const openSlideCreate = () => {
    setEditingSlide(null);
    setSlideForm(emptySlideForm);
    setDesktopFile(null);
    setMobileFile(null);
    setSlideDialog(true);
  };

  const openSlideEdit = (slide) => {
    setEditingSlide(slide);
    setSlideForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      button_text: slide.button_text || '',
      button_url: slide.button_url || '/',
      sort_order: String(slide.sort_order ?? 0),
      is_active: slide.is_active !== false,
    });
    setDesktopFile(null);
    setMobileFile(null);
    setSlideDialog(true);
  };

  const saveSlide = slideSubmit.guardSubmit(async () => {
    if (!editingSlide && (!desktopFile || !mobileFile)) {
      toast.error('নতুন স্লাইডের জন্য ডেস্কটপ ও মোবাইল দুটো ছবি আবশ্যক');
      return;
    }

    const outcome = await slideSubmit.run(async () => {
      setUploadPct(null);
      const saveToastId = 'hero-slide-save';
      const uploadToastId = 'hero-upload';
      toast.loading('সেভ হচ্ছে…', { id: saveToastId });

      try {
        const payload = {
          title: slideForm.title.trim(),
          subtitle: slideForm.subtitle.trim(),
          button_text: slideForm.button_text.trim(),
          button_url: slideForm.button_url.trim() || '/',
          sort_order: Number(slideForm.sort_order) || 0,
          is_active: slideForm.is_active,
        };

        let record = editingSlide
          ? await adminHomepage.updateHeroSlide(editingSlide.id, payload)
          : await adminHomepage.createHeroSlide(payload, {
              idempotencyKey: slideIdempotencyRef.current,
            });

        if (desktopFile) {
          setUploadLabel('ডেস্কটপ');
          toast.loading('আপলোড হচ্ছে…', { id: uploadToastId });
          const res = await adminHomepage.uploadHeroImage(record.id, 'desktop', desktopFile, {
            onProgress: setUploadPct,
            idempotencyKey: slideIdempotencyRef.current
              ? `${slideIdempotencyRef.current}:desktop`
              : undefined,
          });
          record = res.record ?? record;
        }

        if (mobileFile) {
          setUploadLabel('মোবাইল');
          toast.loading('আপলোড হচ্ছে…', { id: uploadToastId });
          const res = await adminHomepage.uploadHeroImage(record.id, 'mobile', mobileFile, {
            onProgress: setUploadPct,
            idempotencyKey: slideIdempotencyRef.current
              ? `${slideIdempotencyRef.current}:mobile`
              : undefined,
          });
          record = res.record ?? record;
        }

        toast.success(editingSlide ? 'স্লাইড আপডেট হয়েছে' : 'স্লাইড যোগ হয়েছে');
        setSlideDialog(false);
        await load();
      } catch (err) {
        if (import.meta.env.DEV && err?.data) console.warn('[Homepage] slide save', err.data);
        toast.error(err?.message || 'স্লাইড সংরক্ষণ ব্যর্থ');
        throw err;
      } finally {
        toast.dismiss(saveToastId);
        toast.dismiss(uploadToastId);
        setUploadPct(null);
        setUploadLabel('');
      }
    });

    if (outcome?.skipped) return;
  });

  const deleteSlide = async (slide) => {
    if (!window.confirm('এই স্লাইড মুছবেন?')) return;
    try {
      await adminHomepage.deleteHeroSlide(slide.id);
      toast.success('স্লাইড মুছে ফেলা হয়েছে');
      load();
    } catch (err) {
      toast.error(err?.message || 'মুছতে ব্যর্থ');
    }
  };

  const openBannerCreate = () => {
    setEditingBanner(null);
    setBannerForm(emptyBannerForm);
    setBannerFile(null);
    setBannerDialog(true);
  };

  const openBannerEdit = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_url: banner.button_url || '/',
      placement: banner.placement || 'promo_row',
      sort_order: String(banner.sort_order ?? 0),
      is_active: banner.is_active !== false,
    });
    setBannerFile(null);
    setBannerDialog(true);
  };

  const saveBanner = bannerSubmit.guardSubmit(async () => {
    if (!editingBanner && !bannerFile) {
      toast.error('নতুন ব্যানারের জন্য ছবি আবশ্যক');
      return;
    }

    const outcome = await bannerSubmit.run(async () => {
      setUploadPct(null);
      const saveToastId = 'banner-save';
      const uploadToastId = 'banner-upload';
      toast.loading('সেভ হচ্ছে…', { id: saveToastId });

      try {
        const payload = {
          title: bannerForm.title.trim(),
          subtitle: bannerForm.subtitle.trim(),
          button_text: bannerForm.button_text.trim(),
          button_url: bannerForm.button_url.trim() || '/',
          placement: bannerForm.placement,
          sort_order: Number(bannerForm.sort_order) || 0,
          is_active: bannerForm.is_active,
        };

        let record = editingBanner
          ? await adminHomepage.updateBanner(editingBanner.id, payload)
          : await adminHomepage.createBanner(payload, {
              idempotencyKey: bannerIdempotencyRef.current,
            });

        if (bannerFile) {
          toast.loading('আপলোড হচ্ছে…', { id: uploadToastId });
          const res = await adminHomepage.uploadBannerImage(record.id, bannerFile, {
            onProgress: setUploadPct,
            idempotencyKey: bannerIdempotencyRef.current
              ? `${bannerIdempotencyRef.current}:image`
              : undefined,
          });
          record = res.record ?? record;
        }

        toast.success(editingBanner ? 'ব্যানার আপডেট হয়েছে' : 'ব্যানার যোগ হয়েছে');
        setBannerDialog(false);
        await load();
      } catch (err) {
        if (import.meta.env.DEV && err?.data) console.warn('[Homepage] banner save', err.data);
        toast.error(err?.message || 'ব্যানার সংরক্ষণ ব্যর্থ');
        throw err;
      } finally {
        toast.dismiss(saveToastId);
        toast.dismiss(uploadToastId);
        setUploadPct(null);
      }
    });

    if (outcome?.skipped) return;
  });

  const deleteBanner = async (banner) => {
    if (!window.confirm('এই ব্যানার মুছবেন?')) return;
    try {
      await adminHomepage.deleteBanner(banner.id);
      toast.success('ব্যানার মুছে ফেলা হয়েছে');
      load();
    } catch (err) {
      toast.error(err?.message || 'মুছতে ব্যর্থ');
    }
  };

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={t('admin.homepage.title', 'হোমপেজ ব্যবস্থাপনা')}
        subtitle={t('admin.homepage.subtitle', 'হিরো স্লাইডার, ব্যানার ও স্টোরফ্রন্ট সেকশন')}
      />

      {health ? (
        <div className={`${adminGlassCard} mb-6 p-4 text-sm text-slate-600 grid gap-2 sm:grid-cols-2`}>
          <p>
            <span className="font-medium text-slate-800">আপলোড রুট:</span>{' '}
            {health.uploads_root_writable ? '✅ লেখার যোগ্য' : '❌ সমস্যা'}
          </p>
          <p>
            <span className="font-medium text-slate-800">পণ্যে ছবি:</span> {health.products_with_image_path}
          </p>
          <p>
            <span className="font-medium text-slate-800">ক্যাটাগরিতে ছবি:</span>{' '}
            {health.categories_with_image_path}
          </p>
          <p className="truncate">
            <span className="font-medium text-slate-800">বেস URL:</span> {health.uploads_base_url}
          </p>
        </div>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 rounded-xl bg-white/80 p-1">
          <TabsTrigger value="hero" className="rounded-lg">
            <Layout className="h-4 w-4 mr-2" />
            হিরো স্লাইডার
          </TabsTrigger>
          <TabsTrigger value="banners" className="rounded-lg">
            <Image className="h-4 w-4 mr-2" />
            প্রোমো ব্যানার
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <div className="flex justify-end mb-4">
            <Button type="button" className={adminPrimaryBtn} onClick={openSlideCreate}>
              <Plus className="h-4 w-4 mr-2" />
              স্লাইড যোগ করুন
            </Button>
          </div>

          {loading ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <div className="grid gap-4">
              {slides.map((slide) => (
                <article key={slide.id} className={`${adminGlassCard} p-4 flex flex-col sm:flex-row gap-4`}>
                  <div className="flex gap-2 shrink-0">
                    <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-100 border">
                      {slide.image_desktop_url ? (
                        <img
                          src={normalizeMediaUrl(slide.image_desktop_url)}
                          alt=""
                          className="h-full w-full object-cover hidden sm:block"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-slate-400">
                          <Monitor className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 border sm:hidden">
                      {slide.image_mobile_url ? (
                        <img
                          src={normalizeMediaUrl(slide.image_mobile_url)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-slate-400">
                          <Smartphone className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{slide.title || '—'}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{slide.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      ক্রম: {slide.sort_order} · {slide.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button type="button" variant="outline" size="sm" onClick={() => openSlideEdit(slide)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => deleteSlide(slide)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
              {slides.length === 0 ? (
                <p className="text-center text-slate-500 py-8">কোনো স্লাইড নেই — প্রথম স্লাইড যোগ করুন।</p>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="banners">
          <div className="flex justify-end mb-4">
            <Button type="button" className={adminPrimaryBtn} onClick={openBannerCreate}>
              <Plus className="h-4 w-4 mr-2" />
              ব্যানার যোগ করুন
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {banners.map((banner) => (
                <article key={banner.id} className={`${adminGlassCard} overflow-hidden`}>
                  <div className="aspect-[2/1] bg-slate-100">
                    {banner.image_url ? (
                      <img
                        src={normalizeMediaUrl(banner.image_url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-4 flex justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{banner.title || '—'}</h3>
                      <p className="text-xs text-slate-500">{banner.placement}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => openBannerEdit(banner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => deleteBanner(banner)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={slideDialog} onOpenChange={(o) => !slideSubmit.isLocked && setSlideDialog(o)}>
        <DialogContent className={adminDialogContent}>
          <DialogHeader className={adminDialogHeader}>
            <DialogTitle>{editingSlide ? 'স্লাইড সম্পাদনা' : 'নতুন স্লাইড'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveSlide} className={adminDialogBody} {...slideSubmit.formHandlers}>
            <fieldset disabled={slideSubmit.isLocked} className="min-w-0 border-0 p-0 m-0">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className={adminSectionTitle}>
                    <Monitor className="inline h-4 w-4 mr-1" />
                    ডেস্কটপ ছবি
                  </p>
                  <ImageUploadZone
                    file={desktopFile}
                    onFileChange={setDesktopFile}
                    previewUrl={editingSlide?.image_desktop_url ? normalizeMediaUrl(editingSlide.image_desktop_url) : null}
                    required={!editingSlide}
                    disabled={slideSubmit.isLocked}
                    uploadPct={uploadLabel === 'ডেস্কটপ' ? uploadPct : null}
                  />
                </div>
                <div>
                  <p className={adminSectionTitle}>
                    <Smartphone className="inline h-4 w-4 mr-1" />
                    মোবাইল ছবি
                  </p>
                  <ImageUploadZone
                    file={mobileFile}
                    onFileChange={setMobileFile}
                    previewUrl={editingSlide?.image_mobile_url ? normalizeMediaUrl(editingSlide.image_mobile_url) : null}
                    required={!editingSlide}
                    disabled={slideSubmit.isLocked}
                    uploadPct={uploadLabel === 'মোবাইল' ? uploadPct : null}
                  />
                </div>
              </div>
              {['title', 'subtitle', 'button_text', 'button_url'].map((key) => (
                <div key={key} className="space-y-1">
                  <Label className={adminLabelClass}>{key}</Label>
                  <Input
                    className={adminInputClass}
                    value={slideForm[key]}
                    onChange={(e) => setSlideForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={adminLabelClass}>ক্রম</Label>
                  <Input
                    type="number"
                    className={adminInputClass}
                    value={slideForm.sort_order}
                    onChange={(e) => setSlideForm((f) => ({ ...f, sort_order: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-2 pt-6 text-sm">
                  <Checkbox
                    checked={slideForm.is_active}
                    onCheckedChange={(v) => setSlideForm((f) => ({ ...f, is_active: Boolean(v) }))}
                  />
                  সক্রিয়
                </label>
              </div>
            </div>
            <Button type="submit" className={`w-full mt-4 ${adminPrimaryBtn}`} disabled={slideSubmit.isLocked}>
              {slideSubmit.isLocked
                ? uploadPct != null
                  ? 'আপলোড হচ্ছে…'
                  : 'সেভ হচ্ছে…'
                : 'সংরক্ষণ'}
            </Button>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bannerDialog} onOpenChange={(o) => !bannerSubmit.isLocked && setBannerDialog(o)}>
        <DialogContent className={adminDialogContent}>
          <DialogHeader className={adminDialogHeader}>
            <DialogTitle>{editingBanner ? 'ব্যানার সম্পাদনা' : 'নতুন ব্যানার'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveBanner} className={adminDialogBody} {...bannerSubmit.formHandlers}>
            <fieldset disabled={bannerSubmit.isLocked} className="min-w-0 border-0 p-0 m-0">
            <div className="space-y-4">
              <ImageUploadZone
                file={bannerFile}
                onFileChange={setBannerFile}
                previewUrl={editingBanner?.image_url ? normalizeMediaUrl(editingBanner.image_url) : null}
                required={!editingBanner}
                disabled={bannerSubmit.isLocked}
                uploadPct={uploadPct}
              />
              {['title', 'subtitle', 'button_text', 'button_url'].map((key) => (
                <div key={key} className="space-y-1">
                  <Label className={adminLabelClass}>{key}</Label>
                  <Input
                    className={adminInputClass}
                    value={bannerForm[key]}
                    onChange={(e) => setBannerForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button type="submit" className={`w-full ${adminPrimaryBtn}`} disabled={bannerSubmit.isLocked}>
                {bannerSubmit.isLocked
                  ? uploadPct != null
                    ? 'আপলোড হচ্ছে…'
                    : 'সেভ হচ্ছে…'
                  : 'সংরক্ষণ'}
              </Button>
            </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomepageManagement;
