'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Tv, 
  Activity, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Clock, 
  ArrowLeft, 
  Languages, 
  Building2, 
  Flame, 
  Megaphone,
  Stethoscope,
  ScanLine,
  Layers,
  Sparkles,
  PhoneCall,
  Search,
  Users,
  Baby,
  Pill,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

// ==============================================================
// 1. MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const DISPLAY_TRANSLATIONS = {
  en: {
    hospitalTitle: 'GOVERNMENT SUB-DISTRICT HOSPITAL, POKARAN',
    subTitle: 'Live Queue & Token Display • TV Screen & Public Mobile Portal',
    searchPlaceholder: 'Check Your Token / Parchi (e.g. 104, 619283)...',
    searchBtn: 'Find Room',
    myTokenResultTitle: 'Your Appointment Status:',
    tokenFoundMsg: 'Please report to',
    batchServing: 'NOW SERVING BATCH (5 PATIENTS)',
    benchNotice: 'Tokens sitting inside chamber bench:',
    upNextBatch: 'UP NEXT BATCH (BE READY)',
    noActiveBatch: 'NO ACTIVE PATIENT BATCH',
    queueEmpty: 'Waiting queue is clear',
    fullscreen: 'Fullscreen TV',
    soundOn: 'Audio Chime ON',
    soundOff: 'Audio Muted',
    allDepartments: 'All Rooms',
    emergencyTicker: 'HOSPITAL NOTICE:',
    tickerMessage: 'Welcome to Govt. Hospital Pokaran • 24x7 Emergency Trauma Unit & Free 108 Ambulance • MNJY Free Tests & MNDY Free Medicines available in Room 05 • Maintain cleanliness & silence in hospital.',
    backBtn: 'Portal',
    doctorLabel: 'Doctor / Incharge',
    specialtyLabel: 'Specialty & Treatment'
  },
  hi: {
    hospitalTitle: 'राजकीय सामान्य चिकित्सालय, पोकरण (जैसलमेर)',
    subTitle: 'लाइव मरीज कतार एवं टोकन डिस्प्ले • टीवी स्क्रीन व पब्लिक मोबाइल पोर्टल',
    searchPlaceholder: 'अपना टोकन या पर्ची नंबर खोजें (उदा. 104, 619283)...',
    searchBtn: 'कमरा देखें',
    myTokenResultTitle: 'आपकी कतार व कमरे की स्थिति:',
    tokenFoundMsg: 'कृपया तुरंत उपस्थित हों:',
    batchServing: 'वर्तमान सक्रिय बैच (5 मरीज अंदर)',
    benchNotice: 'कक्ष के अंदर बेंच पर उपस्थित टोकन:',
    upNextBatch: 'अगला तैयार बैच (Next Batch)',
    noActiveBatch: 'अभी कोई सक्रिय बैच नहीं है',
    queueEmpty: 'कतार पूरी तरह रिक्त है',
    fullscreen: 'फुल-स्क्रीन टीवी',
    soundOn: 'ऑडियो उद्घोषणा चालू',
    soundOff: 'ऑडियो म्यूट',
    allDepartments: 'सभी कक्ष',
    emergencyTicker: 'अस्पताल आवश्यक सूचना:',
    tickerMessage: 'राजकीय सामान्य चिकित्सालय पोकरण में आपका स्वागत है • 24 घंटे आपातकालीन ट्रॉमा वार्ड 00 व 108 एम्बुलेंस सेवा उपलब्ध • मुख्यमंत्री निःशुल्क जांच (कमरा 04) व निःशुल्क दवा (कमरा 05) का लाभ लें • परिसर में स्वच्छता बनाए रखें।',
    backBtn: 'पोर्टल',
    doctorLabel: 'चिकित्सक / प्रभारी',
    specialtyLabel: 'उपचार व विशेषज्ञता'
  }
};

