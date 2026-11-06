'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Languages, 
  RefreshCw, 
  Phone, 
  User, 
  Activity, 
  Stethoscope, 
  ScanLine, 
  Layers, 
  Baby, 
  Pill, 
  Sparkles, 
  ChevronRight, 
  BellRing,
  UserCheck
} from 'lucide-react';

// ==============================================================
// 1. MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const TRACKER_TRANSLATIONS = {
  en: {
    headerTitle: 'Govt. Hospital Pokaran',
    headerSub: 'Live Patient Queue Tracker • Smart OPD',
    searchTitle: 'Track Your Live Queue Status',
    searchSub: 'Enter your 6-digit Parchi Code or Token Number from your hospital slip',
    inputPlaceholder: 'e.g. 619283 or OPD-104...',
    trackBtn: 'Check Status',
    clearBtn: 'Clear',
    statusInsideTitle: '🎉 IT IS YOUR TURN! PROCEED INSIDE NOW',
    statusInsideSub: 'Your batch is currently inside the chamber. Please take your seat immediately.',
    statusWaitingTitle: 'YOU ARE IN QUEUE (PLEASE RELAX)',
    statusWaitingSub: 'You can wait comfortably in the shaded courtyard or waiting hall.',
    statusDoneTitle: 'CONSULTATION / TEST COMPLETED',
    statusDoneSub: 'Your consultation is done. Proceed to Room 05 (DDC) for free medicines.',
    patientsAhead: 'Patients Ahead of You',
    estWaitTime: 'Estimated Wait Time',
    currentActiveBatch: 'Currently Inside Room (Active Batch)',
    roomLocation: 'Reporting Room & Route',
    inchargeDoctor: 'Consulting Doctor / Specialist',
    campusRoute: 'Campus Direction Guide',
    browseAllDepts: 'Live Status Across All Hospital Rooms',
    browseSub: 'Quick glance at current running tokens in each department',
    roomRunningNow: 'Now In Chamber',
    waitingCountLabel: 'Waiting',
    footerText: 'Government Sub-District Hospital, Pokaran (Jaisalmer) • Powered by Webnexa Smart Hospital OS',
    notFoundTitle: 'Token / Parchi Not Found',
    notFoundSub: 'Please recheck the 6-digit Parchi Code or Token printed on your registration slip.'
  },
  hi: {
    headerTitle: 'राजकीय सामान्य चिकित्सालय, पोकरण',
    headerSub: 'लाइव मरीज कतार ट्रैकर • स्मार्ट अस्पताल',
    searchTitle: 'अपनी लाइव कतार स्थिति जांचें',
    searchSub: 'अपनी पर्ची पर लिखा 6-अंकों का पर्ची कोड या टोकन नंबर दर्ज करें',
    inputPlaceholder: 'उदा. 619283 या OPD-104...',
    trackBtn: 'स्थिति देखें',
    clearBtn: 'साफ़ करें',
    statusInsideTitle: '🎉 आपकी बारी आ गई है! तुरंत अंदर पधारें',
    statusInsideSub: 'आपका बैच अभी कक्ष के अंदर है। कृपया कमरे में जाकर बेंच पर बैठें।',
    statusWaitingTitle: 'आप कतार में हैं (कृपया प्रतीक्षा करें)',
    statusWaitingSub: 'आप बाहर छाया, कैंटीन या वेटिंग हॉल में आराम से बैठ सकते हैं।',
    statusDoneTitle: 'परामर्श / जांच पूर्ण हो चुकी है',
    statusDoneSub: 'आपकी जांच पूरी हो गई है। निःशुल्क दवाइयों हेतु कमरा नं. 05 में जाएं।',
    patientsAhead: 'आपके आगे प्रतीक्षारत मरीज',
    estWaitTime: 'अनुमानित प्रतीक्षा समय',
    currentActiveBatch: 'कक्ष के अंदर सक्रिय बैच',
    roomLocation: 'कक्ष संख्या एवं रास्ता',
    inchargeDoctor: 'उपस्थित चिकित्सक / विशेषज्ञ',
    campusRoute: 'अस्पताल परिसर दिशा-निर्देश',
    browseAllDepts: 'अस्पताल के सभी कमरों की लाइव स्थिति',
    browseSub: 'किस कमरे में कौन सा टोकन चल रहा है, एक नज़र में देखें',
    roomRunningNow: 'अंदर उपस्थित',
    waitingCountLabel: 'कतार',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण (जैसलमेर) • Webnexa स्मार्ट हॉस्पिटल OS',
    notFoundTitle: 'टोकन या पर्ची नंबर नहीं मिला',
    notFoundSub: 'कृपया अपनी पर्ची पर छपा 6-अंकों का पर्ची कोड या टोकन नंबर पुनः जांचें।'
  }
};

