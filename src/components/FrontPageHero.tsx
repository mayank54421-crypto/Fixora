import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  ShieldCheck, 
  PlusCircle, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface FrontPageHeroProps {
  lang: Language;
  onOpenReportModal: () => void;
  onNavigateToMap: () => void;
  onNavigateToLeadership: () => void;
  onOpenSafetyModal: () => void;
  resolvedCount: number;
  totalCount: number;
}

export const FrontPageHero: React.FC<FrontPageHeroProps> = ({
  lang,
  onOpenReportModal,
  onNavigateToMap,
  onNavigateToLeadership,
  onOpenSafetyModal,
  resolvedCount,
  totalCount,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-white border-b border-stone-200 py-10 sm:py-14">
      {/* Subtle Indian motif background embellishment */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#138808_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 shadow-2xs mb-4 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{t.hero.badge}</span>
            <span className="text-amber-400">•</span>
            <button
              onClick={onOpenSafetyModal}
              className="text-emerald-700 underline hover:text-emerald-800 flex items-center gap-1 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 inline" />
              {lang === 'hi' ? '100% गुप्त पहचान' : 'Zero Leak Shield'}
            </button>
          </div>

          {/* Bold Bilingual Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {t.hero.headlineStart}{' '}
            <span className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-700 bg-clip-text text-transparent">
              {t.hero.headlineHighlight}
            </span>{' '}
            <span className="text-stone-800 block sm:inline mt-1 sm:mt-0">
              {t.hero.headlineEnd}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Call-to-actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenReportModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              {t.hero.btnReport}
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onNavigateToMap}
              className="px-5 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-300 hover:border-amber-400 shadow-xs transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              {t.hero.btnExploreMap}
            </button>

            <button
              onClick={onNavigateToLeadership}
              className="px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-sm border border-purple-200 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-purple-600" />
              {t.hero.btnCheckLeaders}
            </button>
          </div>
        </div>

        {/* Live Metrics Ticker with Indian Civic accents */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {/* Metric 1 */}
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-stone-200/90 shadow-2xs text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {resolvedCount + 1420}+
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {t.hero.statResolved}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-stone-200/90 shadow-2xs text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
              36 hrs
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {t.hero.statAvgTime}
            </div>
          </div>

          {/* Metric 3 */}
          <div 
            onClick={onOpenSafetyModal} 
            className="cursor-pointer bg-white/90 hover:bg-emerald-50/50 backdrop-blur-xs p-4 rounded-xl border border-emerald-200 shadow-2xs text-center flex flex-col items-center transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-800">
              100%
            </div>
            <div className="text-xs text-emerald-900 font-semibold underline decoration-emerald-400">
              {t.hero.statAnonymous}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-stone-200/90 shadow-2xs text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
              28 Wards
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {t.hero.statWards}
            </div>
          </div>
        </div>

        {/* Accountability reminder banner */}
        <div className="mt-6 max-w-2xl mx-auto bg-stone-100/90 border border-stone-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'hi' 
                ? 'प्रत्येक शिकायत आपके स्थानीय पार्षद और विधायक के रिकॉर्ड में जुड़ती है।' 
                : 'Every complaint is permanently logged to your Ward Corporator & MLA scorecard.'}
            </span>
          </div>
          <button
            onClick={onNavigateToLeadership}
            className="font-bold text-amber-800 hover:text-amber-900 underline shrink-0 ml-2"
          >
            {lang === 'hi' ? 'स्कोरकार्ड देखें' : 'View Scores'}
          </button>
        </div>
      </div>
    </div>
  );
};
