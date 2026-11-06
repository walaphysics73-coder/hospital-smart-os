'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  LogOut, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  Filter, 
  Flame, 
  Building2, 
  Languages, 
  ChevronRight, 
  Bed, 
  FileText,
  Phone,
  RefreshCw,
  Megaphone,
  ArrowRightLeft,
  BellRing,
  Check,
  X,
  Volume2,
  Stethoscope,
  Siren
} from 'lucide-react';

// ==============================================================
// MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const ADMIN_TRANSLATIONS = {
  en: {
    portalTitle: 'Hospital Master Admin Console',
    portalSub: 'Govt. Sub-District Hospital, Pokaran • Central Surveillance',
    adminBadge: 'Super Admin',
    logout: 'Logout',
    statsTotalTokens: 'Total Tokens',
    statsWaiting: 'In Queue',
    statsEmergency: 'Emergency',
    statsCompleted: 'Completed',
    broadcastBtn: 'Public PA Announcement',
    bedStatusTitle: 'Ward & Oxygen Bed Snapshot',
    deptFilterAll: 'All Rooms',
    deptFilterLab: 'Room 04 (Lab)',
    deptFilterXray: 'Room 07 (X-Ray)',
    deptFilterUsg: 'Room 11 (USG)',
    deptFilterOpd: 'Room 01 (OPD)',
    searchPlaceholder: 'Search token, parchi, patient...',
    queueTableTitle: 'Live Cross-Department Triage',
    statusWaiting: 'Waiting',
    statusInRoom: 'In Room',
    statusCompleted: 'Done',
    actionEmergency: 'Emergency',
    actionNormal: 'Normal',
    actionTransfer: 'Transfer',
    actionComplete: 'Done',
    actionReset: 'Re-Queue',
    loginHeader: 'Master Administration Portal',
    loginSub: 'Government Sub-District Hospital, Pokaran',
    userInputLabel: 'Administrator Username',
    passInputLabel: 'Master Password',
    loginBtn: 'Authorize & Enter Console',
    backHome: 'Back to Hospital Portal',
    criticalAlertHeader: 'CRITICAL CLINICAL ALERT DETECTED',
    broadcastModalTitle: 'Hospital-Wide Loudspeaker Broadcast',
    broadcastPlaceholder: 'Enter emergency announcement for all hospital display screens...',
    sendBroadcast: 'Announce on Hospital PA',
    footerText: 'Government Hospital Pokaran • Central Surveillance OS • Webnexa'
  },
  hi: {
    portalTitle: 'केंद्रीय अस्पताल मास्टर एडमिन पोर्टल',
    portalSub: 'राजकीय सामान्य चिकित्सालय पोकरण • समग्र निगरानी व ट्राइएज',
    adminBadge: 'सुपर एडमिन',
    logout: 'लॉगआउट',
    statsTotalTokens: 'कुल टोकन',
    statsWaiting: 'कतार में',
    statsEmergency: 'इमरजेंसी',
    statsCompleted: 'उपचार पूर्ण',
    broadcastBtn: 'अस्पताल लाउडस्पीकर माइक',
    bedStatusTitle: 'वार्ड व आईसीयू बेड स्थिति',
    deptFilterAll: 'सभी कक्ष',
    deptFilterLab: 'कमरा 04 (लैब)',
    deptFilterXray: 'कमरा 07 (एक्स-रे)',
    deptFilterUsg: 'कमरा 11 (सोनोग्राफी)',
    deptFilterOpd: 'कमरा 01 (ओपीडी)',
    searchPlaceholder: 'टोकन, पर्ची या मरीज खोजें...',
    queueTableTitle: 'लाइव समग्र कतार प्रबंधन एवं ट्राइएज',
    statusWaiting: 'कतार में',
    statusInRoom: 'कक्ष में',
    statusCompleted: 'पूर्ण',
    actionEmergency: 'इमरजेंसी',
    actionNormal: 'सामान्य',
    actionTransfer: 'ट्रांसफर',
    actionComplete: 'पूर्ण',
    actionReset: 'कतार में',
    loginHeader: 'मास्टर एडमिनिस्ट्रेशन पोर्टल',
    loginSub: 'राजकीय सामान्य चिकित्सालय, पोकरण',
    userInputLabel: 'एडमिनिस्ट्रेटर यूजरनेम',
    passInputLabel: 'मास्टर सिक्योरिटी पासवर्ड',
    loginBtn: 'सत्यापित करें एवं प्रवेश करें',
    backHome: 'अस्पताल मुख्य पेज पर जाएं',
    criticalAlertHeader: 'अति-गंभीर क्लिनिकल रिपोर्ट चेतावनी',
    broadcastModalTitle: 'अस्पताल केंद्रीय लाउडस्पीकर उद्घोषणा',
    broadcastPlaceholder: 'अस्पताल के सभी कमरों व स्क्रीन पर प्रसारित करने हेतु सूचना लिखें...',
    sendBroadcast: 'लाउडस्पीकर पर प्रसारित करें',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • केंद्रीय नियंत्रण प्रणाली • Webnexa Health'
  }
};