// All Core Hospital Department Metadata
const DEPARTMENT_DIRECTORY = {
  opd: {
    room: 'Room 01',
    nameEn: 'General Medicine OPD',
    nameHi: 'सामान्य चिकित्सा ओपीडी',
    doctorEn: 'Dr. S. K. Sharma (MD Physician)',
    doctorHi: 'डॉ. एस. के. शर्मा (वरिष्ठ फिजिशियन)',
    routeEn: 'Main Entrance → Straight Corridor → Left side Door 01',
    routeHi: 'मुख्य प्रवेश द्वार से सीधे आगे → बायां पहला कमरा नं. 01',
    icon: Stethoscope,
    color: 'emerald'
  },
  pediatrics: {
    room: 'Room 06',
    nameEn: 'Pediatrics & Child Care',
    nameHi: 'शिशु एवं बाल रोग विभाग',
    doctorEn: 'Dr. Vikram Choudhary (Pediatrician)',
    doctorHi: 'डॉ. विक्रम चौधरी (शिशु रोग विशेषज्ञ)',
    routeEn: 'Main Corridor → Right Wing → Room 06',
    routeHi: 'मुख्य गलियारे से दायां विंग → कमरा नं. 06',
    icon: Baby,
    color: 'sky'
  },
  gynae: {
    room: 'Room 03',
    nameEn: 'Ladies / Gynae & Obstetrics',
    nameHi: 'महिला एवं प्रसूति रोग (ANC)',
    doctorEn: 'Dr. Anita Bishnoi (Gynecologist)',
    doctorHi: 'डॉ. अनिता विश्नोई (महिला रोग विशेषज्ञ)',
    routeEn: 'Main Corridor → Near Registration Counter → Room 03',
    routeHi: 'मुख्य गलियारा → पर्ची काउंटर के पास → कमरा नं. 03',
    icon: User,
    color: 'purple'
  },
  pathology: {
    room: 'Room 04',
    nameEn: 'Pathology & Blood Testing',
    nameHi: 'पैथोलॉजी व खून जांच केंद्र',
    doctorEn: 'Suresh Kumar (Senior Lab Tech)',
    doctorHi: 'सुरेश कुमार (वरिष्ठ लैब तकनीशियन)',
    routeEn: 'Left Wing Corridor → Room 04 (Next to Medicine Store)',
    routeHi: 'बायां गलियारा → कमरा नं. 04 (दवा केंद्र के पास)',
    icon: Activity,
    color: 'rose'
  },
  xray: {
    room: 'Room 07',
    nameEn: 'Digital X-Ray & Radiology',
    nameHi: 'डिजिटल एक्स-रे केंद्र',
    doctorEn: 'Rameshwar Lal (Senior Radiographer)',
    doctorHi: 'रामेश्वर लाल (रेडियोग्राफर)',
    routeEn: 'Right Wing Corridor → Room 07 (Opposite Sonography)',
    routeHi: 'दायां गलियारा → कमरा नं. 07 (सोनोग्राफी के सामने)',
    icon: ScanLine,
    color: 'indigo'
  },
  usg: {
    room: 'Room 11',
    nameEn: 'Sonography & Ultrasound (USG)',
    nameHi: 'सोनोग्राफी एवं अल्ट्रासाउंड केंद्र',
    doctorEn: 'Dr. Anita Bishnoi (Consultant Sonologist)',
    doctorHi: 'डॉ. अनिता विश्नोई (सोनोलॉजिस्ट)',
    routeEn: 'Right Wing Corridor → Room 11 (Ultrasound Wing)',
    routeHi: 'दायां गलियारा → कमरा नं. 11 (सोनोग्राफी विंग)',
    icon: Layers,
    color: 'purple'
  },
  ddc: {
    room: 'Room 05',
    nameEn: 'Free Medicine Distribution (DDC)',
    nameHi: 'निःशुल्क दवा वितरण केंद्र (DDC)',
    doctorEn: 'MNDY Pharmacist Counter',
    doctorHi: 'एमएनडीवाई फार्मासिस्ट काउंटर',
    routeEn: 'Main Waiting Courtyard → Room 05 Counter',
    routeHi: 'मुख्य वेटिंग परिसर → कमरा नं. 05 काउंटर',
    icon: Pill,
    color: 'amber'
  }
};

