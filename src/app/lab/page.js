'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Activity, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Search, 
  FileCheck, 
  FileText, 
  Share2, 
  X, 
  Check, 
  Languages,
  Building2
} from 'lucide-react';

// Import Pamphlet Generator Component
import LabReportGenerator from '../../components/LabReportGenerator';

// ==============================================================
// MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const LAB_TRANSLATIONS = {
  en: {
    roomTitle: 'Room 04 : Pathology & Blood Testing',
    hospitalSub: 'Govt. Hospital Pokaran • Incharge: Suresh Kumar (Sr. Tech)',
    verifiedBadge: 'Open Terminal',
    micActive: 'Mic On',
    backHome: 'Back to Portal',
    liveStatus: 'Live Queue Status',
    waitingCount: 'Patients Waiting:',
    searchPlaceholder: 'Search Token, Parchi or Name...',
    queueHeader: 'Blood Test Queue',
    liveBadge: 'Room 04 Live',
    emptyQueue: 'No patients waiting in queue.',
    emptySub: 'Tokens will appear here in real-time once generated.',
    parchi: 'Parchi',
    time: 'Time',
    statusWaiting: 'Waiting',
    statusInRoom: 'In Room',
    statusCompleted: 'Done',
    btnCall: 'Call',
    btnRecall: 'Recall',
    btnPamphlet: 'Pamphlet',
    btnQuickEntry: 'Quick Entry',
    btnEdit: 'Edit',
    btnWhatsApp: 'WhatsApp',
    modalTitle: 'Quick Blood Diagnostic Entry',
    timeSaving: 'Quick Fill:',
    fillNormal: '⚡ Set Normal Values',
    paramHb: '1. Hemoglobin (Hb)',
    paramTlc: '2. TLC / Infection',
    paramPlatelets: '3. Platelets (Lakh)',
    paramSugar: '4. Random Blood Sugar',
    normalRange: 'Normal',
    clinicalNotes: 'Clinical Remarks / Doctor Notes',
    submitReport: 'Publish Report & Complete Token',
    footerText: 'Government Hospital Pokaran • Room 04 Pathology Terminal • Webnexa Health'
  },
  hi: {
    roomTitle: 'कमरा नं. 04 : पैथोलॉजी एवं खून जांच',
    hospitalSub: 'राजकीय अस्पताल पोकरण • प्रभारी: सुरेश कुमार (वरिष्ठ तकनीशियन)',
    verifiedBadge: 'खुला टर्मिनल',
    micActive: 'माइक चालू',
    backHome: 'मुख्य पोर्टल',
    liveStatus: 'लाइव कतार स्थिति',
    waitingCount: 'प्रतीक्षारत मरीज:',
    searchPlaceholder: 'टोकन, पर्ची या मरीज खोजें...',
    queueHeader: 'खून जांच कतार सूची',
    liveBadge: 'कमरा 04 लाइव',
    emptyQueue: 'अभी कोई मरीज कतार में नहीं है।',
    emptySub: 'कियोस्क से टोकन बनते ही यहाँ स्वतः आ जाएगा।',
    parchi: 'पर्ची',
    time: 'समय',
    statusWaiting: 'कतार में',
    statusInRoom: 'कमरे में',
    statusCompleted: 'पूर्ण',
    btnCall: 'बुलाएं',
    btnRecall: 'पुनः बुलाएं',
    btnPamphlet: 'पैम्फलेट',
    btnQuickEntry: 'त्वरित एंट्री',
    btnEdit: 'एडिट',
    btnWhatsApp: 'WhatsApp',
    modalTitle: 'पैथोलॉजी त्वरित जांच प्रविष्टि',
    timeSaving: 'समय बचाने हेतु:',
    fillNormal: '⚡ सामान्य मान भरें',
    paramHb: '1. हीमोग्लोबिन (Hb)',
    paramTlc: '2. टीएलसी (इन्फेक्शन)',
    paramPlatelets: '3. प्लेटलेट्स (लाख)',
    paramSugar: '4. रैंडम ब्लड शुगर',
    normalRange: 'सामान्य',
    clinicalNotes: 'डॉक्टर हेतु क्लिनिकल टिप्पणी',
    submitReport: 'रिपोर्ट जारी करें एवं टोकन पूर्ण करें',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • कमरा नं. 04 पैथोलॉजी लैब टर्मिनल • Webnexa Health'
  }
};

