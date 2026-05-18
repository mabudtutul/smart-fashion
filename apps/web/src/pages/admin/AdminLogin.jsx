import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { adminLogin, isAdminAuthenticated, useAdminAuth } from '@/lib/adminAuth.js';
import { isLaravelAdminAuth } from '@/lib/backendConfig.js';
import { loadRememberedEmail, saveRememberedEmail } from '@/lib/adminLoginPrefs.js';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslationWithFallback();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const authed = useAdminAuth();

  useEffect(() => {
    const prefs = loadRememberedEmail();
    if (prefs.email) setEmail(prefs.email);
    setRemember(prefs.remember);
  }, []);

  useEffect(() => {
    if (authed || isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [authed, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      saveRememberedEmail(remember, email);

      if (!isAdminAuthenticated()) {
        throw new Error('Login succeeded but session was not saved.');
      }

      toast.success(t('admin.login.success', 'সাইন ইন সফল'));
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err?.message || t('admin.login.failed', 'সাইন ইন ব্যর্থ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8C00] to-amber-500 text-white shadow-lg shadow-orange-500/30 mb-4">
            <Store className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Fashion</h1>
          <p className="text-sm text-slate-500 mt-1">{t('admin.login.title', 'অ্যাডমিন সাইন ইন')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/90 bg-white/90 backdrop-blur-2xl shadow-[0_12px_48px_rgba(15,23,42,0.1)] p-6 sm:p-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-slate-700">
              {t('admin.login.email', 'ইমেইল')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                className="pl-10 h-11 rounded-xl"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-slate-700">
              {t('admin.login.password', 'পাসওয়ার্ড')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                className="pl-10 pr-10 h-11 rounded-xl"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
            <span className="text-sm text-slate-600">
              {t('admin.login.remember', 'আমাকে মনে রাখুন')}
            </span>
          </label>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#FF8C00] hover:bg-[#e67e00] font-semibold shadow-lg shadow-orange-500/25"
            disabled={loading}
          >
            {loading ? t('admin.login.signingIn', 'সাইন ইন হচ্ছে…') : t('admin.login.submit', 'সাইন ইন')}
          </Button>

          {isLaravelAdminAuth() ? (
            <p className="text-center text-xs text-slate-400 leading-relaxed">
              {t(
                'admin.login.persistHint',
                'এই ডিভাইসে সাইন ইন থাকবে যতক্ষণ না আপনি লগ আউট করেন।'
              )}
            </p>
          ) : (
            <p className="text-center text-sm">
              <Link to="/admin/forgot-password" className="text-[#FF8C00] hover:underline font-medium">
                {t('admin.password.forgotLink', 'পাসওয়ার্ড ভুলে গেছেন?')}
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
