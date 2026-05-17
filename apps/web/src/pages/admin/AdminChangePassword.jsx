import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeAdminPassword, isUsersCollectionAuth } from '@/lib/adminAuth.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { toast } from 'sonner';

const AdminChangePassword = () => {
  const { t } = useTranslationWithFallback();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const canChange = isUsersCollectionAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error(t('admin.password.mismatch', 'পাসওয়ার্ড মিলছে না'));
      return;
    }
    setLoading(true);
    try {
      await changeAdminPassword(oldPassword, password, passwordConfirm);
      toast.success(t('admin.password.changeSuccess', 'পাসওয়ার্ড পরিবর্তন হয়েছে'));
      setOldPassword('');
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      toast.error(err?.message || t('admin.password.changeFailed', 'পাসওয়ার্ড পরিবর্তন ব্যর্থ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">{t('admin.password.changeTitle', 'পাসওয়ার্ড পরিবর্তন')}</h1>
      {!canChange ? (
        <p className="text-sm text-gray-600">
          {t(
            'admin.password.superuserHint',
            'সুপারইউজার অ্যাকাউন্টের পাসওয়ার্ড PocketBase অ্যাডমিন থেকে পরিবর্তন করুন।'
          )}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg border p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="old-password">{t('admin.password.oldPassword', 'বর্তমান পাসওয়ার্ড')}</Label>
            <Input
              id="old-password"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="change-password">{t('admin.password.newPassword', 'নতুন পাসওয়ার্ড')}</Label>
            <Input
              id="change-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="change-confirm">{t('admin.password.confirmPassword', 'পাসওয়ার্ড নিশ্চিত করুন')}</Label>
            <Input
              id="change-confirm"
              type="password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90" disabled={loading}>
            {loading ? t('common.saving', 'সংরক্ষণ') : t('admin.password.saveNew', 'পাসওয়ার্ড সংরক্ষণ')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminChangePassword;