export default function PublicMobileQueueTracker() {
  const [lang, setLang] = useState('en');
  const t = TRACKER_TRANSLATIONS[lang];

  // Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedRecord, setSearchedRecord] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fallback Master Queue + Live Firestore Sync
  const [tokensList, setTokensList] = useState([
    { id: 'T-101', tokenNumber: 'OPD-101', parchiCode: '619283', patientName: 'Mohan Lal Paliwal', departmentId: 'opd', status: 'in-room', timeStr: '09:20 AM' },
    { id: 'T-102', tokenNumber: 'OPD-102', parchiCode: '782190', patientName: 'Kailash Chand Verma', departmentId: 'opd', status: 'in-room', timeStr: '09:22 AM' },
    { id: 'T-103', tokenNumber: 'OPD-103', parchiCode: '318742', patientName: 'Bhanwar Lal Soni', departmentId: 'opd', status: 'in-room', timeStr: '09:25 AM' },
    { id: 'T-104', tokenNumber: 'OPD-104', parchiCode: '492104', patientName: 'Ghewar Ram Meghwal', departmentId: 'opd', status: 'waiting', timeStr: '09:28 AM' },
    { id: 'T-105', tokenNumber: 'OPD-105', parchiCode: '581920', patientName: 'Prem Devi Paliwal', departmentId: 'opd', status: 'waiting', timeStr: '09:30 AM' },
    { id: 'T-106', tokenNumber: 'OPD-106', parchiCode: '918230', patientName: 'Shaitan Singh', departmentId: 'opd', status: 'waiting', timeStr: '09:35 AM' },
    { id: 'T-401', tokenNumber: 'BLD-104', parchiCode: '104829', patientName: 'Kalyan Singh Jodha', departmentId: 'pathology', status: 'in-room', timeStr: '09:10 AM' },
    { id: 'T-402', tokenNumber: 'BLD-105', parchiCode: '209381', patientName: 'Geeta Devi Bishnoi', departmentId: 'pathology', status: 'waiting', timeStr: '09:15 AM' },
    { id: 'T-701', tokenNumber: 'XRY-201', parchiCode: '409182', patientName: 'Ramprasad Bishnoi', departmentId: 'xray', status: 'in-room', timeStr: '09:00 AM' },
    { id: 'T-702', tokenNumber: 'XRY-202', parchiCode: '118290', patientName: 'Kavita Kanwar', departmentId: 'xray', status: 'waiting', timeStr: '09:25 AM' },
    { id: 'T-111', tokenNumber: 'USG-301', parchiCode: '581921', patientName: 'Suman Choudhary', departmentId: 'usg', status: 'in-room', timeStr: '09:15 AM' },
    { id: 'T-112', tokenNumber: 'USG-302', parchiCode: '992143', patientName: 'Santosh Meena', departmentId: 'usg', status: 'waiting', timeStr: '09:35 AM' }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'tokens'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveTokens = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setTokensList(liveTokens);
        }
      }, (err) => console.warn('Tracker sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active on Tracker:', err);
    }
  }, []);

  // Search Handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    const cleanTerm = searchQuery.trim().toLowerCase();

    const match = tokensList.find(t => 
      t.tokenNumber?.toLowerCase().includes(cleanTerm) ||
      t.parchiCode?.toLowerCase().includes(cleanTerm)
    );

    setSearchedRecord(match || null);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchedRecord(null);
    setHasSearched(false);
  };

  // Compute Live Queue Metrics for the searched patient
  const patientMetrics = useMemo(() => {
    if (!searchedRecord) return null;

    const deptId = searchedRecord.departmentId === 'blood' ? 'pathology' : searchedRecord.departmentId;
    const deptInfo = DEPARTMENT_DIRECTORY[deptId] || DEPARTMENT_DIRECTORY.opd;

    // Filter department tokens
    const deptTokens = tokensList.filter(t => 
      t.departmentId === deptId || (deptId === 'pathology' && t.departmentId === 'blood')
    );

    // Active in-room batch
    const inRoomTokens = deptTokens.filter(t => t.status === 'in-room');
    const waitingTokens = deptTokens.filter(t => t.status === 'waiting');

    // In-room batch string (e.g. "OPD-101 – OPD-105")
    let activeBatchString = 'No Active Batch';
    if (inRoomTokens.length > 0) {
      const first = inRoomTokens[0].tokenNumber;
      const last = inRoomTokens[inRoomTokens.length - 1].tokenNumber;
      activeBatchString = inRoomTokens.length === 1 ? first : `${first} – ${last}`;
    }

    // Number of patients ahead of this patient
    let aheadCount = 0;
    if (searchedRecord.status === 'waiting') {
      const myIndex = waitingTokens.findIndex(t => t.id === searchedRecord.id);
      aheadCount = myIndex >= 0 ? inRoomTokens.length + myIndex : inRoomTokens.length;
    }

    // Estimated Wait Time (avg 2 mins per OPD patient, 4 mins for lab/xray)
    const multiplier = (deptId === 'opd' || deptId === 'pediatrics') ? 2 : 4;
    const estimatedMinutes = Math.max(1, aheadCount * multiplier);

    return {
      deptInfo,
      activeBatchString,
      aheadCount,
      estimatedMinutes,
      inRoomTokens
    };
  }, [searchedRecord, tokensList]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-100 overflow-x-hidden font-sans">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs w-full">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <Link 
              href="/" 
              className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-xs hover:bg-sky-700 transition shrink-0"
              title="Home"
            >
              <Building2 className="w-5 h-5" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {t.headerTitle}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">
                {t.headerSub}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Body Content */}
      <main className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 flex-1 pb-20 overflow-x-hidden">
        
        {/* Search Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block">
              POKARAN LIVE PATIENT SERVICE
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {t.searchTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.searchSub}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 min-h-[42px] bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>{t.trackBtn}</span>
              </button>

              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-[42px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  {t.clearBtn}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= PATIENT RESULT CARD ================= */}
        {searchedRecord && patientMetrics && (
          <div className="space-y-3 animate-in fade-in-50 duration-200">
            
            {/* Status Alert Banner */}
            {searchedRecord.status === 'in-room' && (
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-emerald-400 animate-pulse">
                <div className="flex items-start gap-3">
                  <BellRing className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-base font-black leading-tight">
                      {t.statusInsideTitle}
                    </h3>
                    <p className="text-xs text-emerald-50 font-medium mt-1">
                      {t.statusInsideSub}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {searchedRecord.status === 'waiting' && (
              <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-sm border border-amber-400">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black leading-tight">
                      {t.statusWaitingTitle}
                    </h3>
                    <p className="text-xs text-amber-950 font-medium mt-0.5">
                      {t.statusWaitingSub}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {searchedRecord.status === 'completed' && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-emerald-400">
                      {t.statusDoneTitle}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {t.statusDoneSub}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Metric Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
              
              {/* Token & Patient Strip */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-12 w-16 sm:w-20 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-mono font-black text-sm sm:text-base shrink-0 shadow-xs">
                    {searchedRecord.tokenNumber}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {searchedRecord.patientName}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      Parchi Code: <strong className="text-slate-700 font-mono">{searchedRecord.parchiCode}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                    searchedRecord.status === 'in-room'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedRecord.status === 'waiting'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    ● {searchedRecord.status === 'in-room' ? 'In Room' : searchedRecord.status === 'waiting' ? 'In Queue' : 'Done'}
                  </span>
                </div>
              </div>

              {/* 2-Box Live Queue Snapshot */}
              {searchedRecord.status === 'waiting' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.patientsAhead}
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {patientMetrics.aheadCount} <span className="text-xs text-slate-500 font-semibold">Patients</span>
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-center">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                      {t.estWaitTime}
                    </span>
                    <div className="text-2xl font-black text-sky-900 mt-1">
                      ~{patientMetrics.estimatedMinutes} <span className="text-xs text-sky-700 font-semibold">Mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Room & Doctor Reporting Info */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Building2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.roomLocation}</span>
                    <strong className="text-sm font-black text-slate-900 block">
                      {patientMetrics.deptInfo.room} : {lang === 'en' ? patientMetrics.deptInfo.nameEn : patientMetrics.deptInfo.nameHi}
                    </strong>
                    <span className="text-slate-600 font-medium">
                      {lang === 'en' ? patientMetrics.deptInfo.doctorEn : patientMetrics.deptInfo.doctorHi}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.campusRoute}</span>
                    <span className="text-slate-700 font-bold block">
                      {lang === 'en' ? patientMetrics.deptInfo.routeEn : patientMetrics.deptInfo.routeHi}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Not Found State */}
        {hasSearched && !searchedRecord && (
          <div className="p-6 bg-white rounded-2xl border border-rose-200 text-center shadow-xs space-y-1.5 animate-in fade-in-50">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
            <h3 className="text-sm font-black text-slate-900">{t.notFoundTitle}</h3>
            <p className="text-xs text-slate-500">{t.notFoundSub}</p>
          </div>
        )}

        {/* ================= ALL DEPARTMENTS LIVE GLANCE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              {t.browseAllDepts}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {t.browseSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(DEPARTMENT_DIRECTORY).map(([key, dept]) => {
              const DeptIcon = dept.icon;

              // In-room tokens for this department
              const runningTokens = tokensList.filter(t => 
                (t.departmentId === key || (key === 'pathology' && t.departmentId === 'blood')) && 
                t.status === 'in-room'
              );

              // Waiting tokens
              const waitingCount = tokensList.filter(t => 
                (t.departmentId === key || (key === 'pathology' && t.departmentId === 'blood')) && 
                t.status === 'waiting'
              ).length;

              const runningText = runningTokens.length > 0 
                ? runningTokens.map(r => r.tokenNumber).join(', ') 
                : 'Free';

              return (
                <div 
                  key={key}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      <DeptIcon className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-slate-900">{dept.room}</span>
                        <span className="text-[11px] font-bold text-slate-700 truncate">{lang === 'en' ? dept.nameEn : dept.nameHi}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block truncate">
                        {t.roomRunningNow}: <strong className="text-emerald-700 font-mono">{runningText}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                    {waitingCount} {t.waitingCountLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2.5 text-center text-[10px] text-slate-400 font-semibold">
        {t.footerText}
      </footer>

    </div>
  );
}