import React, { useState } from 'react';
import { DamageReport, Language, Leader, StatusType } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Search, 
  MapPin, 
  Clock, 
  Eye, 
  Wrench, 
  CheckCircle2, 
  ThumbsUp, 
  ShieldAlert, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface ReportsListViewProps {
  reports: DamageReport[];
  leaders: Leader[];
  lang: Language;
  onSelectReport: (report: DamageReport) => void;
  onUpvoteReport: (reportId: string) => void;
  onViewOnMap: (reportId: string) => void;
}

export const ReportsListView: React.FC<ReportsListViewProps> = ({
  reports,
  leaders,
  lang,
  onSelectReport,
  onUpvoteReport,
  onViewOnMap,
}) => {
  const t = getTranslation(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (cityFilter !== 'all' && r.city !== cityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q) || r.titleHi.toLowerCase().includes(q);
      const matchAddress = r.address.toLowerCase().includes(q) || r.addressHi.toLowerCase().includes(q);
      const matchTicket = r.ticketNumber.toLowerCase().includes(q);
      const matchDept = r.assignedDepartment.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchTicket && !matchDept) return false;
    }
    return true;
  });

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'reported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            {t.status.reported}
          </span>
        );
      case 'inspected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Eye className="w-3 h-3" />
            {t.status.inspected}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Wrench className="w-3 h-3" />
            {t.status.in_progress}
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            {t.status.resolved}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'खोजें: सड़क, गड्ढा, टिकट संख्या (#NR-), इलाका...' : 'Search by title, location, ticket #, department...'}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-700"
          >
            <option value="all">{t.map.all} {t.map.filterStatus}</option>
            <option value="reported">{t.status.reported}</option>
            <option value="inspected">{t.status.inspected}</option>
            <option value="in_progress">{t.status.in_progress}</option>
            <option value="resolved">{t.status.resolved}</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-700"
          >
            <option value="all">{t.map.all} {t.report.cityLabel}</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
        </div>
      </div>

      {/* Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const leader = leaders.find((l) => l.id === report.assignedLeaderId);
          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-amber-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  <img
                    src={report.photoUrl}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                      #{report.ticketNumber}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {getStatusBadge(report.status)}
                  </div>
                  {report.severity === 'critical' && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <ShieldAlert className="w-3 h-3" />
                      {lang === 'hi' ? '24h SLA अति गंभीर' : 'Critical Hazard'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 mb-1">
                    {lang === 'hi' ? report.titleHi : report.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                    {lang === 'hi' ? report.descriptionHi : report.description}
                  </p>

                  <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{lang === 'hi' ? report.addressHi : report.address}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex justify-between">
                      <span className="truncate">{report.ward}</span>
                      <span className="font-semibold text-stone-700 shrink-0">{report.city}</span>
                    </div>
                  </div>

                  {/* Leader info */}
                  {leader && (
                    <div className="flex items-center gap-2 text-[11px] text-purple-900 bg-purple-50/70 p-2 rounded-lg border border-purple-200 mb-3">
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate font-semibold">
                        {lang === 'hi' ? leader.nameHi : leader.name} ({lang === 'hi' ? leader.roleTitleHi : leader.roleTitleEn})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-stone-50/70 border-t border-stone-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => onUpvoteReport(report.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    report.upvotedByMe
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByMe ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{report.upvotes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewOnMap(report.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    📍 {lang === 'hi' ? 'नक्शा' : 'Map'}
                  </button>

                  <button
                    onClick={() => onSelectReport(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1 shadow-2xs"
                  >
                    <span>{t.map.viewDetails}</span>
                    <ArrowRight className="w-3 h-3" />
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
