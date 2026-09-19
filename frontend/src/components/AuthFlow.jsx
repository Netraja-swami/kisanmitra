import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, User, Eye, EyeOff, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const MOCK_USER = {
  name: "Ramesh Kumar",
  email: "ramesh@gmail.com",
  photo: null,
  uid: "demo-001"
};

export default function AuthFlow({
  onSignIn,
  onSignUp,
  onDemoLogin,
  onLogin,
  authError,
  alreadyRegistered = false,
  onClearAlreadyRegistered,
  onClearError,
  lockoutStatus,
  isLoading,
  language = 'hinglish'
}) {
  const { t, isEnglish } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [showAlreadyRegisteredModal, setShowAlreadyRegisteredModal] = useState(false);

  // Sign In fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up fields
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Demo Login behavior (only triggered by explicit demo button)
  const handleDemoClick = () => {
    try {
      localStorage.setItem('kisanmitra_user', JSON.stringify(MOCK_USER));
      if (!localStorage.getItem('kisanmitra_questions_count')) {
        localStorage.setItem('kisanmitra_questions_count', '0');
      }
    } catch (e) {
      console.warn('Failed to save mock user in localStorage', e);
    }
    if (onDemoLogin) {
      onDemoLogin(MOCK_USER);
    } else if (onLogin) {
      onLogin(MOCK_USER);
    }
  };

  // Real Mobile + Password login
  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!loginIdentifier.trim() || !loginPassword) {
      return;
    }

    if (onSignIn) {
      await onSignIn(
        loginIdentifier.trim(),
        loginPassword
      );
    }
  };

  // Real Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      return;
    }

    if (onSignUp) {
      const result = await onSignUp(
        regName.trim(),
        regMobile.trim(),
        regPassword,
        regConfirmPassword
      );
      if (result && result.alreadyRegistered) {
        setShowAlreadyRegisteredModal(true);
      }
    }
  };

  const handleSwitchToLoginFromModal = () => {
    setShowAlreadyRegisteredModal(false);
    if (onClearAlreadyRegistered) {
      onClearAlreadyRegistered();
    }
    if (onClearError) {
      onClearError();
    }
    if (regMobile.trim()) {
      setLoginIdentifier(regMobile.trim());
    }
    setActiveTab('signin');
  };

  const handleCloseModal = () => {
    setShowAlreadyRegisteredModal(false);
    if (onClearAlreadyRegistered) {
      onClearAlreadyRegistered();
    }
  };

  return (
    <div className="min-h-screen bg-[#166534] flex flex-col justify-between p-4 sm:p-6 text-slate-900 font-sans select-none">
      {/* Brand Header */}
      <div className="w-full max-w-md mx-auto pt-3 pb-2 text-center text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 shadow-xl mb-2 text-3xl font-bold">
          🌱
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
          {t('appName')} <span className="text-amber-400 font-bold block sm:inline text-xl sm:text-2xl">({t('appSubname')})</span>
        </h1>
        <p className="text-xs text-emerald-200 mt-1 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{isEnglish ? 'Secure Farmer Portal • 256-Bit Encrypted' : 'सुरक्षित किसान पोर्टल • 256-Bit Encrypted'}</span>
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex-1 flex flex-col justify-between my-2">
        {/* Top Tab Bar (Sign In vs Sign Up) */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              if (onClearError) onClearError();
              if (onClearAlreadyRegistered) onClearAlreadyRegistered();
            }}
            className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signin'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t('signIn')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              if (onClearError) onClearError();
              if (onClearAlreadyRegistered) onClearAlreadyRegistered();
            }}
            className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('signUp')}</span>
          </button>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutStatus?.locked && (
          <div className="m-4 mb-0 bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 text-xs text-rose-900 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">{t('lockoutTitle')}</strong>
              <span>
                {t('lockoutMsg')} <strong>{lockoutStatus.remainingSeconds} {t('lockoutSeconds')}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Auth Error Banner */}
        {authError && !lockoutStatus?.locked && !showAlreadyRegisteredModal && !alreadyRegistered && (
          <div className="m-4 mb-0 bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{authError}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="p-5 flex-1 flex flex-col justify-between text-left">
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('mobileNumber')}:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={t('mobilePlaceholder')}
                    maxLength={10}
                    disabled={isLoading}
                    className="w-full h-12 pl-10 pr-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('password')}:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    disabled={isLoading}
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-xl p-2.5 text-[11px] text-emerald-900 border border-emerald-200/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('pwdEncryptedNotice')}</span>
              </div>
            </div>

            {/* Action Buttons: 1. Sign In button, 2. 1-Click Demo Kisan Login */}
            <div className="mt-5 space-y-2.5">
              {/* 1. "लॉग इन करें (Sign In) →" button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 font-bold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? t('checkingAuth') : t('signInBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 2. "1-Click Demo Kisan Login" button */}
              <button
                type="button"
                onClick={handleDemoClick}
                disabled={isLoading}
                className="w-full min-h-[46px] rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('demoLoginBtn')}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="p-5 flex-1 flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('fullName')}:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('mobileNumber')}:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder={t('mobilePlaceholder')}
                    maxLength={10}
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('password')}:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={isEnglish ? 'Enter password' : 'पासवर्ड दर्ज करें'}
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('confirmPassword')}:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder={t('confirmPasswordPlaceholder')}
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Submit Sign Up Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 font-bold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? t('creatingAccount') : t('signUpBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Security Guarantee */}
      <div className="w-full max-w-md mx-auto text-center text-emerald-200 text-[11px] py-1">
        {t('securityPledge')}
      </div>

      {/* Already Registered Popup Modal */}
      {(showAlreadyRegisteredModal || alreadyRegistered) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-emerald-100 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                User already registered. Please login to continue.
              </h3>
              {regMobile && (
                <p className="text-xs text-slate-500">
                  Mobile: <span className="font-semibold text-slate-700">{regMobile}</span>
                </p>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSwitchToLoginFromModal}
                className="w-full min-h-[46px] rounded-xl bg-emerald-800 hover:bg-emerald-900 font-bold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full min-h-[38px] rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
