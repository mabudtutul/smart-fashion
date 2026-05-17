import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminLogin, useAdminAuth } from '@/lib/adminAuth.js';
import pb, {
  canRedirectToAdminProducts,
  initializePocketBaseAuth,
  PB_AUTH_STORAGE_KEY,
} from '@/lib/pocketbaseClient.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { toast } from 'sonner';

console.log('PB INSTANCE AdminLogin.jsx', pb);
if (typeof window !== 'undefined') {
  console.log(
    '[SmartFashion auth] singleton AdminLogin',
    pb === window.__SMARTFASHION_PB__
  );
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslationWithFallback();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const authed = useAdminAuth();

  useEffect(() => {
    initializePocketBaseAuth();
    if (canRedirectToAdminProducts()) {
      navigate('/admin/products', { replace: true });
    }
  }, [authed, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);

      const stored = window.localStorage.getItem(PB_AUTH_STORAGE_KEY);
      const valid = canRedirectToAdminProducts();

      console.log('[SmartFashion auth] pre-redirect stored', stored, 'canRedirect', valid);

      if (!stored || !valid) {
        throw new Error('Login succeeded but auth was not persisted.');
      }

      toast.success(t('admin.login.success', 'সাইন ইন সফল'));
      navigate('/admin/products', { replace: true });
    } catch (err) {
      toast.error(err?.message || t('admin.login.failed', 'সাইন ইন ব্যর্থ'));
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
        <h1 className="text-xl font-bold text-center">{t('admin.login.title', 'অ্যাডমিন সাইন ইন')}</h1>
        <div className="space-y-2">
          <Label htmlFor="admin-email">{t('admin.login.email', 'ইমেইল')}</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">{t('admin.login.password', 'পাসওয়ার্ড')}</Label>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              className="pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90"
          disabled={loading}
        >
          {loading ? t('admin.login.signingIn', 'সাইন ইন হচ্ছে…') : t('admin.login.submit', 'সাইন ইন')}
        </Button>
        <p className="text-center text-sm">
          <Link to="/admin/forgot-password" className="text-[#FF8C00] hover:underline">
            {t('admin.password.forgotLink', 'পাসওয়ার্ড ভুলে গেছেন?')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