export default function PathologyLabConsole() {
  // 1. Language Toggle State (Default: English)
  const [lang, setLang] = useState('en');
  const t = LAB_TRANSLATIONS[lang];

  // 2. Hydration Mounting Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Queue & UI State (Directly Accessible Without PIN)
  const [searchFilter, setSearchFilter] = useState('');
  const [isCallingAudio, setIsCallingAudio] = useState(false);
  const [activeReportPatient, setActiveReportPatient] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // 4. Pamphlet Modal Overlay State
  const [showPamphlet, setShowPamphlet] = useState(false);
  const [pamphletPatient, setPamphletPatient] = useState(null);

  // 5. Blood Test Parameters Form
  const [testCategory, setTestCategory] = useState('cbc');
  const [valHb, setValHb] = useState('12.5');
  const [valTlc, setValTlc] = useState('7400');
  const [valPlatelets, setValPlatelets] = useState('2.4');
  const [valSugar, setValSugar] = useState('105');
  const [valRapidKit, setValRapidKit] = useState('Negative');
  const [valRemarks, setValRemarks] = useState('Test results within normal biological reference limits.');

  // Dedicated Pathology Queue List (Local Fallback + Firestore Sync)
  const [pathologyQueue, setPathologyQueue] = useState([
    {
      id: 'BLD-D1',
      tokenNumber: 'BLD-104',
      trackingCode: 'PKR-89214',
      parchiCode: '104829',
      patientName: 'Kalyan Singh Jodha',
      mobile: '9829012345',
      status: 'in-room',
      timeStr: '08:45 AM',
      reportData: null
    },
    {
      id: 'BLD-D2',
      tokenNumber: 'BLD-105',
      trackingCode: 'PKR-43110',
      parchiCode: '209381',
      patientName: 'Geeta Devi Bishnoi',
      mobile: '9414098765',
      status: 'waiting',
      timeStr: '09:05 AM',
      reportData: null
    },
    {
      id: 'BLD-D3',
      tokenNumber: 'BLD-106',
      trackingCode: 'PKR-77291',
      parchiCode: '318742',
      patientName: 'Mohan Lal Paliwal',
      mobile: '9928345678',
      status: 'waiting',
      timeStr: '09:20 AM',
      reportData: null
    }
  ]);

  // Real-time Firestore Sync (Runs directly without requiring authentication)
  useEffect(() => {
    if (!db) return;

    try {
      const q = query(
        collection(db, 'tokens'),
        where('departmentId', 'in', ['pathology', 'blood'])
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveTokens = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setPathologyQueue(liveTokens);
        }
      }, (err) => console.warn('Firestore sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active:', err);
    }
  }, []);

  // Filter Search
  const filteredQueue = useMemo(() => {
    return pathologyQueue.filter(item => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        item.patientName?.toLowerCase().includes(q) ||
        item.tokenNumber?.toLowerCase().includes(q) ||
        item.parchiCode?.includes(q) ||
        item.mobile?.includes(q)
      );
    });
  }, [pathologyQueue, searchFilter]);

  // Audio Loudspeaker Calling
  const callPatient = useCallback((patient) => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsCallingAudio(true);

      const message = lang === 'en'
        ? `Token Number ${patient.tokenNumber}. Patient ${patient.patientName}. Please proceed to Room Number 04 Pathology Lab.`
        : `टोकन नंबर ${patient.tokenNumber}। मरीज ${patient.patientName}। कृपया खून जांच के लिए तुरंत कमरा नंबर 04 पैथोलॉजी लैब में पधारें।`;
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;

      utterance.onend = () => setIsCallingAudio(false);
      utterance.onerror = () => setIsCallingAudio(false);

      window.speechSynthesis.speak(utterance);
    }

    setPathologyQueue(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'in-room' } : p));

    if (db && patient.id && !patient.id.startsWith('BLD-D')) {
      try {
        updateDoc(doc(db, 'tokens', patient.id), {
          status: 'in-room',
          calledAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Status update warning:', err);
      }
    }
  }, [lang]);

  // Quick Preset Normal Readings
  const setNormalPresets = () => {
    setValHb('13.2');
    setValTlc('6800');
    setValPlatelets('2.6');
    setValSugar('98');
    setValRapidKit('Negative');
    setValRemarks(lang === 'en' ? 'All values within normal biological reference limits.' : 'सभी जांच मान सामान्य सीमा में हैं।');
  };

  // Open Quick Modal Form
  const handleOpenForm = (patient) => {
    setActiveReportPatient(patient);
    if (patient.reportData) {
      setValHb(patient.reportData.hb || '12.5');
      setValTlc(patient.reportData.tlc || '7400');
      setValPlatelets(patient.reportData.platelets || '2.4');
      setValSugar(patient.reportData.sugar || '105');
      setValRemarks(patient.reportData.remarks || (lang === 'en' ? 'Normal biological limits.' : 'जांच परिणाम सामान्य हैं।'));
    } else {
      setNormalPresets();
    }
  };

  // Publish / Save Report
  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!activeReportPatient) return;

    setIsPublishing(true);

    const reportData = {
      testCategory,
      hb: `${valHb} g/dL`,
      tlc: `${valTlc} /cumm`,
      platelets: `${valPlatelets} Lakh`,
      sugar: `${valSugar} mg/dL`,
      rapidKit: valRapidKit,
      remarks: valRemarks,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      labTechnician: 'Suresh Kumar (Sr. Lab Technician, Pokaran)'
    };

    setPathologyQueue(prev => prev.map(p => {
      if (p.id === activeReportPatient.id) {
        return {
          ...p,
          status: 'completed',
          reportData
        };
      }
      return p;
    }));

    if (db && activeReportPatient.id && !activeReportPatient.id.startsWith('BLD-D')) {
      try {
        await updateDoc(doc(db, 'tokens', activeReportPatient.id), {
          status: 'completed',
          reportData,
          completedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Report write fallback:', err);
      }
    }

    setIsPublishing(false);
    setActiveReportPatient(null);
  };

  // Direct WhatsApp Report Link
  const handleSendWhatsApp = (patient) => {
    const rep = patient.reportData;
    if (!rep) return;

    const cleanPhone = patient.mobile.replace(/\D/g, '');
    const mobileNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = encodeURIComponent(
      `*Govt. Hospital, Pokaran*\n` +
      `*Pathology Investigation Report (Room 04)*\n\n` +
      `Patient: *${patient.patientName}*\n` +
      `Parchi: *${patient.parchiCode}* | Token: *${patient.tokenNumber}*\n\n` +
      `📋 *Results:*\n` +
      `• Hemoglobin (Hb): ${rep.hb}\n` +
      `• TLC (Infection): ${rep.tlc}\n` +
      `• Platelets Count: ${rep.platelets}\n` +
      `• Blood Sugar: ${rep.sugar}\n\n` +
      `🔍 *Notes:* ${rep.remarks}\n` +
      `Verified by: ${rep.labTechnician}\n\n` +
      `🏥 _Official digital report generated by Hospital Smart OS._`
    );

    window.open(`https://wa.me/${mobileNumber}?text=${message}`, '_blank');
  };

  // Hydration Guard
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= DIRECT UNLOCKED LAB CONSOLE =================
  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-rose-100 overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5">
          
          {/* Left: Department Identity */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {t.roomTitle}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black shrink-0 hidden xs:inline">
                  {t.verifiedBadge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate hidden md:block">
                {t.hospitalSub}
              </p>
            </div>
          </div>

          {/* Right: Language Switcher + Mic + Home Link */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {isCallingAudio && (
              <div className="flex items-center gap-1 px-1.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[9px] sm:text-[10px] font-black animate-pulse">
                <Volume2 className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="hidden sm:inline">{t.micActive}</span>
              </div>
            )}

            <Link
              href="/"
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1"
              title={t.backHome}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">{t.backHome}</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3 flex-1 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* Live Stats & Search Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">{t.liveStatus}</span>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900">
                {t.waitingCount} {pathologyQueue.filter(p => p.status === 'waiting').length}
              </h3>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg sm:rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

        </div>

        {/* Patients Queue List Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-2.5 sm:p-3.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
              <span>{t.queueHeader} ({filteredQueue.length})</span>
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold shrink-0">
              {t.liveBadge}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredQueue.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="font-bold text-xs sm:text-sm">{t.emptyQueue}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.emptySub}</p>
              </div>
            ) : (
              filteredQueue.map((patient) => {
                const isWaiting = patient.status === 'waiting';
                const isInRoom = patient.status === 'in-room';
                const isCompleted = patient.status === 'completed';

                return (
                  <div 
                    key={patient.id}
                    className={`p-2.5 sm:p-3.5 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                      isInRoom ? 'bg-amber-50/60' : isCompleted ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Patient Information Box */}
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="h-10 w-14 sm:h-12 sm:w-16 bg-slate-900 text-amber-400 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-xs px-1 shadow-2xs shrink-0 select-none">
                        {patient.tokenNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                            {patient.patientName}
                          </h5>
                          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded shrink-0">
                            {t.parchi}: {patient.parchiCode}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-700 rounded shrink-0 hidden xs:inline">
                            {patient.trackingCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5 flex-wrap">
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Phone className="w-2.5 h-2.5 text-slate-400" />
                            {patient.mobile}
                          </span>
                          <span className="shrink-0">• {patient.timeStr}</span>
                          <span className={`font-bold px-1.5 py-0.2 rounded-full text-[9px] shrink-0 ${
                            isWaiting 
                              ? 'bg-amber-100 text-amber-800' 
                              : isInRoom 
                              ? 'bg-sky-100 text-sky-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            ● {isWaiting ? t.statusWaiting : isInRoom ? t.statusInRoom : t.statusCompleted}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-0">
                      
                      <button
                        type="button"
                        onClick={() => callPatient(patient)}
                        className="min-h-[34px] sm:min-h-[36px] px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isInRoom ? t.btnRecall : t.btnCall}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPamphletPatient(patient);
                          setShowPamphlet(true);
                        }}
                        className="min-h-[34px] sm:min-h-[36px] px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95"
                        title={t.btnPamphlet}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.btnPamphlet}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenForm(patient)}
                        className={`min-h-[34px] sm:min-h-[36px] px-2.5 py-1 text-white font-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95 ${
                          isCompleted ? 'bg-slate-700 hover:bg-slate-800' : 'bg-rose-600 hover:bg-rose-700'
                        } ${!isCompleted ? 'col-span-2 sm:col-auto' : ''}`}
                      >
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{isCompleted ? t.btnEdit : t.btnQuickEntry}</span>
                      </button>

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(patient)}
                          className="min-h-[34px] sm:min-h-[36px] px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95"
                          title="WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.btnWhatsApp}</span>
                        </button>
                      )}

                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 font-semibold hidden sm:block">
        {t.footerText}
      </footer>

      {/* ================= MODAL: QUICK BLOOD DIAGNOSTIC ENTRY ================= */}
      {activeReportPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setActiveReportPatient(null)}
              className="absolute top-3 right-3 min-h-[32px] min-w-[32px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2 pr-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                {t.modalTitle}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                {activeReportPatient.patientName} ({activeReportPatient.tokenNumber})
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold">
                {t.parchi}: {activeReportPatient.parchiCode} • +91 {activeReportPatient.mobile}
              </p>
            </div>

            <form onSubmit={handleSaveReport} className="mt-3 space-y-3">
              
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600">
                  {t.timeSaving}
                </span>
                <button
                  type="button"
                  onClick={setNormalPresets}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-black shadow-2xs transition"
                >
                  {t.fillNormal}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.paramHb}
                  </label>
                  <input
                    type="text"
                    value={valHb}
                    onChange={(e) => setValHb(e.target.value)}
                    placeholder="12.5"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[9px] text-slate-400">{t.normalRange}: 12 - 16 g/dL</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.paramTlc}
                  </label>
                  <input
                    type="text"
                    value={valTlc}
                    onChange={(e) => setValTlc(e.target.value)}
                    placeholder="7400"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[9px] text-slate-400">{t.normalRange}: 4,000 - 11,000</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.paramPlatelets}
                  </label>
                  <input
                    type="text"
                    value={valPlatelets}
                    onChange={(e) => setValPlatelets(e.target.value)}
                    placeholder="2.4"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[9px] text-slate-400">{t.normalRange}: 1.5 - 4.5 Lakh</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.paramSugar}
                  </label>
                  <input
                    type="text"
                    value={valSugar}
                    onChange={(e) => setValSugar(e.target.value)}
                    placeholder="105"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[9px] text-slate-400">{t.normalRange}: 70 - 140 mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.clinicalNotes}
                </label>
                <textarea
                  rows={2}
                  value={valRemarks}
                  onChange={(e) => setValRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full min-h-[42px] py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                {isPublishing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.submitReport}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN PAMPHLET GENERATOR OVERLAY ================= */}
      {showPamphlet && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
          <LabReportGenerator 
            initialPatient={pamphletPatient}
            onClose={() => setShowPamphlet(false)}
          />
        </div>
      )}

    </div>
  );
}