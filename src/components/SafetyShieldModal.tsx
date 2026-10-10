import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';

interface SafetyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SafetyShieldModal: React.FC<SafetyShieldModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = getTranslation(lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Tricolor Header Stripe */}
        <div className="h-2 w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                {t.safetyShield.title}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  {lang === 'hi' ? '100% सुरक्षित' : 'Zero Leak Guarantee'}
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'भारतीय नागरिक सुरक्षा एवं व्हिसलब्लोअर प्रोटोकॉल' : 'Indian Citizen Whistleblower Security Framework'}
              </p>
            </div>
          </div>

          <p className="text-sm text-stone-600 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            {t.safetyShield.desc}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-950">
                  {lang === 'hi' ? 'शून्य व्यक्तिगत जानकारी साझा' : 'Zero Identity Disclosure'}
                </h4>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  {t.safetyShield.point1}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-950">
                  {lang === 'hi' ? 'क्रिप्टोग्राफिक शिकायत टिकट' : 'Encrypted Access Token'}
                </h4>
                <p className="text-xs text-blue-900/80 mt-0.5">
                  {t.safetyShield.point2}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-950">
                  {lang === 'hi' ? 'सीधा सरकारी समय-सीमा (SLA) ट्रैकिंग' : 'Direct Municipal Accountability'}
                </h4>
                <p className="text-xs text-emerald-900/80 mt-0.5">
                  {t.safetyShield.point3}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-stone-100/80 p-3 rounded-xl text-xs text-stone-600 flex items-center justify-between border border-stone-200">
            <span className="flex items-center gap-1.5 font-medium text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {lang === 'hi' ? 'कोई कॉल नहीं, कोई पूछताछ नहीं' : 'No contractor harassment or interrogation'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              {t.safetyShield.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
