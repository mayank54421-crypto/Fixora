import React from 'react';
import { User, Language } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  PlusCircle, 
  Languages, 
  UserCircle2, 
  LogOut, 
  Briefcase,
  Layers,
  Flame
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'map' | 'leadership' | 'reports' | 'officerDesk';
  onTabChange: (tab: 'map' | 'leadership' | 'reports' | 'officerDesk') => void;
  lang: Language;
  onLanguageToggle: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenReportModal: () => void;
  onOpenSafetyModal: () => void;
  totalDamageCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLanguageToggle,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenReportModal,
  onOpenSafetyModal,
  totalDamageCount,
}) => {
  const t = getTranslation(lang);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Indian Tricolor Decorative Top Bar */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onTabChange('map')} 
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              {/* Civic Crest / Ashoka emblem inspired badge */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                    {lang === 'hi' ? 'Fixora (फिक्सोरा)' : 'Fixora'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    {lang === 'hi' ? 'फिक्सोरा जन सेवा' : 'Fixora Civic'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block truncate max-w-xs font-medium">
                  {lang === 'hi' 
                    ? 'सार्वजनिक संपत्ति क्षति एवं जवाबदेही' 
                    : 'Public Damage & Leader Accountability'}
                </p>
              </div>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'map'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {t.nav.map}
            </button>

            <button
              onClick={() => onTabChange('leadership')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'leadership'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-purple-600" />
              {t.nav.leadership}
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'reports'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              {t.nav.reports}
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-bold">
                {totalDamageCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('officerDesk')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'officerDesk'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              {t.nav.municipalityDesk}
              {currentUser?.email?.toLowerCase() === 'sonikumaranubhav@gmail.com' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ) : (
                <span className="text-[10px] text-stone-400">🔒</span>
              )}
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Identity Shield Info Pill */}
            <button
              onClick={onOpenSafetyModal}
              title="View Whistleblower Identity Protection"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">{lang === 'hi' ? 'पहचान गुप्त' : 'Identity Shielded'}</span>
            </button>

            {/* Language Switcher Button (English / हिन्दी) */}
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-stone-300 hover:border-amber-400 bg-stone-50 hover:bg-amber-50/50 text-stone-700 transition-all shadow-2xs"
              title="Toggle Hindi / English"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span className="uppercase text-[11px] font-extrabold tracking-wider">
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </span>
            </button>

            {/* Big Action: Report Damage Anonymously */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">{t.nav.reportDamage}</span>
              <span className="xs:hidden">{lang === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1">
                <div 
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                    currentUser.role === 'officer'
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : currentUser.role === 'leader'
                      ? 'bg-purple-50 border-purple-200 text-purple-900'
                      : 'bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span className="hidden lg:inline font-semibold max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title={t.nav.logout}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors"
              >
                <UserCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-stone-200 no-scrollbar">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'map' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            <MapPin className="w-3 h-3" />
            {t.nav.map}
          </button>
          <button
            onClick={() => onTabChange('leadership')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'leadership' ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            <Award className="w-3 h-3" />
            {t.nav.leadership}
          </button>
          <button
            onClick={() => onTabChange('reports')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            <Layers className="w-3 h-3" />
            {t.nav.reports} ({totalDamageCount})
          </button>
          <button
            onClick={() => onTabChange('officerDesk')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'officerDesk' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            {t.nav.municipalityDesk}
          </button>
        </div>
      </div>
    </header>
  );
};
