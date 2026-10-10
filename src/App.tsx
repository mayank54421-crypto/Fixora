import React, { useState, useEffect } from 'react';
import { DamageReport, Leader, User, Language, StatusType } from './types';
import { INITIAL_REPORTS, INITIAL_LEADERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { FrontPageHero } from './components/FrontPageHero';
import { InteractiveMap } from './components/InteractiveMap';
import { LeadershipScorecard } from './components/LeadershipScorecard';
import { ReportsListView } from './components/ReportsListView';
import { OfficerDesk } from './components/OfficerDesk';
import { ReportDamageModal } from './components/ReportDamageModal';
import { StatusTrackerModal } from './components/StatusTrackerModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import { SafetyShieldModal } from './components/SafetyShieldModal';
import { auth, signOut, onAuthStateChanged } from './firebase';
import { ShieldCheck, PhoneCall, CheckCircle2, Heart, Award, Sparkles } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'map' | 'leadership' | 'reports' | 'officerDesk'>('map');
  const [reports, setReports] = useState<DamageReport[]>(() => {
    const saved = localStorage.getItem('fixora_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  const [leaders, setLeaders] = useState<Leader[]>(INITIAL_LEADERS);

  // User session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<DamageReport | null>(null);
  const [selectedReportIdForMap, setSelectedReportIdForMap] = useState<string | null>(null);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setCurrentUser((prev) => {
          if (prev) return prev;
          return {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || (fbUser.isAnonymous ? 'Anonymous Citizen' : 'Citizen User'),
            email: fbUser.email || undefined,
            role: 'citizen',
            isAnonymous: fbUser.isAnonymous,
          };
        });
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync reports to localStorage
  useEffect(() => {
    localStorage.setItem('fixora_reports', JSON.stringify(reports));
  }, [reports]);

  // Handle New Damage Report
  const handleCreateReport = (newReport: DamageReport) => {
    setReports((prev) => [newReport, ...prev]);

    // Update assigned leader total count
    setLeaders((prevLeaders) =>
      prevLeaders.map((lead) => {
        if (lead.id === newReport.assignedLeaderId) {
          return {
            ...lead,
            totalCount: lead.totalCount + 1,
          };
        }
        return lead;
      })
    );

    setSelectedReportIdForMap(newReport.id);
    setCurrentTab('map');
  };

  // Handle Status Update (e.g. from Municipal Officer or Engineer)
  const handleUpdateStatus = (
    reportId: string,
    newStatus: StatusType,
    remarks: string,
    resolvedPhotoUrl?: string,
    contractor?: string
  ) => {
    setReports((prevReports) =>
      prevReports.map((rep) => {
        if (rep.id === reportId) {
          const updatedHistory = [
            ...rep.history,
            {
              status: newStatus,
              timestamp: new Date().toLocaleString(),
              noteEn: remarks,
              noteHi: remarks,
              updatedBy: currentUser?.name || 'Municipal Engineer',
            },
          ];

          return {
            ...rep,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            officialRemarks: remarks,
            officialRemarksHi: remarks,
            resolvedPhotoUrl: resolvedPhotoUrl || rep.resolvedPhotoUrl,
            contractorName: contractor || rep.contractorName,
            history: updatedHistory,
          };
        }
        return rep;
      })
    );

    // If marked resolved, update leader scorecard resolution metrics
    if (newStatus === 'resolved') {
      const targetReport = reports.find((r) => r.id === reportId);
      if (targetReport && targetReport.status !== 'resolved') {
        setLeaders((prevLeaders) =>
          prevLeaders.map((lead) => {
            if (lead.id === targetReport.assignedLeaderId) {
              return {
                ...lead,
                resolvedCount: lead.resolvedCount + 1,
                citizenApprovalRating: Math.min(5.0, Number((lead.citizenApprovalRating + 0.1).toFixed(1))),
              };
            }
            return lead;
          })
        );
      }
    }

    // Also update modal in view if currently open
    setSelectedReportForDetails((prev) => {
      if (prev && prev.id === reportId) {
        return {
          ...prev,
          status: newStatus,
          officialRemarks: remarks,
          officialRemarksHi: remarks,
          resolvedPhotoUrl: resolvedPhotoUrl || prev.resolvedPhotoUrl,
          contractorName: contractor || prev.contractorName,
        };
      }
      return prev;
    });
  };

  // Handle Upvotes (+1 affected)
  const handleUpvote = (reportId: string) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const alreadyUpvoted = !!rep.upvotedByMe;
          return {
            ...rep,
            upvotes: alreadyUpvoted ? rep.upvotes - 1 : rep.upvotes + 1,
            upvotedByMe: !alreadyUpvoted,
          };
        }
        return rep;
      })
    );

    setSelectedReportForDetails((prev) => {
      if (prev && prev.id === reportId) {
        const alreadyUpvoted = !!prev.upvotedByMe;
        return {
          ...prev,
          upvotes: alreadyUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          upvotedByMe: !alreadyUpvoted,
        };
      }
      return prev;
    });
  };

  const handleFilterWardInMap = (ward: string) => {
    setCurrentTab('map');
  };

  const handleViewReportOnMap = (reportId: string) => {
    setSelectedReportIdForMap(reportId);
    setCurrentTab('map');
  };

  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          lang={lang}
          onLanguageToggle={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
          onLogin={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        />
        <SafetyShieldModal
          isOpen={isSafetyModalOpen}
          onClose={() => setIsSafetyModalOpen(false)}
          lang={lang}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onLanguageToggle={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.error('SignOut error:', e);
          }
          setCurrentUser(null);
          setIsAuthenticated(false);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        totalDamageCount={reports.length}
      />

      {/* Hero Banner (Always on Home / Map view for strong front-page presence) */}
      {currentTab === 'map' && (
        <FrontPageHero
          lang={lang}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onNavigateToMap={() => {
            const el = document.getElementById('map-view-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToLeadership={() => setCurrentTab('leadership')}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          resolvedCount={resolvedCount}
          totalCount={reports.length}
        />
      )}

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Live Interactive Damage Map */}
        {currentTab === 'map' && (
          <section id="map-view-section">
            <InteractiveMap
              reports={reports}
              leaders={leaders}
              lang={lang}
              onSelectReport={(rep) => setSelectedReportForDetails(rep)}
              onUpvoteReport={handleUpvote}
              selectedReportId={selectedReportIdForMap}
            />
          </section>
        )}

        {/* TAB 2: Leadership Accountability Scorecard */}
        {currentTab === 'leadership' && (
          <LeadershipScorecard
            leaders={leaders}
            reports={reports}
            lang={lang}
            onFilterWardInMap={handleFilterWardInMap}
          />
        )}

        {/* TAB 3: All Complaints List View */}
        {currentTab === 'reports' && (
          <ReportsListView
            reports={reports}
            leaders={leaders}
            lang={lang}
            onSelectReport={(rep) => setSelectedReportForDetails(rep)}
            onUpvoteReport={handleUpvote}
            onViewOnMap={handleViewReportOnMap}
          />
        )}

        {/* TAB 4: Municipal Officer & Engineer Desk */}
        {currentTab === 'officerDesk' && (
          <OfficerDesk
            reports={reports}
            leaders={leaders}
            currentUser={currentUser}
            lang={lang}
            onOpenReportDetails={(rep) => setSelectedReportForDetails(rep)}
            onUpdateStatus={handleUpdateStatus}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onAuthorizeOfficer={(officer) => setCurrentUser(officer)}
          />
        )}
      </main>

      {/* Modals */}
      <ReportDamageModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lang={lang}
        leaders={leaders}
        onSubmitReport={handleCreateReport}
      />

      <StatusTrackerModal
        report={selectedReportForDetails}
        onClose={() => setSelectedReportForDetails(null)}
        lang={lang}
        leaders={leaders}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateStatus}
        onUpvoteReport={handleUpvote}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        lang={lang}
        onLogin={(user) => setCurrentUser(user)}
      />

      <SafetyShieldModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        lang={lang}
      />

      {/* Authentic Indian Civic Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12">
        {/* Tricolor Bottom Accent */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            {/* Column 1: Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black text-sm">
                  FX
                </div>
                <span className="font-extrabold text-white text-base">
                  {lang === 'hi' ? 'Fixora (फिक्सोरा)' : 'Fixora'}
                </span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                {lang === 'hi'
                  ? 'सत्यमेव जयते। भारत के नागरिकों द्वारा सार्वजनिक संपत्ति की रक्षा एवं स्थानीय जन प्रतिनिधियों की लोकतांत्रिक जवाबदेही का सशक्त मंच।'
                  : 'Satyameva Jayate. Empowering Indian citizens to report damaged public property anonymously and hold ward corporators and MLAs accountable.'}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'hi' ? '100% व्हिसलब्लोअर पहचान सुरक्षा' : '100% Whistleblower Anonymity'}</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold text-white text-sm mb-3">
                {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Navigation'}
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <button onClick={() => setCurrentTab('map')} className="hover:text-amber-400">
                    {lang === 'hi' ? 'लाइव क्षति नक्शा' : 'Live Damage Map'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('leadership')} className="hover:text-amber-400">
                    {lang === 'hi' ? 'नेता जवाबदेही रिपोर्ट कार्ड' : 'Leader Scorecards (Choose Wisely)'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('officerDesk')} className="hover:text-amber-400">
                    {lang === 'hi' ? 'नगर निगम नियंत्रण कक्ष' : 'Municipal SLA Control Desk'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSafetyModalOpen(true)} className="hover:text-amber-400">
                    {lang === 'hi' ? 'नागरिक सुरक्षा नीति' : 'Citizen Privacy Shield'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Emergency Helpline numbers */}
            <div>
              <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-amber-500" />
                {lang === 'hi' ? 'सार्वजनिक हेल्पलाइन नंबर' : 'National Civic Helplines'}
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li className="flex justify-between">
                  <span>{lang === 'hi' ? 'नगर निगम शिकायत:' : 'Municipal Toll-Free:'}</span>
                  <span className="font-mono font-bold text-white">1916</span>
                </li>
                <li className="flex justify-between">
                  <span>{lang === 'hi' ? 'मुख्यमंत्री हेल्पलाइन:' : 'CM Helpline:'}</span>
                  <span className="font-mono font-bold text-white">1076</span>
                </li>
                <li className="flex justify-between">
                  <span>{lang === 'hi' ? 'सड़क एवं राजमार्ग आपातकाल:' : 'Road & Highway NHAI:'}</span>
                  <span className="font-mono font-bold text-white">1033</span>
                </li>
                <li className="flex justify-between">
                  <span>{lang === 'hi' ? 'विद्युत आपातकाल:' : 'Electricity Emergency:'}</span>
                  <span className="font-mono font-bold text-white">1912</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Hackathon Project Vibe */}
            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/80">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Hackathon Innovation</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {lang === 'hi'
                  ? 'जनता की सुरक्षा, सार्वजनिक संपत्ति का त्वरित जीर्णोद्धार और मतदान से पहले नेताओं का वास्तविक प्रदर्शन।'
                  : 'Bridging anonymous citizen grievance redressal, municipal workflow, and democratic leader transparency.'}
              </p>
              <div className="mt-3 pt-3 border-t border-stone-700 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Language / भाषा:</span>
                <button
                  onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
                  className="font-bold text-amber-400 hover:text-amber-300 underline uppercase"
                >
                  {lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <div>
              © 2026 Fixora (फिक्सोरा) • Built with Civic Passion for Public Property Protection & Democratic Accountability.
            </div>
            <div className="flex items-center gap-1 text-stone-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for a Cleaner & Safer India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
