import React, { useState } from 'react';
import { Leader, Language, DamageReport } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight, 
  ArrowUpDown,
  Filter,
  BarChart3,
  ThumbsUp
} from 'lucide-react';

interface LeadershipScorecardProps {
  leaders: Leader[];
  reports: DamageReport[];
  lang: Language;
  onFilterWardInMap: (ward: string) => void;
}

export const LeadershipScorecard: React.FC<LeadershipScorecardProps> = ({
  leaders,
  reports,
  lang,
  onFilterWardInMap,
}) => {
  const t = getTranslation(lang);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'resolvedRate' | 'fastest' | 'rating'>('resolvedRate');
  const [comparedLeaderIds, setComparedLeaderIds] = useState<string[]>([]);
  const [endorsedLeaders, setEndorsedLeaders] = useState<{ [id: string]: number }>({});

  // Filter leaders
  const filteredLeaders = leaders
    .filter((l) => {
      if (roleFilter !== 'all' && l.role !== roleFilter) return false;
      if (cityFilter !== 'all' && l.city !== cityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'resolvedRate') {
        const rateA = a.resolvedCount / (a.totalCount || 1);
        const rateB = b.resolvedCount / (b.totalCount || 1);
        return rateB - rateA;
      }
      if (sortBy === 'fastest') {
        return a.avgResolutionHours - b.avgResolutionHours;
      }
      if (sortBy === 'rating') {
        return b.citizenApprovalRating - a.citizenApprovalRating;
      }
      return 0;
    });

  const toggleCompare = (leaderId: string) => {
    if (comparedLeaderIds.includes(leaderId)) {
      setComparedLeaderIds(comparedLeaderIds.filter((id) => id !== leaderId));
    } else {
      if (comparedLeaderIds.length >= 2) {
        setComparedLeaderIds([comparedLeaderIds[1], leaderId]);
      } else {
        setComparedLeaderIds([...comparedLeaderIds, leaderId]);
      }
    }
  };

  const handleEndorse = (leaderId: string) => {
    setEndorsedLeaders((prev) => ({
      ...prev,
      [leaderId]: (prev[leaderId] || 0) + 1,
    }));
  };

  const comparedLeaders = leaders.filter((l) => comparedLeaderIds.includes(l.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-stone-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Award className="w-64 h-64 text-purple-300" />
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'hi' ? 'लोकतांत्रिक जवाबदेही सूचकांक' : 'Democratic Accountability & Citizen Vetting'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t.leaders.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            {t.leaders.subtitle}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-amber-300 bg-black/30 w-fit px-3 py-1.5 rounded-lg border border-white/10">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t.leaders.accountabilityNotice}</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">{t.leaders.filterRole}:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">{t.map.all} {t.leaders.filterRole}</option>
              <option value="ward_corporator">{lang === 'hi' ? 'वार्ड पार्षद (Councillor)' : 'Ward Councillor'}</option>
              <option value="mla">{lang === 'hi' ? 'विधायक (MLA)' : 'MLA (Legislator)'}</option>
              <option value="mayor">{lang === 'hi' ? 'महापौर (Mayor)' : 'City Mayor'}</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">{lang === 'hi' ? 'शहर:' : 'City:'}</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-semibold focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">{t.map.all}</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600" />
            {t.leaders.sortBy}:
          </span>
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setSortBy('resolvedRate')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'resolvedRate'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.leaders.sortResolvedRate}
            </button>
            <button
              onClick={() => setSortBy('fastest')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'fastest'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.leaders.sortFastest}
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'rating'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.leaders.sortRating}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side Compare View (if 2 selected) */}
      {comparedLeaders.length === 2 && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-700" />
              <h3 className="font-extrabold text-stone-900 text-base">
                {lang === 'hi' ? 'नेताओं की सीधी तुलना (Choose Wisely)' : 'Head-to-Head Civic Accountability Comparison'}
              </h3>
            </div>
            <button
              onClick={() => setComparedLeaderIds([])}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
            >
              {lang === 'hi' ? 'तुलना बंद करें' : 'Clear Comparison'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {comparedLeaders.map((lead) => {
              const rate = Math.round((lead.resolvedCount / (lead.totalCount || 1)) * 100);
              return (
                <div key={lead.id} className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={lead.photoUrl}
                      alt={lead.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        {lang === 'hi' ? lead.nameHi : lead.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {lang === 'hi' ? lead.roleTitleHi : lead.roleTitleEn}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">{t.leaders.cardResolvedRate}:</span>
                      <span className={`font-bold ${rate > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {rate}% ({lead.resolvedCount} / {lead.totalCount})
                      </span>
                    </div>

                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">{t.leaders.cardAvgTime}:</span>
                      <span className="font-bold text-stone-900">{lead.avgResolutionHours} hrs</span>
                    </div>

                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">{t.leaders.cardRating}:</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {lead.citizenApprovalRating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leader Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredLeaders.map((leader) => {
          const resolutionRate = Math.round((leader.resolvedCount / (leader.totalCount || 1)) * 100);
          const isTopPerformer = resolutionRate >= 80;
          const isSelectedForCompare = comparedLeaderIds.includes(leader.id);
          const endorsements = endorsedLeaders[leader.id] || 0;

          return (
            <div
              key={leader.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                isSelectedForCompare
                  ? 'border-purple-500 ring-2 ring-purple-300'
                  : 'border-stone-200 hover:border-purple-300'
              }`}
            >
              {/* Card Top Banner with Party & Badges */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 shadow-xs"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 bg-purple-700 text-white rounded-full p-1 text-[10px] shadow-xs">
                        <Award className="w-3 h-3" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                          {lang === 'hi' ? leader.nameHi : leader.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {leader.party}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-900 mt-0.5">
                        {lang === 'hi' ? leader.roleTitleHi : leader.roleTitleEn}
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {leader.ward} • {leader.city}
                      </p>
                    </div>
                  </div>

                  {/* Citizen Trust Rating Stars */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-black text-amber-950">
                        {leader.citizenApprovalRating}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium mt-1">
                      {t.leaders.termLabel}: {leader.termPeriod}
                    </div>
                  </div>
                </div>

                {/* Motto */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 italic mb-4">
                  "{lang === 'hi' ? leader.mottoHi : leader.mottoEn}"
                </div>

                {/* Accountability Performance Scorecard Grid */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-stone-50/70 border border-stone-200 mb-4 text-center">
                  <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase">
                      {t.leaders.cardResolvedRate}
                    </div>
                    <div className={`text-base font-black ${
                      isTopPerformer ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {resolutionRate}%
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {leader.resolvedCount} of {leader.totalCount}
                    </div>
                  </div>

                  <div className="border-x border-stone-200 px-1">
                    <div className="text-[10px] font-bold text-stone-500 uppercase">
                      {t.leaders.cardAvgTime}
                    </div>
                    <div className="text-base font-black text-stone-900">
                      {leader.avgResolutionHours} hrs
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Turnaround
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase">
                      {t.leaders.cardPending}
                    </div>
                    <div className="text-base font-black text-rose-700">
                      {leader.totalCount - leader.resolvedCount}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Active
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {leader.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-200 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEndorse(leader.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-bold border border-stone-300 flex items-center gap-1 transition-colors"
                      title="Endorse this leader's responsiveness"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'hi' ? 'सकारात्मक' : 'Vote Trust'} ({endorsements + 12})</span>
                    </button>

                    <button
                      onClick={() => toggleCompare(leader.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                        isSelectedForCompare
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      {isSelectedForCompare ? '✓ Compared' : '+ Compare'}
                    </button>
                  </div>

                  <button
                    onClick={() => onFilterWardInMap(leader.ward)}
                    className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <span>{t.leaders.viewConstituencyDamages}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
