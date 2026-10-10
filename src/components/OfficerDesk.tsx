import React, { useState } from 'react';
import { DamageReport, Language, Leader, StatusType, User } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Building2, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Sparkles,
  ChevronRight,
  Filter,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

interface OfficerDeskProps {
  reports: DamageReport[];
  leaders: Leader[];
  currentUser: User | null;
  lang: Language;
  onOpenReportDetails: (report: DamageReport) => void;
  onUpdateStatus: (
    reportId: string, 
    newStatus: StatusType, 
    remarks: string, 
    resolvedPhotoUrl?: string, 
    contractor?: string
  ) => void;
  onOpenLogin: () => void;
  onAuthorizeOfficer?: (user: User) => void;
}

export const OfficerDesk: React.FC<OfficerDeskProps> = ({
  reports,
  leaders,
  currentUser,
  lang,
  onOpenReportDetails,
  onUpdateStatus,
  onOpenLogin,
  onAuthorizeOfficer,
}) => {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('pending');

  // Dedicated gate state for sonikumaranubhav@gmail.com
  const [gateEmail, setGateEmail] = useState('sonikumaranubhav@gmail.com');
  const [gatePassword, setGatePassword] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // Strictly check if current user is the authorized officer
  const isAuthorizedOfficer = currentUser?.email?.trim().toLowerCase() === 'sonikumaranubhav@gmail.com';

  const handleGateVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    const emailInput = gateEmail.trim().toLowerCase();

    if (emailInput !== 'sonikumaranubhav@gmail.com') {
      setGateError(
        lang === 'hi' 
          ? 'यह पोर्टल केवल sonikumaranubhav@gmail.com के लिए सुरक्षित है।' 
          : 'Access denied: Only sonikumaranubhav@gmail.com is authorized.'
      );
      return;
    }

    if (gatePassword !== '654321') {
      setGateError(
        lang === 'hi'
          ? 'गलत पासवर्ड। केवल अधिकृत अभियंता ही प्रवेश कर सकते हैं।'
          : 'Access denied: Incorrect password for officer portal.'
      );
      return;
    }

    const verifiedOfficer: User = {
      id: 'officer-sonikumar',
      name: 'Anubhav Soni (Executive Engineer)',
      email: 'sonikumaranubhav@gmail.com',
      role: 'officer',
      department: 'Public Works Department (PWD & Nagar Nigam)',
      title: 'Executive Engineer (Civil & Urban Infrastructure)',
      isAnonymous: false,
    };

    if (onAuthorizeOfficer) {
      onAuthorizeOfficer(verifiedOfficer);
    }
  };

  // If not authorized as sonikumaranubhav@gmail.com, show restricted security gate
  if (!isAuthorizedOfficer) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Tricolor top header */}
          <div className="h-2 w-full flex shrink-0">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-white" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          <div className="p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 ring-8 ring-rose-50 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              {lang === 'hi' ? 'प्रतिबंधित सुरक्षा क्षेत्र' : 'Restricted Security Gate'}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
              {lang === 'hi' ? 'नगर निगम अधिकारी डेस्क (Officer Desk)' : 'Municipal Officer Portal Access'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mb-6">
              {lang === 'hi'
                ? 'यह पोर्टल केवल अधिकृत अधिशासी अभियंता (sonikumaranubhav@gmail.com) के लिए सुरक्षित है। कृपया जारी रखने के लिए अपनी साख सत्यापित करें।'
                : 'This portal is strictly restricted to the authorized municipal engineer. Please enter your officer credentials to continue.'}
            </p>

            {gateError && (
              <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{gateError}</span>
              </div>
            )}

            <form onSubmit={handleGateVerify} className="w-full text-left space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'अधिकृत अधिकारी ईमेल' : 'Authorized Officer Email'}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {lang === 'hi' ? 'स्वचालित भरा हुआ' : 'Auto-filled'}
                  </span>
                </label>
                <input
                  type="email"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-stone-100/90 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'hi' ? 'सुरक्षा पासवर्ड' : 'Officer Password'}
                </label>
                <div className="relative">
                  <input
                    type={showGatePassword ? 'text' : 'password'}
                    required
                    value={gatePassword}
                    onChange={(e) => setGatePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGatePassword(!showGatePassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    title={showGatePassword ? 'Hide password' : 'Show password'}
                  >
                    {showGatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-700 via-blue-800 to-stone-900 hover:from-blue-800 hover:to-stone-950 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <KeyRound className="w-4 h-4" />
                {lang === 'hi' ? 'अधिकारी पोर्टल में प्रवेश करें' : 'Unlock Officer Desk Portal'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between w-full">
              <span>{lang === 'hi' ? 'नागरिक पोर्टल पर लौटें' : 'Return to citizen portal'}</span>
              <button
                type="button"
                onClick={onOpenLogin}
                className="font-bold text-blue-700 hover:underline"
              >
                {lang === 'hi' ? 'खाता बदलें' : 'Switch Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authorized View for sonikumaranubhav@gmail.com
  const pendingCount = reports.filter((r) => r.status === 'reported' || r.status === 'inspected').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const currentReports = reports.filter((r) => {
    if (activeTab === 'pending') return r.status === 'reported' || r.status === 'inspected';
    if (activeTab === 'in_progress') return r.status === 'in_progress';
    if (activeTab === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-stone-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            {lang === 'hi' ? 'नगर निगम एवं लोक निर्माण प्रभाग' : 'Municipal Public Works Control Room'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {lang === 'hi' ? 'अधिशासी अभियंता कार्यक्षेत्र (SLA Desk)' : 'Municipal Engineering & Triage Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            {lang === 'hi'
              ? 'नागरिकों द्वारा दर्ज की गई सार्वजनिक क्षतियों का सत्यापन करें, ठेकेदार नियुक्त करें और समाधान फोटो अपलोड करें।'
              : 'Inspect anonymous citizen reports, issue expedited contractor work orders, and verify repair restorations with photos.'}
          </p>
        </div>

        {/* Verified Role status pill */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
          <div className="font-semibold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? 'अधिकृत अभियंता सत्र:' : 'Verified Officer Session:'}</span>
          </div>
          <div className="font-bold text-white text-sm">
            {currentUser?.name || 'Anubhav Soni (Executive Engineer)'}
          </div>
          <div className="text-[11px] text-stone-300 font-mono mt-0.5">
            sonikumaranubhav@gmail.com
          </div>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-500 uppercase">
              {lang === 'hi' ? 'निरीक्षण प्रतीक्षारत' : 'Pending Verification'}
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Requires Junior Engineer visit</div>
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'in_progress'
              ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300'
              : 'bg-white border-stone-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-500 uppercase">
              {lang === 'hi' ? 'मरम्मत जारी' : 'Active Repairs'}
            </span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">{inProgressCount}</div>
          <div className="text-[11px] text-purple-700 font-medium">Contractor squads deployed</div>
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'resolved'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-500 uppercase">
              {lang === 'hi' ? 'पूर्ण एवं सत्यापित' : 'Repaired & Verified'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Public property restored</div>
        </button>
      </div>

      {/* Table of Incidents */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <h3 className="font-bold text-stone-900 text-sm">
            {lang === 'hi' ? 'सक्रिय शिकायत कार्यसूची' : 'Live Municipal Work Orders'} ({currentReports.length})
          </h3>
          <span className="text-xs text-stone-500">
            {lang === 'hi' ? 'क्लिक करके स्थिति बदलें या समाधान फोटो डालें' : 'Click any item to update status or post repair proof'}
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {currentReports.map((report) => (
            <div
              key={report.id}
              className="p-4 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <img
                  src={report.photoUrl}
                  alt={report.title}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-300 shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-300">
                      #{report.ticketNumber}
                    </span>
                    {report.severity === 'critical' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        24h SLA
                      </span>
                    )}
                    <span className="text-xs text-stone-500 font-medium truncate">
                      {report.ward} • {report.city}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm truncate">
                    {lang === 'hi' ? report.titleHi : report.title}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {report.assignedDepartment}
                  </p>
                </div>
              </div>

              {/* Quick Actions for Officer */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                {report.status === 'reported' && (
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        report.id,
                        'inspected',
                        'Executive Engineer inspected the location. Work order approved.',
                        undefined,
                        'Municipal Quick Response Team'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
                  >
                    ✓ {lang === 'hi' ? 'सत्यापित करें' : 'Mark Inspected'}
                  </button>
                )}

                {report.status === 'inspected' && (
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        report.id,
                        'in_progress',
                        'Contractor team dispatched with bitumen/materials on-site.',
                        undefined,
                        'Shree Balaji Infra & Bitumen'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                  >
                    🔨 {lang === 'hi' ? 'मरम्मत शुरू करें' : 'Dispatch Crew'}
                  </button>
                )}

                {report.status === 'in_progress' && (
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        report.id,
                        'resolved',
                        'Public property fully repaired and traffic opened. Verified by civic engineer.',
                        'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
                        'Shree Balaji Infra & Bitumen'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    🎉 {lang === 'hi' ? 'समाधान फोटो सहित' : 'Resolve with Proof'}
                  </button>
                )}

                <button
                  onClick={() => onOpenReportDetails(report)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors border border-stone-300"
                >
                  {t.map.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
