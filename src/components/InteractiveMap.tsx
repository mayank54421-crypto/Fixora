import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DamageReport, Language, Leader, StatusType, CategoryType, SeverityType } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Filter, 
  MapPin, 
  Layers, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Eye, 
  Navigation, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface InteractiveMapProps {
  reports: DamageReport[];
  leaders: Leader[];
  lang: Language;
  onSelectReport: (report: DamageReport) => void;
  onUpvoteReport: (reportId: string) => void;
  selectedReportId?: string | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  reports,
  leaders,
  lang,
  onSelectReport,
  onUpvoteReport,
  selectedReportId,
}) => {
  const t = getTranslation(lang);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeReportInView, setActiveReportInView] = useState<DamageReport | null>(null);

  // Filtered reports
  const filteredReports = reports.filter((rep) => {
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && rep.category !== categoryFilter) return false;
    if (cityFilter !== 'all' && rep.city !== cityFilter) return false;
    if (severityFilter !== 'all' && rep.severity !== severityFilter) return false;
    return true;
  });

  // Cities for quick zoom
  const CITIES = [
    { name: 'All India', key: 'all', coords: [22.5937, 78.9629] as [number, number], zoom: 5 },
    { name: 'New Delhi', key: 'New Delhi', coords: [28.57, 77.24] as [number, number], zoom: 13 },
    { name: 'Lucknow', key: 'Lucknow', coords: [26.85, 80.94] as [number, number], zoom: 13 },
    { name: 'Mumbai', key: 'Mumbai', coords: [19.06, 72.83] as [number, number], zoom: 13 },
    { name: 'Bengaluru', key: 'Bengaluru', coords: [12.94, 77.62] as [number, number], zoom: 13 },
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center over India initially, or Delhi if has items
    const initialCenter: [number, number] = [28.57, 77.24];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Fixora Civic GIS',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when reports or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredReports.forEach((rep) => {
      // Determine pin appearance
      let bgClass = 'bg-amber-500 border-amber-300';
      let iconColor = '#ffffff';

      if (rep.status === 'reported') {
        bgClass = 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300';
      } else if (rep.status === 'inspected') {
        bgClass = 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300';
      } else if (rep.status === 'in_progress') {
        bgClass = 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300';
      } else if (rep.status === 'resolved') {
        bgClass = 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300';
      }

      const isCritical = rep.severity === 'critical';
      const isSelected = selectedReportId === rep.id;

      // Custom HTML Pin icon
      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${isCritical ? '<div class="absolute -inset-1.5 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
          <div class="w-8 h-8 rounded-full ${bgClass} border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all ${
            isSelected ? 'scale-125 ring-4 ring-amber-500' : 'hover:scale-110'
          }">
            ${rep.status === 'resolved' ? '✓' : isCritical ? '!' : '●'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(rep.coordinates, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveReportInView(rep);
        map.flyTo(rep.coordinates, 15, { duration: 1 });
      });

      markersRef.current[rep.id] = marker;
    });

    // Auto-focus selected report if specified
    if (selectedReportId) {
      const target = reports.find((r) => r.id === selectedReportId);
      if (target) {
        setActiveReportInView(target);
        map.flyTo(target.coordinates, 15, { duration: 1.2 });
      }
    }
  }, [filteredReports, selectedReportId]);

  const handleCityJump = (cityKey: string, coords: [number, number], zoom: number) => {
    setCityFilter(cityKey);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.2 });
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert(lang === 'hi' ? 'जीपीएस उपलब्ध नहीं है।' : 'Geolocation not supported by browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(coords, 14, { duration: 1.5 });
          L.marker(coords, {
            icon: L.divIcon({
              html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-300 animate-pulse"></div>`,
              className: 'current-pos-marker',
              iconSize: [24, 24],
            }),
          })
            .addTo(mapInstanceRef.current)
            .bindPopup(lang === 'hi' ? 'आप यहां हैं' : 'You are here')
            .openPopup();
        }
      },
      () => {
        // Fallback to Delhi center if denied
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([28.57, 77.24], 13);
        }
      }
    );
  };

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

  const getAssignedLeader = (leaderId: string) => {
    return leaders.find((l) => l.id === leaderId);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Filters & City Navigation Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* City Jump Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1 shrink-0">
            <Navigation className="w-3 h-3 text-amber-600" />
            {lang === 'hi' ? 'शहर:' : 'City:'}
          </span>
          {CITIES.map((c) => (
            <button
              key={c.key}
              onClick={() => handleCityJump(c.key, c.coords, c.zoom)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                cityFilter === c.key
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={handleLocateMe}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shrink-0 transition-colors"
            title="Locate my position via GPS"
          >
            📍 {lang === 'hi' ? 'मेरा स्थान' : 'My GPS'}
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <label className="text-stone-500 font-medium hidden sm:inline">
              {t.map.filterStatus}:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label={t.map.filterStatus}
              className="px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">{t.map.all} {t.map.filterStatus}</option>
              <option value="reported">{t.status.reported}</option>
              <option value="inspected">{t.status.inspected}</option>
              <option value="in_progress">{t.status.in_progress}</option>
              <option value="resolved">{t.status.resolved}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <label className="text-stone-500 font-medium hidden sm:inline">
              {t.map.filterCategory}:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label={t.map.filterCategory}
              className="px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">{t.map.all} {t.map.filterCategory}</option>
              <option value="pothole">{t.categories.pothole}</option>
              <option value="streetlight">{t.categories.streetlight}</option>
              <option value="water_leakage">{t.categories.water_leakage}</option>
              <option value="drainage_sewer">{t.categories.drainage_sewer}</option>
              <option value="footpath">{t.categories.footpath}</option>
              <option value="garbage_dump">{t.categories.garbage_dump}</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <label className="text-stone-500 font-medium hidden sm:inline">
              {t.map.filterSeverity}:
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              aria-label={t.map.filterSeverity}
              className="px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">{t.map.all} {t.map.filterSeverity}</option>
              <option value="critical">{lang === 'hi' ? 'अति गंभीर (Critical)' : 'Critical (24h SLA)'}</option>
              <option value="high">{lang === 'hi' ? 'उच्च (High)' : 'High'}</option>
              <option value="medium">{lang === 'hi' ? 'मध्यम (Moderate)' : 'Moderate'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map + Detail Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Leaflet Map Container */}
        <div className="lg:col-span-2 relative bg-stone-100 rounded-2xl border border-stone-300 overflow-hidden shadow-sm h-[480px] sm:h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Legend */}
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200/90 shadow-md text-[11px] flex flex-wrap items-center gap-2.5 max-w-[90%] pointer-events-auto">
            <span className="font-bold text-stone-700 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-600" />
              {lang === 'hi' ? 'संकेत:' : 'Legend:'}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>{t.map.legendReported}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
              <span>{t.map.legendInspected}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
              <span>{t.map.legendInProgress}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>{t.map.legendResolved}</span>
            </div>
          </div>

          {/* Count Badge overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-stone-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {filteredReports.length} {lang === 'hi' ? 'क्षतिग्रस्त संपत्तियां चिन्हित' : 'hazards mapped'}
            </span>
          </div>
        </div>

        {/* Selected / Highlighted Incident Card Drawer */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {activeReportInView ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-full animate-in fade-in duration-150">
              <div>
                {/* Header with Ticket & Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    #{activeReportInView.ticketNumber}
                  </span>
                  {getStatusBadge(activeReportInView.status)}
                </div>

                {/* Photo thumbnail */}
                <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-stone-100 border border-stone-200 group">
                  <img
                    src={activeReportInView.photoUrl}
                    alt={activeReportInView.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {activeReportInView.severity === 'critical' && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <ShieldAlert className="w-3 h-3" />
                      {lang === 'hi' ? 'अति गंभीर (24h SLA)' : 'Critical Hazard'}
                    </div>
                  )}
                  {activeReportInView.status === 'resolved' && activeReportInView.resolvedPhotoUrl && (
                    <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang === 'hi' ? 'मरम्मत प्रमाण उपलब्ध' : 'Fixed Photo Available'}
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
                  {lang === 'hi' ? activeReportInView.titleHi : activeReportInView.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                  {lang === 'hi' ? activeReportInView.descriptionHi : activeReportInView.description}
                </p>

                {/* Location & Ward info */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1.5 text-xs text-stone-700 mb-3">
                  <div className="flex items-start gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {lang === 'hi' ? activeReportInView.addressHi : activeReportInView.address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                    <span>{activeReportInView.ward}</span>
                    <span className="font-semibold text-stone-700">{activeReportInView.city}</span>
                  </div>
                </div>

                {/* Accountability Leader Card */}
                {(() => {
                  const leader = getAssignedLeader(activeReportInView.assignedLeaderId);
                  if (!leader) return null;
                  return (
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center gap-2.5 mb-3">
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-300 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                          {lang === 'hi' ? 'जिम्मेदार जन प्रतिनिधि:' : 'Leader in Charge:'}
                        </div>
                        <div className="text-xs font-bold text-purple-950 truncate">
                          {lang === 'hi' ? leader.nameHi : leader.name}
                        </div>
                        <div className="text-[10px] text-purple-800 truncate">
                          {lang === 'hi' ? leader.roleTitleHi : leader.roleTitleEn} • {leader.citizenApprovalRating}★
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => onUpvoteReport(activeReportInView.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeReportInView.upvotedByMe
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${activeReportInView.upvotedByMe ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{activeReportInView.upvotes} {lang === 'hi' ? 'प्रभावित' : 'Affected'}</span>
                </button>

                <button
                  onClick={() => onSelectReport(activeReportInView)}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span>{t.map.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Prompt to click marker */
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center flex flex-col items-center justify-center h-full text-stone-500">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm mb-1">
                {lang === 'hi' ? 'नक्शे पर किसी भी पिन पर क्लिक करें' : 'Click Any Marker on the Map'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs">
                {lang === 'hi'
                  ? 'क्षतिग्रस्त संपत्ति की फोटो, चल रही मरम्मत स्थिति, और जिम्मेदार नेता का विवरण देखने के लिए पिन चुनें।'
                  : 'Inspect damage photographs, live repair status, and the assigned ward leader in charge.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
