import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DamageReport, Language, Leader, CategoryType, SeverityType } from '../types';
import { getTranslation } from '../locales/translations';
import { SAMPLE_PRESET_PHOTOS } from '../data/mockData';
import { 
  Camera, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  UserX,
  Building2,
  Award
} from 'lucide-react';

interface ReportDamageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  leaders: Leader[];
  onSubmitReport: (newReport: DamageReport) => void;
}

export const ReportDamageModal: React.FC<ReportDamageModalProps> = ({
  isOpen,
  onClose,
  lang,
  leaders,
  onSubmitReport,
}) => {
  const t = getTranslation(lang);

  // Form states
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('pothole');
  const [severity, setSeverity] = useState<SeverityType>('high');
  const [city, setCity] = useState('New Delhi');
  const [ward, setWard] = useState('Ward 42 - Lajpat Nagar & Defence Colony');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<[number, number]>([28.5672, 77.2433]);
  const [assignedDept, setAssignedDept] = useState('Public Works Department (PWD - Road Division)');
  const [deptHi, setDeptHi] = useState('लोक निर्माण विभाग (पीडब्ल्यूडी - सड़क प्रभाग)');
  
  // AI diagnosis state
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ ticket: string; pin: string } | null>(null);

  if (!isOpen) return null;

  // Selected leader based on ward
  const matchedLeader = leaders.find((l) => l.ward.includes('42')) || leaders[0];

  const handleApplyPreset = (preset: typeof SAMPLE_PRESET_PHOTOS[0]) => {
    setIsAiAnalyzing(true);
    setPhotoUrl(preset.url);
    setTitle(lang === 'hi' ? preset.titleHi : preset.titleEn);
    setCategory(preset.category);
    setSeverity(preset.severity);
    setAssignedDept(preset.deptEn);
    setDeptHi(preset.deptHi);
    setDescription(lang === 'hi' ? preset.descHi : preset.descEn);

    // Simulate AI Image Analysis
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiAnalysisResult(
        lang === 'hi'
          ? `✓ एआई विश्लेषण: '${preset.nameHi}' चिन्हित। गंभीरता: ${preset.severity === 'critical' ? 'अति गंभीर (24h)' : 'उच्च'}। विभाग: ${preset.deptHi}।`
          : `✓ AI Diagnostics: Verified '${preset.nameEn}'. Hazard: ${preset.severity.toUpperCase()}. Auto-routed to ${preset.deptEn}.`
      );
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoUrl(result);
        setIsAiAnalyzing(true);
        setTimeout(() => {
          setIsAiAnalyzing(false);
          setAiAnalysisResult(
            lang === 'hi'
              ? '✓ एआई विश्लेषण: सार्वजनिक क्षति पहचानी गई। जीपीएस स्थान सत्यापित।'
              : '✓ AI Diagnostics: Public property damage verified. Severity assessed as High.'
          );
        }, 700);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
          setLandmark(lang === 'hi' ? 'जीपीएस द्वारा दर्ज स्थान (सत्यापित)' : 'GPS Verified Road Coordinates');
        },
        () => {
          setCoords([28.5672, 77.2433]);
          setLandmark('Central Ring Road, Pillar 142');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      alert(lang === 'hi' ? 'कृपया क्षति की एक फोटो अपलोड करें या नमूना फोटो चुनें।' : 'Please upload or pick a damage photograph.');
      return;
    }

    setIsSubmitting(true);

    const generatedTicket = `FX-2026-${city.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const secretCode = `SEC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReport: DamageReport = {
      id: `rep-${Date.now()}`,
      ticketNumber: generatedTicket,
      title: title.trim() || (lang === 'hi' ? 'सार्वजनिक संपत्ति क्षति' : 'Reported Civic Damage'),
      titleHi: title.trim() || 'सार्वजनिक संपत्ति क्षति',
      description: description.trim() || 'Urgent repair required to protect public safety.',
      descriptionHi: description.trim() || 'नागरिक सुरक्षा हेतु तत्काल मरम्मत की आवश्यकता है।',
      category: category,
      categoryNameEn: t.categories[category] || 'Civic Damage',
      categoryNameHi: t.categories[category] || 'सार्वजनिक क्षति',
      status: 'reported',
      severity: severity,
      photoUrl: photoUrl,
      address: landmark || `${ward}, ${city}`,
      addressHi: landmark || `${ward}, ${city}`,
      landmark: landmark || 'Main Road Junction',
      ward: ward,
      constituency: 'Local Vidhan Sabha & Ward Council',
      city: city,
      coordinates: coords,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1,
      upvotedByMe: true,
      assignedDepartment: assignedDept,
      departmentHi: deptHi,
      assignedLeaderId: matchedLeader.id,
      isAnonymous: true,
      anonymousReporterCode: secretCode,
      history: [
        {
          status: 'reported',
          timestamp: new Date().toLocaleString(),
          noteEn: 'Report submitted anonymously. Identity token hashed.',
          noteHi: 'नागरिक द्वारा पहचान सुरक्षित रखकर शिकायत दर्ज की गई।',
          updatedBy: 'Anonymous Citizen',
        },
      ],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket({ ticket: generatedTicket, pin: secretCode });
      onSubmitReport(newReport);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF9933', '#FFFFFF', '#138808'],
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 700);
  };

  const resetAndClose = () => {
    setSubmittedTicket(null);
    setPhotoUrl('');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Tricolor Header Stripe */}
        <div className="h-2 w-full flex shrink-0">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        {submittedTicket ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-stone-900 mb-1">
              {t.report.successTitle}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mb-6">
              {lang === 'hi'
                ? 'आपकी शिकायत सीधे नगर निगम नियंत्रण कक्ष को भेजी जा चुकी है और स्थानीय नेता के खाते में दर्ज हो गई है।'
                : 'Your report has been directly dispatched to the Municipal Control Room and logged against the local elected leader.'}
            </p>

            {/* Ticket Credentials Box */}
            <div className="w-full max-w-md bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-semibold">{t.report.ticketNotice}</span>
                <span className="font-mono text-base font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  #{submittedTicket.ticket}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-stone-200 pt-2.5">
                <span className="text-xs text-stone-500 font-semibold">
                  {lang === 'hi' ? 'सीक्रेट ट्रैकिंग पिन:' : 'Secret Tracking Token:'}
                </span>
                <span className="font-mono text-xs font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {submittedTicket.pin}
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? 'आपकी व्यक्तिगत पहचान पूरी तरह गुप्त रखी गई है।'
                    : '100% Anonymous: Your personal identity has been stripped.'}
                </span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-sm transition-all"
            >
              {lang === 'hi' ? 'नक्शे पर शिकायत देखें' : 'View on Live Map'}
            </button>
          </div>
        ) : (
          /* Report Form */
          <div className="p-5 sm:p-6 overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Safety Badge */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'hi' ? 'व्हिसलब्लोअर नागरिक सुरक्षा सक्रिय' : 'Whistleblower Shield Active'}
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  IP / Identity: Hidden
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.report.modalTitle}
              </h2>
              <p className="text-xs text-stone-500">
                {t.report.modalSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload & Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                  <span>{t.report.uploadTitle} *</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    {lang === 'hi' ? 'तस्वीर से एआई जांच संभव' : 'Supports instant AI analysis'}
                  </span>
                </label>

                {/* Photo Preview / Upload Area */}
                {photoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-400 aspect-video max-h-48 bg-stone-900 group mb-2.5">
                    <img
                      src={photoUrl}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setAiAnalysisResult(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs font-semibold"
                    >
                      {lang === 'hi' ? 'फोटो बदलें' : 'Change Photo'}
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-4 text-center bg-stone-50 transition-colors mb-2.5">
                    <input
                      type="file"
                      id="damage-file-input"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="damage-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-800">
                        {t.report.uploadSubtitle}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5">
                        PNG, JPG, WEBP (Max 10MB)
                      </span>
                    </label>
                  </div>
                )}

                {/* 1-Click Civic Preset Photos for Hackathon Testing */}
                <div>
                  <div className="text-[11px] font-bold text-stone-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {t.report.orPresets}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {SAMPLE_PRESET_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="p-1 rounded-lg border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-[10px] font-semibold text-stone-800 transition-all text-center flex flex-col items-center gap-1 group"
                      >
                        <img
                          src={preset.url}
                          alt={preset.nameEn}
                          className="w-full h-10 object-cover rounded group-hover:scale-105 transition-transform"
                        />
                        <span className="truncate w-full leading-tight">
                          {lang === 'hi' ? preset.nameHi : preset.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Detection Banner */}
                {isAiAnalyzing && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>{t.report.analyzingAi}</span>
                  </div>
                )}

                {aiAnalysisResult && !isAiAnalyzing && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{aiAnalysisResult}</span>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.report.titleLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.report.titlePlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                />
              </div>

              {/* Category & Severity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.report.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="pothole">{t.categories.pothole}</option>
                    <option value="streetlight">{t.categories.streetlight}</option>
                    <option value="water_leakage">{t.categories.water_leakage}</option>
                    <option value="drainage_sewer">{t.categories.drainage_sewer}</option>
                    <option value="footpath">{t.categories.footpath}</option>
                    <option value="transformer_wire">{t.categories.transformer_wire}</option>
                    <option value="garbage_dump">{t.categories.garbage_dump}</option>
                    <option value="public_park">{t.categories.public_park}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.report.severityLabel}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="critical">{t.report.severityCritical}</option>
                    <option value="high">{t.report.severityHigh}</option>
                    <option value="medium">{t.report.severityMedium}</option>
                    <option value="low">{t.report.severityLow}</option>
                  </select>
                </div>
              </div>

              {/* City & Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.report.cityLabel}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="New Delhi">New Delhi (दिल्ली)</option>
                    <option value="Lucknow">Lucknow (लखनऊ)</option>
                    <option value="Mumbai">Mumbai (मुंबई)</option>
                    <option value="Bengaluru">Bengaluru (बेंगलुरु)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.report.wardLabel}
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Ward 42 - Lajpat Nagar & Defence Colony">
                      Ward 42 - Lajpat Nagar & Defence Colony
                    </option>
                    <option value="Ward 18 & Ward 19 - Hazratganj">
                      Ward 18 & Ward 19 - Hazratganj (Lucknow)
                    </option>
                    <option value="Ward 74 - Bandra West & Pali Hill">
                      Ward 74 - Bandra West (Mumbai)
                    </option>
                    <option value="City-wide Jurisdiction - Koramangala">
                      City-wide Jurisdiction - Koramangala (BLR)
                    </option>
                  </select>
                </div>
              </div>

              {/* Landmark & Geolocation */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                  <span>{t.report.landmarkLabel} *</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {t.report.detectLocation}
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder={t.report.landmarkPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                />
              </div>

              {/* Leadership Accountability Preview Card */}
              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center gap-3">
                <img
                  src={matchedLeader.photoUrl}
                  alt={matchedLeader.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-300 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {t.report.assignedLeaderInfo}
                  </div>
                  <div className="text-xs font-bold text-purple-950 truncate">
                    {lang === 'hi' ? matchedLeader.nameHi : matchedLeader.name}
                  </div>
                  <div className="text-[11px] text-purple-800 truncate">
                    {lang === 'hi' ? matchedLeader.roleTitleHi : matchedLeader.roleTitleEn} ({matchedLeader.party})
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-purple-950">
                    {Math.round((matchedLeader.resolvedCount / matchedLeader.totalCount) * 100)}%
                  </div>
                  <div className="text-[10px] text-purple-700 font-medium">
                    {lang === 'hi' ? 'समाधान दर' : 'Fix Rate'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.report.descriptionLabel}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.report.descriptionPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                {isSubmitting ? t.report.submitting : t.report.submitBtn}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