// ==============================================================
// 2. CORE HOSPITAL ROOMS & DOCTORS DIRECTORY (WITH BATCH LOGIC)
// ==============================================================
const HOSPITAL_ROOMS = [
  {
    deptId: 'opd',
    roomNumber: 'Room 01',
    nameEn: 'General Medicine OPD',
    nameHi: 'सामान्य चिकित्सा ओपीडी',
    doctorEn: 'Dr. S. K. Sharma (MD Physician)',
    doctorHi: 'डॉ. एस. के. शर्मा (वरिष्ठ फिजिशियन)',
    specialtyEn: 'Fever, Cough, Diabetes, BP, Viral Illness',
    specialtyHi: 'बुखार, जुकाम, बीपी, शुगर व सामान्य परामर्श',
    color: 'emerald',
    icon: Stethoscope,
    prefix: 'OPD'
  },
  {
    deptId: 'pediatrics',
    roomNumber: 'Room 06',
    nameEn: 'Pediatrics & Child Care',
    nameHi: 'शिशु एवं बाल रोग विभाग',
    doctorEn: 'Dr. Vikram Choudhary (Pediatrician)',
    doctorHi: 'डॉ. विक्रम चौधरी (बच्चों के डॉक्टर)',
    specialtyEn: 'Newborn, Infant care, Child Vaccination',
    specialtyHi: 'बच्चों का स्वास्थ्य, टीकाकरण व शिशु रोग',
    color: 'sky',
    icon: Baby,
    prefix: 'PED'
  },
  {
    deptId: 'pathology',
    roomNumber: 'Room 04',
    nameEn: 'Pathology & Blood Testing',
    nameHi: 'पैथोलॉजी व खून जांच केंद्र',
    doctorEn: 'Suresh Kumar (Sr. Lab Technician)',
    doctorHi: 'सुरेश कुमार (वरिष्ठ लैब तकनीशियन)',
    specialtyEn: 'CBC, Sugar, LFT, KFT, Dengue, Malaria',
    specialtyHi: 'सीबीसी, शुगर, केएफटी, एलएफटी, डेंगू, मलेरिया जांच',
    color: 'rose',
    icon: Activity,
    prefix: 'BLD'
  },
  {
    deptId: 'xray',
    roomNumber: 'Room 07',
    nameEn: 'Digital X-Ray & Radiology',
    nameHi: 'डिजिटल एक्स-रे केंद्र',
    doctorEn: 'Rameshwar Lal (Senior Radiographer)',
    doctorHi: 'रामेश्वर लाल (रेडियोग्राफर)',
    specialtyEn: 'Chest PA, Bone Fracture, Spine X-Ray',
    specialtyHi: 'छाती, हड्डी, फ्रैक्चर व रीढ़ की हड्डी जांच',
    color: 'indigo',
    icon: ScanLine,
    prefix: 'XRY'
  },
  {
    deptId: 'usg',
    roomNumber: 'Room 11',
    nameEn: 'Sonography & Ultrasound (USG)',
    nameHi: 'सोनोग्राफी एवं अल्ट्रासाउंड केंद्र',
    doctorEn: 'Dr. Anita Bishnoi (Sonologist)',
    doctorHi: 'डॉ. अनिता विश्नोई (स्त्री रोग व सोनोलॉजिस्ट)',
    specialtyEn: 'Abdomen, Pelvis, Pregnancy ANC Scan',
    specialtyHi: 'पेट, पथरी, प्रसव पूर्व गर्भावस्‍था सोनोग्राफी',
    color: 'purple',
    icon: Layers,
    prefix: 'USG'
  },
  {
    deptId: 'ddc',
    roomNumber: 'Room 05',
    nameEn: 'Free Medicine Distribution (DDC)',
    nameHi: 'निःशुल्क दवा वितरण केंद्र (DDC)',
    doctorEn: 'Pharmacist Counter',
    doctorHi: 'फार्मासिस्ट काउंटर',
    specialtyEn: 'Free Govt Medicines (MNDY Scheme)',
    specialtyHi: 'मुख्यमंत्री निःशुल्क दवा वितरण (MNDY)',
    color: 'amber',
    icon: Pill,
    prefix: 'MED'
  }
];

