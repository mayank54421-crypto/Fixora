import React, { useState } from 'react';
import { User, Language } from '../types';
import { getTranslation } from '../locales/translations';
import { ShieldCheck, UserCheck, Building2, Award, KeyRound, ArrowRight, X, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'officer' | 'leader'>('citizen');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;
  const t = getTranslation(lang);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: fullName.trim() || (activeTab === 'citizen' ? (lang === 'hi' ? 'नागरिक' : 'Citizen User') : 'Officer'),
      role: activeTab,
      phone: phoneNumber,
      isAnonymous: false,
      ward: activeTab === 'leader' ? 'Ward 42 - Lajpat Nagar' : undefined,
      department: activeTab === 'officer' ? 'Public Works Department (PWD)' : undefined,
      title: activeTab === 'officer' ? 'Assistant Engineer' : activeTab === 'leader' ? 'Ward Councillor' : undefined,
    };
    onLogin(newUser);
    onClose();
  };

  const handleAnonymousBypass = () => {
    onLogin({
      id: `anon-${Date.now()}`,
      name: lang === 'hi' ? 'अनाम नागरिक (पहचान सुरक्षित)' : 'Anonymous Citizen (Identity Shielded)',
      role: 'citizen',
      isAnonymous: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Tricolor Header */}
        <div className="h-2 w-full flex shrink-0">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="p-6 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              {lang === 'hi' ? 'सुरक्षित नागरिक पोर्टल' : 'Secure Civic Access Portal'}
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              {t.login.title}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {t.login.subtitle}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl mb-4 border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('citizen')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'citizen'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.login.tabCitizen}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('officer')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'officer'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.login.tabOfficer}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('leader')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'leader'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.login.tabLeader}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t.login.nameLabel}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={activeTab === 'citizen' ? 'Optional (leave blank for anonymity)' : 'Official Name'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t.login.phoneLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-colors"
                >
                  {otpSent ? 'Resend' : t.login.getOtp}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {t.login.otpLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit code (e.g. 1234)"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[11px] text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded border border-emerald-200">
                    Auto-Fill: 1234
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <KeyRound className="w-4 h-4" />
              {t.login.loginBtn}
            </button>
          </form>

          {/* Anonymous bypass button */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-500 font-medium">
                {lang === 'hi' ? 'अथवा' : 'OR'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnonymousBypass}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 border border-stone-700"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {t.login.anonymousBtn}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
