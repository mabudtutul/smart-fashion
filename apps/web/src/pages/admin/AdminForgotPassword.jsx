import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordReset } from '@/lib/adminAuth.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { toast } from 'sonner';

const AdminForgotPassword = () => {
  const { t } = useTranslationWithFallback();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success(t('admin.password.resetEmailSent', 'রিসেট লিংক পাঠানো হয়েছে'));
    } catch (err) {
      toast.error(err?.message || t('admin.password.resetEmailFailed', 'রিসেট অনুরোধ ব্যর্থ'));
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
          {t('admin.password.forgotTitle', 'পাসওয়ার্ড ভুলে গেছেন?')}
        </h1>
        {sent ? (
          <p className="text-sm text-center text-gray-600">
            {t(
              'admin.password.resetEmailHint',
              'ইমেইলে রিসেট লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন।'
            )}
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="reset-email">{t('admin.login.email', 'ইমেইল')}</Label>
              <Input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90"
              disabled={loading}
            >
              {loading
                ? t('admin.password.sending', 'পাঠানো হচ্ছে…')
                : t('admin.password.sendReset', 'রিসেট লিংক পাঠান')}
            </Button>
          </>
        )}
        <p className="text-center text-sm">
          <Link to="/admin/login" className="text-[#FF8C00] hover:underline">
            {t('admin.password.backToLogin', 'সাইন ইন-এ ফিরে যান')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminForgotPassword;
