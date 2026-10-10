import React, { useState } from 'react';
import { DamageReport, Language, Leader, StatusType, User } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  CheckCircle2, 
  Clock, 
  Eye, 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Building2, 
  UserCircle2, 
  ThumbsUp, 
  X, 
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  FileCheck2,
  Award
} from 'lucide-react';

interface StatusTrackerModalProps {
  report: DamageReport | null;
  onClose: () => void;
  lang: Language;
  leaders: Leader[];
  currentUser: User | null;
  onUpdateStatus: (
    reportId: string, 
    newStatus: StatusType, 
    remarks: string, 
    resolvedPhotoUrl?: string, 
    contractor?: string
  ) => void;
  onUpvoteReport: (reportId: string) => void;
}

export const StatusTrackerModal: React.FC<StatusTrackerModalProps> = ({
  report,
  onClose,
  lang,
  leaders,
  currentUser,
  onUpdateStatus,
  onUpvoteReport,
}) => {
  if (!report) return null;
  const t = getTranslation(lang);

  const [activePhotoTab, setActivePhotoTab] = useState<'before' | 'after'>('before');
  const [officerStatus, setOfficerStatus] = useState<StatusType>(report.status);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80'
  );
  const [contractorInput, setContractorInput] = useState(report.contractorName || '');
  const [showOfficerControls, setShowOfficerControls] = useState(currentUser?.role === 'officer');

  const matchedLeader = leaders.find((l) => l.id === report.assignedLeaderId) || leaders[0];

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(
      report.id,
      officerStatus,
      officerRemarks.trim() || 'Status updated by Municipal Inspection Wing.',
      officerStatus === 'resolved' ? proofPhotoUrl : undefined,
      contractorInput.trim() || undefined
    );
    setOfficerRemarks('');
  };

  const getStepActive = (stepStatus: StatusType) => {
    const order: StatusType[] = ['reported', 'inspected', 'in_progress', 'resolved'];
    const currentIndex = order.indexOf(report.status);
    const stepIndex = order.indexOf(stepStatus);
    return {
      isCompleted: stepIndex <= currentIndex,
      isCurrent: stepIndex === currentIndex,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Tricolor Header Stripe */}
        <div className="h-2 w-full flex shrink-0">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ticket ID & Anonymity Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-300">
                Ticket: #{report.ticketNumber}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'hi' ? 'नागरिक पहचान सुरक्षित' : 'Reporter Shielded'}
              </span>
            </div>

            <button
              onClick={() => onUpvoteReport(report.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                report.upvotedByMe
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByMe ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{report.upvotes} {lang === 'hi' ? 'नागरिक प्रभावित' : 'Citizens Affected'}</span>
            </button>
          </div>

          {/* Title & Description */}
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug mb-2">
            {lang === 'hi' ? report.titleHi : report.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
            {lang === 'hi' ? report.descriptionHi : report.description}
          </p>

          {/* Multi-step Status Progress Bar */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{t.status.timeline}</span>
              <span className="text-amber-800 font-extrabold capitalize bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                {t.status[report.status]}
              </span>
            </h4>

            {/* Steps Container */}
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Step 1: Reported */}
              {(() => {
                const s1 = getStepActive('reported');
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                      s1.isCompleted
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {t.status.reported}
                    </span>
                  </div>
                );
              })()}

              {/* Step 2: Inspected */}
              {(() => {
                const s2 = getStepActive('inspected');
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                      s2.isCompleted
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {t.status.inspected}
                    </span>
                  </div>
                );
              })()}

              {/* Step 3: In Progress */}
              {(() => {
                const s3 = getStepActive('in_progress');
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                      s3.isCompleted
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {t.status.in_progress}
                    </span>
                  </div>
                );
              })()}

              {/* Step 4: Resolved */}
              {(() => {
                const s4 = getStepActive('resolved');
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                      s4.isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {t.status.resolved}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Before & After Photo View */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800">
                {t.status.beforeAfter}
              </span>
              {report.resolvedPhotoUrl && (
                <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
                  <button
                    onClick={() => setActivePhotoTab('before')}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      activePhotoTab === 'before'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600'
                    }`}
                  >
                    {t.status.before}
                  </button>
                  <button
                    onClick={() => setActivePhotoTab('after')}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      activePhotoTab === 'after'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-stone-600'
                    }`}
                  >
                    {t.status.after}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 aspect-video max-h-72 bg-stone-900">
              <img
                src={
                  activePhotoTab === 'after' && report.resolvedPhotoUrl
                    ? report.resolvedPhotoUrl
                    : report.photoUrl
                }
                alt="Civic damage status"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Two-Column Info: Municipal Details + Leadership Accountability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Municipal Department & Action Card */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>{lang === 'hi' ? report.departmentHi : report.assignedDepartment}</span>
              </div>
              <div className="text-stone-600">
                <span className="font-semibold text-stone-800">{t.status.assignedContractor}: </span>
                <span>{report.contractorName || 'Assigned to Ward Quick-Action Gang'}</span>
              </div>
              {report.estimatedCost && (
                <div className="text-stone-600">
                  <span className="font-semibold text-stone-800">{t.status.estimatedBudget}: </span>
                  <span className="font-bold text-emerald-800">{report.estimatedCost}</span>
                </div>
              )}
              {report.officialRemarks && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="font-semibold text-stone-800 mb-0.5">{t.status.officialRemarks}:</div>
                  <p className="italic text-stone-600">
                    "{lang === 'hi' ? report.officialRemarksHi || report.officialRemarks : report.officialRemarks}"
                  </p>
                </div>
              )}
            </div>

            {/* Leadership Accountability Card ("Under which leadership it is being done") */}
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Award className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'क्षेत्रीय जन प्रतिनिधि (जवाबदेही):' : 'Elected Leader Accountable:'}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={matchedLeader.photoUrl}
                    alt={matchedLeader.name}
                    className="w-12 h-12 rounded-xl object-cover border border-purple-300"
                  />
                  <div>
                    <h4 className="font-bold text-purple-950 text-sm">
                      {lang === 'hi' ? matchedLeader.nameHi : matchedLeader.name}
                    </h4>
                    <p className="text-[11px] text-purple-800">
                      {lang === 'hi' ? matchedLeader.roleTitleHi : matchedLeader.roleTitleEn} ({matchedLeader.party})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/70 p-2 rounded-lg border border-purple-200">
                  <div>
                    <span className="text-stone-500">{lang === 'hi' ? 'वार्ड समाधान दर:' : 'Fix Rate:'} </span>
                    <span className="font-bold text-purple-900">
                      {Math.round((matchedLeader.resolvedCount / matchedLeader.totalCount) * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">{lang === 'hi' ? 'नागरिक रेटिंग:' : 'Rating:'} </span>
                    <span className="font-bold text-amber-600">{matchedLeader.citizenApprovalRating}★</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-200 text-[10px] text-purple-700 font-medium">
                {lang === 'hi' 
                  ? 'यह कार्य पूरा होने पर इनके रिपोर्ट कार्ड में दर्ज होगा ताकि आप सही चुनाव कर सकें।' 
                  : 'Resolution progress updates will reflect on this leader\'s democratic scorecard.'}
              </div>
            </div>
          </div>

          {/* Action Button: Municipal Engineer Panel Toggle */}
          <div className="mt-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                {t.status.officerUpdateTitle}
              </span>
              {currentUser?.email?.toLowerCase() === 'sonikumaranubhav@gmail.com' ? (
                <button
                  type="button"
                  onClick={() => setShowOfficerControls(!showOfficerControls)}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
                >
                  {showOfficerControls ? 'Hide Officer Controls' : 'Open Executive Engineer Action Panel'}
                </button>
              ) : (
                <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  🔒 {lang === 'hi' ? 'केवल अधिकृत अभियंता (sonikumaranubhav@gmail.com)' : 'Restricted to sonikumaranubhav@gmail.com'}
                </span>
              )}
            </div>

            {/* Officer Action Form */}
            {showOfficerControls && currentUser?.email?.toLowerCase() === 'sonikumaranubhav@gmail.com' && (
              <form onSubmit={handleOfficerSubmit} className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {lang === 'hi' ? 'नई मरम्मत स्थिति चुनें' : 'Update Lifecycle Status'}
                    </label>
                    <select
                      value={officerStatus}
                      onChange={(e) => setOfficerStatus(e.target.value as StatusType)}
                      className="w-full p-2 bg-white rounded-lg border border-stone-300 font-semibold"
                    >
                      <option value="reported">{t.status.reported}</option>
                      <option value="inspected">{t.status.inspected}</option>
                      <option value="in_progress">{t.status.in_progress}</option>
                      <option value="resolved">{t.status.resolved}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.status.assignedContractor}
                    </label>
                    <input
                      type="text"
                      value={contractorInput}
                      onChange={(e) => setContractorInput(e.target.value)}
                      placeholder="e.g. Nagar Nigam Emergency Gang #4"
                      className="w-full p-2 bg-white rounded-lg border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.status.addRemarks}
                  </label>
                  <input
                    type="text"
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    placeholder="e.g. Patchwork completed with hot bitumen; cured & open to traffic."
                    className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs"
                  />
                </div>

                {officerStatus === 'resolved' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      {t.status.addProofPhoto}
                    </label>
                    <input
                      type="text"
                      value={proofPhotoUrl}
                      onChange={(e) => setProofPhotoUrl(e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs font-mono"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t.status.updateStatusBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