export default function WaitingHallDisplayScreen() {
  const [lang, setLang] = useState('en');
  const t = DISPLAY_TRANSLATIONS[lang];

  // Hydration & System States
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Patient Mobile Search State
  const [patientSearchInput, setPatientSearchInput] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);

  // Live Firestore State (with robust fallback queue)
  const [allTokens, setAllTokens] = useState([
    // Room 01 (General OPD Batch 101 to 105)
    { id: 'T-101', tokenNumber: 'OPD-101', parchiCode: '619283', patientName: 'Mohan Lal Paliwal', departmentId: 'opd', status: 'in-room', isEmergency: false },
    { id: 'T-102', tokenNumber: 'OPD-102', parchiCode: '782190', patientName: 'Kailash Chand Verma', departmentId: 'opd', status: 'in-room', isEmergency: false },
    { id: 'T-103', tokenNumber: 'OPD-103', parchiCode: '318742', patientName: 'Bhanwar Lal Soni', departmentId: 'opd', status: 'in-room', isEmergency: false },
    { id: 'T-104', tokenNumber: 'OPD-104', parchiCode: '492104', patientName: 'Ghewar Ram Meghwal', departmentId: 'opd', status: 'in-room', isEmergency: false },
    { id: 'T-105', tokenNumber: 'OPD-105', parchiCode: '581920', patientName: 'Prem Devi Paliwal', departmentId: 'opd', status: 'in-room', isEmergency: false },
    { id: 'T-106', tokenNumber: 'OPD-106', parchiCode: '918230', patientName: 'Shaitan Singh', departmentId: 'opd', status: 'waiting', isEmergency: false },
    { id: 'T-107', tokenNumber: 'OPD-107', parchiCode: '918231', patientName: 'Manohar Joshi', departmentId: 'opd', status: 'waiting', isEmergency: false },

    // Room 06 (Pediatrics Batch)
    { id: 'T-601', tokenNumber: 'PED-601', parchiCode: '109283', patientName: 'Master Aarav Singh (3 Yrs)', departmentId: 'pediatrics', status: 'in-room', isEmergency: false },
    { id: 'T-602', tokenNumber: 'PED-602', parchiCode: '109284', patientName: 'Baby Priya (8 Months)', departmentId: 'pediatrics', status: 'in-room', isEmergency: false },
    { id: 'T-603', tokenNumber: 'PED-603', parchiCode: '109285', patientName: 'Master Daksh (5 Yrs)', departmentId: 'pediatrics', status: 'waiting', isEmergency: false },

    // Room 04 (Pathology)
    { id: 'T-401', tokenNumber: 'BLD-104', parchiCode: '104829', patientName: 'Kalyan Singh Jodha', departmentId: 'pathology', status: 'in-room', isEmergency: false },
    { id: 'T-402', tokenNumber: 'BLD-105', parchiCode: '209381', patientName: 'Geeta Devi Bishnoi', departmentId: 'pathology', status: 'waiting', isEmergency: false },

    // Room 07 (Digital X-Ray)
    { id: 'T-701', tokenNumber: 'XRY-201', parchiCode: '409182', patientName: 'Ramprasad Bishnoi', departmentId: 'xray', status: 'in-room', isEmergency: true },
    { id: 'T-702', tokenNumber: 'XRY-202', parchiCode: '118290', patientName: 'Kavita Kanwar', departmentId: 'xray', status: 'waiting', isEmergency: false },

    // Room 11 (Sonography USG)
    { id: 'T-111', tokenNumber: 'USG-301', parchiCode: '581920', patientName: 'Suman Choudhary', departmentId: 'usg', status: 'in-room', isEmergency: false },
    { id: 'T-112', tokenNumber: 'USG-302', parchiCode: '992143', patientName: 'Santosh Meena', departmentId: 'usg', status: 'waiting', isEmergency: false }
  ]);

  const lastAnnouncedBatch = useRef({});

  // Clock Timer
  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'tokens'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveData = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setAllTokens(liveData);
        }
      }, (err) => console.warn('Display Sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Fallback data active on Display:', err);
    }
  }, []);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Helper: Search Token on Mobile
  const handleSearchMyToken = (e) => {
    e.preventDefault();
    if (!patientSearchInput.trim()) return;

    const term = patientSearchInput.trim().toLowerCase();
    const match = allTokens.find(t => 
      t.tokenNumber?.toLowerCase().includes(term) ||
      t.parchiCode?.toLowerCase().includes(term)
    );

    setFoundPatient(match || 'not_found');
  };

  // Helper to get room metadata for a patient
  const getRoomForDept = (deptId) => {
    return HOSPITAL_ROOMS.find(r => r.deptId === deptId || (r.deptId === 'pathology' && deptId === 'blood')) || HOSPITAL_ROOMS[0];
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div translate="no" className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between selection:bg-sky-500 overflow-x-hidden font-sans">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER WITH LIVE TV CLOCK & PATIENT SEARCH               */}
      {/* ============================================================== */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-6 py-2.5 shadow-md shrink-0 w-full">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          
          {/* Hospital Crest & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <Link 
              href="/" 
              className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition shrink-0"
              title={t.backBtn}
            >
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight text-white uppercase truncate">
                  {t.hospitalTitle}
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold truncate">
                {t.subTitle}
              </p>
            </div>
          </div>

          {/* Controls: Search Bar for Mobile + Clock + Fullscreen */}
          <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-3 flex-wrap">
            
            {/* Live TV Clock */}
            <div className="bg-slate-800/90 border border-slate-700/80 px-2.5 sm:px-3 py-1 rounded-xl text-right shrink-0">
              <div className="text-xs sm:text-sm md:text-base font-mono font-black text-amber-400 leading-tight">
                {currentTime}
              </div>
              <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {currentDate}
              </div>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] sm:min-h-[36px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black flex items-center gap-1 border border-slate-700 transition shrink-0"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`min-h-[32px] sm:min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border transition shrink-0 ${
                isAudioEnabled 
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isAudioEnabled ? t.soundOn : t.soundOff}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{isAudioEnabled ? t.soundOn : t.soundOff}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="min-h-[32px] sm:min-h-[36px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-black flex items-center gap-1 border border-slate-700 transition shrink-0"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t.fullscreen}</span>
            </button>

          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. PUBLIC MOBILE TOKEN FINDER (FOR PATIENTS ON THEIR PHONES)   */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearchMyToken} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={patientSearchInput}
                onChange={(e) => setPatientSearchInput(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              className="min-h-[36px] px-3.5 sm:px-5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-black transition shrink-0 shadow-sm"
            >
              {t.searchBtn}
            </button>
          </form>

          {/* Search Result Banner */}
          {foundPatient && foundPatient !== 'not_found' && (
            <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/50 shadow-lg animate-in fade-in-50 duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-10 w-16 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border border-amber-400/30">
                  {foundPatient.tokenNumber}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    {t.myTokenResultTitle}
                  </span>
                  <h4 className="text-sm font-black text-white truncate">
                    {foundPatient.patientName} (Parchi: {foundPatient.parchiCode})
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0">
                <span className="text-slate-400">{t.tokenFoundMsg}</span>
                <span className="font-black text-amber-400 text-sm">
                  {getRoomForDept(foundPatient.departmentId).roomNumber} ({getRoomForDept(foundPatient.departmentId).nameEn})
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  foundPatient.status === 'in-room' ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {foundPatient.status === 'in-room' ? 'Inside Bench' : 'In Queue'}
                </span>
              </div>
            </div>
          )}

          {foundPatient === 'not_found' && (
            <div className="mt-2 p-2 bg-rose-950/60 border border-rose-800/80 rounded-xl text-center text-rose-300 text-xs font-bold">
              टोकन या पर्ची नंबर नहीं मिला! कृपया कियोस्क से पर्ची चेक करें।
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN LIVE DISPLAY MATRIX: 6 SPECIALTY ROOMS WITH BATCHES    */}
      {/* ============================================================== */}
      <main className="flex-1 p-2.5 sm:p-4 md:p-6 max-w-[1920px] w-full mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full">
          
          {HOSPITAL_ROOMS.map((dept) => {
            const IconComponent = dept.icon;

            // Fetch In-Room Patients (Batch of up to 5 patients)
            const inRoomPatients = allTokens.filter(t => 
              (t.departmentId === dept.deptId || (dept.deptId === 'pathology' && t.departmentId === 'blood')) && 
              t.status === 'in-room'
            );

            // Fetch Next Waiting Batch (Next 5 patients)
            const waitingPatients = allTokens.filter(t => 
              (t.departmentId === dept.deptId || (dept.deptId === 'pathology' && t.departmentId === 'blood')) && 
              t.status === 'waiting'
            );

            const nextBatch = waitingPatients.slice(0, 5);

            // Compute Batch Range String (e.g. "101 – 105")
            let batchRangeStr = '';
            if (inRoomPatients.length > 0) {
              const first = inRoomPatients[0].tokenNumber;
              const last = inRoomPatients[inRoomPatients.length - 1].tokenNumber;
              batchRangeStr = inRoomPatients.length === 1 ? first : `${first}  ➔  ${last}`;
            }

            // Next batch string
            let nextBatchStr = '';
            if (nextBatch.length > 0) {
              const firstN = nextBatch[0].tokenNumber;
              const lastN = nextBatch[nextBatch.length - 1].tokenNumber;
              nextBatchStr = nextBatch.length === 1 ? firstN : `${firstN} – ${lastN}`;
            }

            // Color Themes
            const colorThemes = {
              emerald: {
                border: 'border-emerald-500/40',
                badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                batchBox: 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50 text-emerald-400',
                pulse: 'bg-emerald-500'
              },
              sky: {
                border: 'border-sky-500/40',
                badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                batchBox: 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-950 border-sky-500/50 text-sky-400',
                pulse: 'bg-sky-500'
              },
              rose: {
                border: 'border-rose-500/40',
                badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                batchBox: 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/50 text-rose-400',
                pulse: 'bg-rose-500'
              },
              indigo: {
                border: 'border-indigo-500/40',
                badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                batchBox: 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/50 text-indigo-400',
                pulse: 'bg-indigo-500'
              },
              purple: {
                border: 'border-purple-500/40',
                badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                batchBox: 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border-purple-500/50 text-purple-400',
                pulse: 'bg-purple-500'
              },
              amber: {
                border: 'border-amber-500/40',
                badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                batchBox: 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/50 text-amber-400',
                pulse: 'bg-amber-500'
              }
            }[dept.color];

            return (
              <div 
                key={dept.deptId}
                className={`bg-slate-900/95 rounded-2xl sm:rounded-3xl border-2 ${colorThemes.border} p-3.5 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden`}
              >
                {/* Background Glow */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${colorThemes.pulse} opacity-10 blur-3xl pointer-events-none`}></div>

                {/* Card Header: Room Number + Doctor + Specialty */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg font-mono font-black text-xs sm:text-sm bg-slate-800 text-white border border-slate-700 shadow-2xs">
                      {dept.roomNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border truncate max-w-[210px] ${colorThemes.badgeBg}`}>
                      {lang === 'en' ? dept.doctorEn : dept.doctorHi}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 min-w-0">
                    <IconComponent className="w-5 h-5 text-slate-300 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm sm:text-base font-black text-white truncate">
                        {lang === 'en' ? dept.nameEn : dept.nameHi}
                      </h2>
                      <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium truncate">
                        {lang === 'en' ? dept.specialtyEn : dept.specialtyHi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= SECTION: BATCH NOW SERVING (5 PATIENTS) ================= */}
                <div className="my-3 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colorThemes.pulse} animate-ping shrink-0`}></span>
                      <span>{t.batchServing}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {inRoomPatients.length} Active Inside
                    </span>
                  </div>

                  {inRoomPatients.length > 0 ? (
                    <div className={`p-3.5 sm:p-5 rounded-2xl border-2 ${colorThemes.batchBox} shadow-lg relative`}>
                      
                      {/* Big Batch Range Display */}
                      <div className="text-2xl sm:text-4xl md:text-4xl font-black font-mono tracking-tight text-center text-white drop-shadow-md">
                        {batchRangeStr}
                      </div>

                      {/* 5-Spot Bench Seating Matrix */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 text-center">
                          {t.benchNotice}
                        </span>

                        <div className="grid grid-cols-5 gap-1.5">
                          {[0, 1, 2, 3, 4].map((slotIdx) => {
                            const p = inRoomPatients[slotIdx];
                            const isCurrent = slotIdx === 0;

                            return (
                              <div
                                key={slotIdx}
                                className={`p-1.5 rounded-lg text-center border flex flex-col justify-between min-h-[48px] ${
                                  p 
                                    ? isCurrent
                                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                                      : 'bg-slate-800 text-white border-slate-700 font-bold'
                                    : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-600 font-medium'
                                }`}
                              >
                                <span className="text-[8px] uppercase tracking-wider block font-sans">
                                  {isCurrent ? 'Chair 1' : `Seat ${slotIdx + 1}`}
                                </span>
                                <span className="text-[11px] font-mono font-black truncate block mt-0.5">
                                  {p ? p.tokenNumber.split('-')[1] || p.tokenNumber : '--'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center min-h-[140px]">
                      <Clock className="w-8 h-8 text-slate-600 mb-1" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t.noActiveBatch}
                      </span>
                    </div>
                  )}
                </div>

                {/* ================= SECTION: UP NEXT BATCH (BE READY) ================= */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 sm:p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{t.upNextBatch}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {nextBatchStr ? nextBatchStr : t.queueEmpty}
                    </span>
                  </div>

                  {nextBatch.length > 0 ? (
                    <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
                      {nextBatch.map((wb, idx) => (
                        <span 
                          key={wb.id}
                          className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 rounded text-[10px] font-mono font-black text-slate-300 shrink-0"
                        >
                          {wb.tokenNumber}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic">
                      {t.queueEmpty}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

        </div>

      </main>

      {/* ============================================================== */}
      {/* 4. BOTTOM SCROLLING EMERGENCY TICKER                           */}
      {/* ============================================================== */}
      <footer className="bg-slate-900 border-t border-slate-800 py-2 sm:py-2.5 px-3 sm:px-6 shrink-0 flex items-center gap-2.5 w-full">
        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-black shrink-0 uppercase tracking-wider shadow-xs">
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{t.emergencyTicker}</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-marquee text-xs sm:text-sm font-bold text-slate-300 tracking-wide">
            {t.tickerMessage}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-rose-400 font-black shrink-0 px-2.5 py-1 bg-rose-950/80 rounded-lg border border-rose-800">
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span>Ambulance: 108</span>
        </div>
      </footer>

      {/* Marquee Animation Style */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 32s linear infinite;
        }
      `}</style>

    </div>
  );
}