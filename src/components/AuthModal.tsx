import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, Tractor, User, Phone, Mail, KeyRound } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { lang, t } = useLanguage();
  const {
    loginDemo,
    loginEmail,
    registerEmail,
    requestDemoOtp,
    verifyDemoOtp,
    resetDemoPassword,
  } = useAuth();

  const [tab, setTab] = useState<'demo' | 'email' | 'phone' | 'forgot'>('demo');
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roles, setRoles] = useState<UserRole[]>(['farmer']);

  // Phone OTP preview state
  const [otpSentCode, setOtpSentCode] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPw, setResetNewPw] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const toggleRole = (role: UserRole) => {
    setRoles((prev) => {
      if (prev.includes(role)) {
        const next = prev.filter((r) => r !== role);
        return next.length > 0 ? next : prev;
      }
      return [...prev, role];
    });
  };

  const handleDemoLogin = async (id: 'demo-farmer-1' | 'demo-owner-1') => {
    setBusy(true);
    setError('');
    try {
      await loginDemo(id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isSignUp) {
        await registerEmail({
          name,
          email,
          password,
          phone,
          roles,
          preferredLang: lang,
        });
      } else {
        await loginEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await requestDemoOtp(phone);
      setOtpSentCode(res.previewOtpCode);
    } catch (err: any) {
      setError(err.message || 'Failed to generate demo OTP.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await verifyDemoOtp(phone, otpInput, name);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResetMsg('');
    try {
      await resetDemoPassword(resetEmail, resetNewPw);
      setResetMsg('Password updated! You can now sign in with your new password.');
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8DF] rounded-2xl max-w-md w-full p-6 shadow-xl my-8 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#14532D]">
            <Tractor className="w-5 h-5" />
            <h2 className="text-lg font-bold">{t.auth.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#5A655C] hover:bg-[#EFF4EC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clearly Labeled Demo Auth Banner */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{t.auth.demoBanner}</span>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFF4EC] rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('demo');
              setError('');
            }}
            className={`min-h-[38px] rounded-lg px-2 cursor-pointer ${
              tab === 'demo' ? 'bg-white text-[#14532D] shadow-xs' : 'text-[#4B554D]'
            }`}
          >
            {t.auth.tabDemo}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('email');
              setError('');
            }}
            className={`min-h-[38px] rounded-lg px-2 cursor-pointer ${
              tab === 'email' ? 'bg-white text-[#14532D] shadow-xs' : 'text-[#4B554D]'
            }`}
          >
            {t.auth.tabEmail}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('phone');
              setError('');
            }}
            className={`min-h-[38px] rounded-lg px-2 cursor-pointer ${
              tab === 'phone' ? 'bg-white text-[#14532D] shadow-xs' : 'text-[#4B554D]'
            }`}
          >
            {t.auth.tabPhone}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'demo' && (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleDemoLogin('demo-farmer-1')}
              className="w-full min-h-[50px] px-4 py-3 rounded-xl border border-[#D4DDD0] bg-[#F8FAF5] hover:border-[#14532D] text-left flex items-center gap-3 cursor-pointer"
            >
              <User className="w-5 h-5 text-[#14532D] shrink-0" />
              <span className="text-sm font-semibold text-[#1C241E]">{t.auth.quickFarmer}</span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => handleDemoLogin('demo-owner-1')}
              className="w-full min-h-[50px] px-4 py-3 rounded-xl border border-[#D4DDD0] bg-[#F8FAF5] hover:border-[#14532D] text-left flex items-center gap-3 cursor-pointer"
            >
              <Tractor className="w-5 h-5 text-[#14532D] shrink-0" />
              <span className="text-sm font-semibold text-[#1C241E]">{t.auth.quickOwner}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('email');
                setIsSignUp(true);
                setRoles(['farmer', 'owner']);
              }}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer"
            >
              {t.auth.quickBoth}
            </button>
          </div>
        )}

        {tab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#374139] mb-1">
                  {t.auth.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.auth.emailLabel}
              </label>
              <div className="flex items-center gap-2 px-3 min-h-[42px] rounded-lg border border-[#D4DDD0] bg-[#F8FAF5]">
                <Mail className="w-4 h-4 text-[#5A655C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.auth.passwordLabel}
              </label>
              <div className="flex items-center gap-2 px-3 min-h-[42px] rounded-lg border border-[#D4DDD0] bg-[#F8FAF5]">
                <KeyRound className="w-4 h-4 text-[#5A655C]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.auth.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roles.includes('farmer')}
                      onChange={() => toggleRole('farmer')}
                      className="accent-[#14532D]"
                    />
                    <span>{t.auth.roleFarmer}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roles.includes('owner')}
                      onChange={() => toggleRole('owner')}
                      className="accent-[#14532D]"
                    />
                    <span>{t.auth.roleOwner}</span>
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534] cursor-pointer"
            >
              {busy ? t.common.loading : isSignUp ? t.auth.signUpBtn : t.auth.signInBtn}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp((s) => !s)}
                className="text-[#14532D] font-semibold hover:underline cursor-pointer"
              >
                {isSignUp ? t.auth.haveAccountToggle : t.auth.createAccountToggle}
              </button>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[#5A655C] hover:underline cursor-pointer"
                >
                  {t.auth.forgotPasswordBtn}
                </button>
              )}
            </div>
          </form>
        )}

        {tab === 'phone' && (
          <div className="space-y-3">
            {!otpSentCode ? (
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.auth.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. संदीप जाधव"
                    className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.auth.phoneLabel}
                  </label>
                  <div className="flex items-center gap-2 px-3 min-h-[42px] rounded-lg border border-[#D4DDD0] bg-[#F8FAF5]">
                    <Phone className="w-4 h-4 text-[#5A655C]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+9198XXXXXXXX"
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white text-sm font-bold cursor-pointer"
                >
                  {t.auth.sendOtp}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 rounded-xl bg-[#EFF4EC] border border-[#C7D3C2] text-xs text-[#14532D]">
                  {t.auth.demoOtpHint}{' '}
                  <span className="font-mono font-bold text-sm">{otpSentCode}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.auth.otpLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm font-mono tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white text-sm font-bold cursor-pointer"
                >
                  {t.auth.verifyOtp}
                </button>
              </form>
            )}
          </div>
        )}

        {tab === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-3">
            {resetMsg && (
              <div className="p-3 rounded-xl bg-[#22C55E]/15 text-xs text-[#14532D] font-semibold">
                {resetMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.auth.emailLabel}
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                New {t.auth.passwordLabel}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={resetNewPw}
                onChange={(e) => setResetNewPw(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white text-sm font-bold cursor-pointer"
            >
              {t.auth.resetPasswordBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