export default function MasterAdminPortal() {
  // 1. Language Toggle (Default: English)
  const [lang, setLang] = useState('en');
  const t = ADMIN_TRANSLATIONS[lang];

  // 2. Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 4. Filtering & Search State
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 5. Unique Modal States: PA Broadcast & Transfer
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [transferPatient, setTransferPatient] = useState(null);

  // 6. Live Hospital Bed Summary Snapshot
  const [bedsData, setBedsData] = useState({
    icuAvailable: 3,
    icuTotal: 8,
    maleWardAvailable: 12,
    maleWardTotal: 30,
    femaleWardAvailable: 8,
    femaleWardTotal: 25,
    oxygenCylinders: 42
  });

  // Verify Session Storage on Mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_master_session');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login Handler via Server-side /api/auth/verify
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError(lang === 'en' ? 'Please enter username and password.' : 'कृपया यूजरनेम और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin',
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_master_session', 'true');
        setUsername('');
        setPassword('');
      } else {
        setAuthError(data.message || (lang === 'en' ? 'Invalid Admin Credentials' : 'अमान्य एडमिन क्रेडेंशियल्स'));
      }
    } catch (err) {
      setAuthError(lang === 'en' ? 'Failed to connect to authentication server.' : 'सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_master_session');
    setIsAuthenticated(false);
  };

  // 7. Global Hospital Queue State
  const [allTokens, setAllTokens] = useState([
    {
      id: 'TOK-101',
      tokenNumber: 'BLD-104',
      parchiCode: '104829',
      patientName: 'Kalyan Singh Jodha',
      mobile: '9829012345',
      departmentId: 'pathology',
      departmentName: 'Room 04 (Pathology)',
      status: 'in-room',
      isEmergency: false,
      isCriticalLab: false,
      timeStr: '08:45 AM'
    },
    {
      id: 'TOK-102',
      tokenNumber: 'XRY-201',
      parchiCode: '409182',
      patientName: 'Ramprasad Bishnoi',
      mobile: '9414022334',
      departmentId: 'xray',
      departmentName: 'Room 07 (Digital X-Ray)',
      status: 'waiting',
      isEmergency: true,
      isCriticalLab: false,
      timeStr: '09:00 AM'
    },
    {
      id: 'TOK-103',
      tokenNumber: 'BLD-105',
      parchiCode: '209381',
      patientName: 'Geeta Devi Bishnoi',
      mobile: '9414098765',
      departmentId: 'pathology',
      departmentName: 'Room 04 (Pathology)',
      status: 'waiting',
      isEmergency: false,
      isCriticalLab: true, // Unique Critical Alert Beacon
      criticalReason: 'Platelets critically low: 18,000 /cumm',
      timeStr: '09:05 AM'
    },
    {
      id: 'TOK-104',
      tokenNumber: 'USG-301',
      parchiCode: '581920',
      patientName: 'Suman Choudhary',
      mobile: '9782134560',
      departmentId: 'usg',
      departmentName: 'Room 11 (Sonography)',
      status: 'waiting',
      isEmergency: false,
      isCriticalLab: false,
      timeStr: '09:15 AM'
    },
    {
      id: 'TOK-105',
      tokenNumber: 'OPD-101',
      parchiCode: '619283',
      patientName: 'Mohan Lal Paliwal',
      mobile: '9928345678',
      departmentId: 'opd',
      departmentName: 'Room 01 (General OPD)',
      status: 'completed',
      isEmergency: false,
      isCriticalLab: false,
      timeStr: '09:20 AM'
    }
  ]);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!db || !isAuthenticated) return;

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
      }, (err) => console.warn('Admin Sync:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active:', err);
    }
  }, [isAuthenticated]);

  // Hospital-Wide PA Audio Announcement Feature
  const handleTriggerBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(broadcastMessage);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }

    setShowBroadcastModal(false);
    setBroadcastMessage('');
  };

  // Admin Action: Toggle Emergency Priority
  const handleToggleEmergency = async (patient) => {
    const newEmergency = !patient.isEmergency;
    setAllTokens(prev => prev.map(p => p.id === patient.id ? { ...p, isEmergency: newEmergency } : p));

    if (db && patient.id && !patient.id.startsWith('TOK-')) {
      try {
        await updateDoc(doc(db, 'tokens', patient.id), {
          isEmergency: newEmergency,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Emergency write notice:', err);
      }
    }
  };

  // Admin Action: Status Change
  const handleStatusChange = async (patient, newStatus) => {
    setAllTokens(prev => prev.map(p => p.id === patient.id ? { ...p, status: newStatus } : p));

    if (db && patient.id && !patient.id.startsWith('TOK-')) {
      try {
        await updateDoc(doc(db, 'tokens', patient.id), {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Status write notice:', err);
      }
    }
  };

  // Admin Action: Instant Department Transfer
  const handleExecuteTransfer = async (targetDept) => {
    if (!transferPatient) return;

    const deptMap = {
      pathology: { name: 'Room 04 (Pathology)', prefix: 'BLD' },
      xray: { name: 'Room 07 (Digital X-Ray)', prefix: 'XRY' },
      usg: { name: 'Room 11 (Sonography)', prefix: 'USG' },
      opd: { name: 'Room 01 (General OPD)', prefix: 'OPD' }
    };

    const targetInfo = deptMap[targetDept];
    const newTokNum = `${targetInfo.prefix}-${Math.floor(100 + Math.random() * 900)}`;

    setAllTokens(prev => prev.map(p => {
      if (p.id === transferPatient.id) {
        return {
          ...p,
          departmentId: targetDept,
          departmentName: targetInfo.name,
          tokenNumber: newTokNum,
          status: 'waiting'
        };
      }
      return p;
    }));

    if (db && transferPatient.id && !transferPatient.id.startsWith('TOK-')) {
      try {
        await updateDoc(doc(db, 'tokens', transferPatient.id), {
          departmentId: targetDept,
          departmentName: targetInfo.name,
          tokenNumber: newTokNum,
          status: 'waiting',
          transferredAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Transfer write notice:', err);
      }
    }

    setTransferPatient(null);
  };

  // Filtered & Sorted Queue (Emergency & Critical Alerts on top)
  const filteredTokens = useMemo(() => {
    return allTokens
      .filter(item => {
        if (selectedDept !== 'all' && item.departmentId !== selectedDept) {
          return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.patientName?.toLowerCase().includes(q) ||
          item.tokenNumber?.toLowerCase().includes(q) ||
          item.parchiCode?.includes(q) ||
          item.mobile?.includes(q)
        );
      })
      .sort((a, b) => {
        if (a.isCriticalLab && !b.isCriticalLab) return -1;
        if (!a.isCriticalLab && b.isCriticalLab) return 1;
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return 0;
      });
  }, [allTokens, selectedDept, searchQuery]);

  // Critical Value Alerts List
  const criticalPatients = useMemo(() => {
    return allTokens.filter(p => p.isCriticalLab);
  }, [allTokens]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= 1. ADMIN LOGIN VIEW =================
  if (!isAuthenticated) {
    return (
      <div translate="no" className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
        <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
          
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[11px] transition"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-xs">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {t.loginHeader}
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {t.loginSub}
          </p>

          <form onSubmit={handleAdminLogin} className="mt-5 space-y-3.5 text-left">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                {t.userInputLabel}
              </label>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_pokaran"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                {t.passInputLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 pt-1"
            >
              {isLoggingIn ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t.loginBtn}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
            <Link 
              href="/" 
              className="text-xs font-bold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backHome}</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ================= 2. AUTHENTICATED ADMIN CONSOLE =================
  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-100 overflow-x-hidden">
      
      {/* 1. Header with Language Toggle & Broadcast CTA */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 sm:py-2.5 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5">
          
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {t.portalTitle}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-black shrink-0 hidden xs:inline">
                  {t.adminBadge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate hidden md:block">
                {t.portalSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Loudspeaker PA Broadcast Button */}
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1 transition shadow-2xs active:scale-95"
              title={t.broadcastBtn}
            >
              <Megaphone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.broadcastBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1"
              title={t.logout}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">{t.logout}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Body Content */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4 flex-1 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* Critical Lab Alert Beacon (If Any Patient has alarming values) */}
        {criticalPatients.length > 0 && (
          <div className="bg-rose-600 text-white p-3 rounded-2xl shadow-lg border border-rose-700 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <Siren className="w-6 h-6 shrink-0 text-amber-300" />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-100 block">
                  {t.criticalAlertHeader}
                </span>
                <p className="text-xs sm:text-sm font-black truncate">
                  {criticalPatients[0].patientName} ({criticalPatients[0].tokenNumber}) — {criticalPatients[0].criticalReason}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleEmergency(criticalPatients[0])}
              className="min-h-[32px] px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-black shrink-0 transition active:scale-95 shadow-xs"
            >
              Prioritize ICU/ER
            </button>
          </div>
        )}

        {/* Live Bed & Ward Surveillance Snapshot */}
        <div className="bg-white p-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-black text-slate-800">{t.bedStatusTitle}:</span>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-4 text-[11px] font-bold">
            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200 text-center">
              ICU: {bedsData.icuAvailable}/{bedsData.icuTotal} Free
            </span>
            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md border border-sky-200 text-center">
              Male Ward: {bedsData.maleWardAvailable}/{bedsData.maleWardTotal} Free
            </span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200 text-center">
              Female: {bedsData.femaleWardAvailable}/{bedsData.femaleWardTotal} Free
            </span>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
          <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block truncate">{t.statsTotalTokens}</span>
              <h3 className="text-sm sm:text-xl font-black text-slate-900">{allTokens.length}</h3>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block truncate">{t.statsWaiting}</span>
              <h3 className="text-sm sm:text-xl font-black text-amber-600">
                {allTokens.filter(x => x.status === 'waiting').length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block truncate">{t.statsEmergency}</span>
              <h3 className="text-sm sm:text-xl font-black text-rose-600">
                {allTokens.filter(x => x.isEmergency).length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block truncate">{t.statsCompleted}</span>
              <h3 className="text-sm sm:text-xl font-black text-emerald-600">
                {allTokens.filter(x => x.status === 'completed').length}
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Scrollbar & Search */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {['all', 'pathology', 'xray', 'usg', 'opd'].map((dept) => {
              const labelMap = {
                all: t.deptFilterAll,
                pathology: t.deptFilterLab,
                xray: t.deptFilterXray,
                usg: t.deptFilterUsg,
                opd: t.deptFilterOpd
              };
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-black transition shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-2xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {labelMap[dept]}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

        </div>

        {/* Triage Queue List (Pure Mobile-Friendly Cards) */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{t.queueTableTitle} ({filteredTokens.length})</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-semibold shrink-0">
              Live Surveillance
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTokens.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="font-bold text-xs">No patient records found.</p>
              </div>
            ) : (
              filteredTokens.map((patient) => {
                const isWaiting = patient.status === 'waiting';
                const isInRoom = patient.status === 'in-room';
                const isCompleted = patient.status === 'completed';

                return (
                  <div 
                    key={patient.id}
                    className={`p-2.5 sm:p-3.5 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                      patient.isCriticalLab
                        ? 'bg-rose-50 border-l-4 border-rose-600'
                        : patient.isEmergency 
                        ? 'bg-amber-50/70 border-l-4 border-amber-500' 
                        : isInRoom 
                        ? 'bg-sky-50/40' 
                        : isCompleted 
                        ? 'bg-emerald-50/30' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Patient Demographic Card Content */}
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      
                      {/* Token Box with Shrink-0 */}
                      <div className={`h-11 w-16 sm:h-12 sm:w-20 rounded-xl flex flex-col items-center justify-center font-mono font-black text-[11px] sm:text-xs px-1 shadow-2xs shrink-0 select-none ${
                        patient.isCriticalLab
                          ? 'bg-rose-700 text-white'
                          : patient.isEmergency 
                          ? 'bg-amber-600 text-slate-950' 
                          : 'bg-slate-900 text-amber-400'
                      }`}>
                        <span>{patient.tokenNumber}</span>
                        {patient.isEmergency && (
                          <span className="text-[7px] font-sans font-black tracking-wider uppercase">
                            EMERGENCY
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[130px] xs:max-w-[190px] sm:max-w-none">
                            {patient.patientName}
                          </h5>
                          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded shrink-0">
                            Parchi: {patient.parchiCode}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 shrink-0">
                            {patient.departmentName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1 flex-wrap">
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

                    {/* Admin Action Bar (Mobile 3-Column / Flex Grid) */}
                    <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-0">
                      
                      {/* Emergency Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleEmergency(patient)}
                        className={`min-h-[34px] px-2 py-1 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition active:scale-95 ${
                          patient.isEmergency
                            ? 'bg-white text-rose-700 border border-rose-300'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="Emergency Priority"
                      >
                        <Flame className="w-3.5 h-3.5 shrink-0" />
                        <span>{patient.isEmergency ? t.actionNormal : t.actionEmergency}</span>
                      </button>

                      {/* Fast Transfer Button */}
                      <button
                        type="button"
                        onClick={() => setTransferPatient(patient)}
                        className="min-h-[34px] px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition active:scale-95 border border-indigo-200"
                        title="Transfer to another department"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.actionTransfer}</span>
                      </button>

                      {/* Status Complete / Reset */}
                      {!isCompleted ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(patient, 'completed')}
                          className="min-h-[34px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.actionComplete}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(patient, 'waiting')}
                          className="min-h-[34px] px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition active:scale-95"
                        >
                          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.actionReset}</span>
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

      {/* ================= MODAL 1: LOUDSPEAKER PA BROADCAST ================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-3.5 right-3.5 min-h-[32px] min-w-[32px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2.5 pr-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5" />
                <span>CENTRAL PUBLIC ADDRESS</span>
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                {t.broadcastModalTitle}
              </h3>
            </div>

            <form onSubmit={handleTriggerBroadcast} className="mt-3.5 space-y-3">
              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1">
                  Announcement Speech Text:
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder={t.broadcastPlaceholder}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full min-h-[42px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.sendBroadcast}</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: FAST INTER-DEPARTMENT TRANSFER ================= */}
      {transferPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setTransferPatient(null)}
              className="absolute top-3.5 right-3.5 min-h-[32px] min-w-[32px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2.5 pr-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>PATIENT TRANSFER</span>
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                {transferPatient.patientName} ({transferPatient.tokenNumber})
              </h3>
            </div>

            <div className="mt-3.5 space-y-2">
              <span className="text-[11px] font-black text-slate-700 block mb-1">
                Select Destination Department:
              </span>

              <button
                type="button"
                onClick={() => handleExecuteTransfer('pathology')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs font-black text-slate-900 block">Room 04 : Pathology Lab</strong>
                  <span className="text-[10px] text-slate-500">Blood & Urine Testing</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleExecuteTransfer('xray')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs font-black text-slate-900 block">Room 07 : Digital X-Ray</strong>
                  <span className="text-[10px] text-slate-500">Radiology Imaging</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleExecuteTransfer('usg')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs font-black text-slate-900 block">Room 11 : Sonography (USG)</strong>
                  <span className="text-[10px] text-slate-500">Ultrasound Scanning</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleExecuteTransfer('opd')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs font-black text-slate-900 block">Room 01 : General OPD</strong>
                  <span className="text-[10px] text-slate-500">Doctor Consultation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}