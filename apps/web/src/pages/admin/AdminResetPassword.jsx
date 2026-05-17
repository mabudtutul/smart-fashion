import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmPasswordReset } from '@/lib/adminAuth.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { toast } from 'sonner';

const AdminResetPassword = () => {
  const { t } = useTranslationWithFallback();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error(t('admin.password.invalidToken', 'রিসেট টোকেন অবৈধ বা অনুপস্থিত'));
      return;
    }
    if (password !== passwordConfirm) {
      toast.error(t('admin.password.mismatch', 'পাসওয়ার্ড মিলছে না'));
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, password, passwordConfirm);
      toast.success(t('admin.password.resetSuccess', 'পাসওয়ার্ড আপডেট হয়েছে'));
      navigate('/admin/login', { replace: true });
    } catch (err) {
      toast.error(err?.message || t('admin.password.resetFailed', 'পাসওয়ার্ড রিসেট ব্যর্থ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          {t('admin.password.resetTitle', 'নতুন পাসওয়ার্ড')}
        </h1>
        {!token && (
          <p className="text-sm text-center text-red-600">
            {t('admin.password.invalidToken', 'রিসেট টোকেন অবৈধ বা অনুপস্থিত')}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="new-password">{t('admin.password.newPassword', 'নতুন পাসওয়ার্ড')}</Label>
          <Input
            id="new-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t('admin.password.confirmPassword', 'পাসওয়ার্ড নিশ্চিত করুন')}</Label>
          <Input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90"
          disabled={loading || !token}
        >
          {loading ? t('common.saving', 'সংরক্ষণ') : t('admin.password.saveNew', 'পাসওয়ার্ড সংরক্ষণ')}
        </Button>
        <p className="text-center text-sm">
          <Link to="/admin/login" className="text-[#FF8C00] hover:underline">
            {t('admin.password.backToLogin', 'সাইন ইন-এ ফিরে যান')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminResetPassword;
