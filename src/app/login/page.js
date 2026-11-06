'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Activity, 
  ScanLine, 
  Layers, 
  Stethoscope, 
  Bed, 
  Tv, 
  Ticket, 
  Building2, 
  LogOut, 
  Languages, 
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// ==============================================================
// MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const PORTAL_TRANSLATIONS = {
  en: {
    portalHeader: 'Hospital Staff Launchpad',
    portalSub: 'Govt. Sub-District Hospital, Pokaran • Department Switchboard',
    verifiedStaff: 'Staff Access Granted',
    logoutBtn: 'Lock Portal',
    searchRooms: 'Search Department or Room...',
    selectDeptTitle: 'Hospital Departments & Terminals',
    selectDeptSub: 'Select your operational room to launch console',
    enterRoom: 'Enter Terminal',
    lockTitle: 'Hospital Staff Gateway',
    lockSub: 'Government Hospital, Pokaran • Authorized Personnel Only',
    enterMasterPass: 'Enter Master Staff Security Passcode',
    passPlaceholder: 'Enter master password...',
    unlockBtn: 'Unlock Hospital Terminals',
    backToHome: 'Back to Public Portal',
    footerText: 'Government Hospital Pokaran • Staff Operations Switchboard • Powered by Webnexa'
  },
  hi: {
    portalHeader: 'अस्पताल स्टाफ सेंट्रल लॉन्चपैड',
    portalSub: 'राजकीय सामान्य चिकित्सालय पोकरण • केंद्रीय कक्ष नियंत्रण',
    verifiedStaff: 'अधिकृत स्टाफ सत्यापित',
    logoutBtn: 'पोर्टल लॉक करें',
    searchRooms: 'विभाग या कमरा नंबर खोजें...',
    selectDeptTitle: 'अस्पताल विभाग एवं कक्ष कंसोल',
    selectDeptSub: 'अपने विभाग के कंसोल में जाने के लिए चयन करें',
    enterRoom: 'कंसोल खोलें',
    lockTitle: 'स्टाफ सेंट्रल गेटवे',
    lockSub: 'राजकीय अस्पताल पोकरण • केवल अधिकृत कर्मचारियों हेतु',
    enterMasterPass: 'मास्टर स्टाफ सिक्योरिटी पासवर्ड दर्ज करें',
    passPlaceholder: 'मास्टर पासवर्ड दर्ज करें...',
    unlockBtn: 'अस्पताल कंसोल अनलॉक करें',
    backToHome: 'मुख्य वेबसाइट पर वापस जाएं',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • स्टाफ संचालन प्रणाली • Webnexa Health'
  }
};

// All 8 Core Hospital Department Terminals
const HOSPITAL_TERMINALS = [
  {
    id: 'lab',
    room: 'Room 04',
    nameEn: 'Pathology & Blood Testing',
    nameHi: 'पैथोलॉजी एवं खून जांच केंद्र',
    descEn: 'CBC, Sugar, KFT, LFT, Pamphlet auto-generator & WhatsApp',
    descHi: 'सीबीसी, शुगर, केएफटी, डिजिटल पैम्फलेट व व्हाट्सएप रिपोर्टिंग',
    url: '/lab',
    color: 'rose',
    icon: Activity
  },
  {
    id: 'xray',
    room: 'Room 07',
    nameEn: 'Digital X-Ray & Radiology',
    nameHi: 'डिजिटल एक्स-रे एवं रेडियोलॉजी',
    descEn: 'DR Imaging, Chest PA, Bone fractures & X-Ray reports',
    descHi: 'डीआर इमेजिंग, चेस्ट पीए, फ्रैक्चर जांच व त्वरित रेडियोलॉजी रिपोर्ट',
    url: '/xray',
    color: 'indigo',
    icon: ScanLine
  },
  {
    id: 'usg',
    room: 'Room 11',
    nameEn: 'Sonography & Ultrasound (USG)',
    nameHi: 'सोनोग्राफी एवं अल्ट्रासाउंड केंद्र',
    descEn: 'Abdomen, Pelvis, ANC obstetric scans & sonography reports',
    descHi: 'पेट, पेल्विस, प्रसव पूर्व सोनोग्राफी जांच व अल्ट्रासाउंड रिपोर्ट',
    url: '/usg',
    color: 'purple',
    icon: Layers
  },
  {
    id: 'opd',
    room: 'Room 01',
    nameEn: 'General OPD Doctor Chamber',
    nameHi: 'जनरल ओपीडी डॉक्टर चैंबर',
    descEn: 'Doctor clinical examination, e-Prescription & investigation orders',
    descHi: 'मरीज परामर्श, डिजिटल पर्ची, दवाइयां व जांच रेफरल',
    url: '/opd',
    color: 'emerald',
    icon: Stethoscope
  },
  {
    id: 'beds',
    room: 'Ward Wing',
    nameEn: 'Indoor Wards & ICU Beds',
    nameHi: 'भर्ती वार्ड एवं आईसीयू बेड प्रबंधन',
    descEn: 'Real-time bed vacancy, oxygen status & patient admission',
    descHi: 'लाइव बेड उपलब्धता, ऑक्सीजन सिलेंडर व मरीज भर्ती स्थिति',
    url: '/beds',
    color: 'sky',
    icon: Bed
  },
  {
    id: 'display',
    room: 'Main Hall',
    nameEn: 'Live Waiting Hall LED Screen',
    nameHi: 'मुख्य वेटिंग हॉल एलईडी डिस्प्ले',
    descEn: 'Central live screen for patient calling & token announcements',
    descHi: 'मरीजों हेतु बड़ा एलईडी टीवी डिस्प्ले व लाइव टोकन नंबर घोषणा',
    url: '/display',
    color: 'amber',
    icon: Tv
  },
  {
    id: 'kiosk',
    room: 'Counter 01',
    nameEn: 'Patient Kiosk & Token Generator',
    nameHi: 'मरीज टोकन पर्ची कियोस्क काउंटर',
    descEn: 'Free OPD registration, 6-digit parchi generation & thermal print',
    descHi: 'निःशुल्क पंजीकरण, 6-अंकों का पर्ची कोड व थर्मल प्रिंटिंग',
    url: '/kiosk',
    color: 'teal',
    icon: Ticket
  },
  {
    id: 'admin',
    room: 'Superintendent',
    nameEn: 'Master Super Admin Portal',
    nameHi: 'मास्टर सुपर एडमिन पोर्टल',
    descEn: 'Hospital-wide PA loudspeaker broadcast, emergency override & triage',
    descHi: 'अस्पताल लाउडस्पीकर ब्रॉडकास्ट, इमरजेंसी प्राथमिकता व समग्र निगरानी',
    url: '/admin',
    color: 'slate',
    icon: ShieldCheck
  }
];

export default function MasterStaffLoginPortal() {
  const [lang, setLang] = useState('en');
  const t = PORTAL_TRANSLATIONS[lang];

  // Hydration Mount Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hard Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check Session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('hospital_master_staff_unlocked');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Hard Password Verification Handler
  const handleUnlockPortal = async (e) => {
    e.preventDefault();
    if (!masterPassword.trim()) {
      setAuthError(lang === 'en' ? 'Please enter master passcode.' : 'कृपया मास्टर पासवर्ड दर्ज करें।');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'portal', password: masterPassword.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('hospital_master_staff_unlocked', 'true');
        setMasterPassword('');
      } else if (masterPassword.trim() === 'PokaranStaff@2026') {
        // Safe Default Fallback
        setIsAuthenticated(true);
        sessionStorage.setItem('hospital_master_staff_unlocked', 'true');
        setMasterPassword('');
      } else {
        setAuthError(data.message || (lang === 'en' ? 'Incorrect Master Passcode!' : 'गलत मास्टर पासवर्ड दर्ज किया गया है!'));
      }
    } catch (err) {
      if (masterPassword.trim() === 'PokaranStaff@2026') {
        setIsAuthenticated(true);
        sessionStorage.setItem('hospital_master_staff_unlocked', 'true');
        setMasterPassword('');
      } else {
        setAuthError(lang === 'en' ? 'Failed to verify passcode.' : 'सत्यापन विफल रहा। पुनः प्रयास करें।');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockPortal = () => {
    sessionStorage.removeItem('hospital_master_staff_unlocked');
    setIsAuthenticated(false);
    setMasterPassword('');
  };

  // Filter Terminals
  const filteredTerminals = HOSPITAL_TERMINALS.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.nameEn.toLowerCase().includes(q) ||
      item.nameHi.includes(q) ||
      item.room.toLowerCase().includes(q) ||
      item.url.includes(q)
    );
  });

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= 1. HARD PASSWORD LOCK SCREEN =================
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
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {t.lockTitle}
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {t.lockSub}
          </p>

          <form onSubmit={handleUnlockPortal} className="mt-5 space-y-3.5 text-left">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {t.enterMasterPass}
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder={t.passPlaceholder}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                />
              </div>
              <span className="text-[9px] text-slate-400 mt-1 block">
                Default: <strong className="text-slate-600 font-mono">PokaranStaff@2026</strong>
              </span>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t.unlockBtn}</span>
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
              <span>{t.backToHome}</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ================= 2. MASTER DEPARTMENT SWITCHBOARD =================
  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-100 overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {t.portalHeader}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black shrink-0">
                  {t.verifiedStaff}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate hidden md:block">
                {t.portalSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[34px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={handleLockPortal}
              className="min-h-[34px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1"
              title={t.logoutBtn}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.logoutBtn}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Switchboard Grid */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 flex-1 pb-24 sm:pb-12 overflow-x-hidden">
        
        {/* Switchboard Title & Fast Search */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
              POKARAN HOSPITAL SMART OS
            </span>
            <h2 className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
              {t.selectDeptTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.selectDeptSub}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchRooms}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* 8 Department Terminal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredTerminals.map((dept) => {
            const IconComponent = dept.icon;
            
            // Color theme mapping
            const colorThemes = {
              rose: 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600',
              indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600',
              purple: 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600',
              emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600',
              sky: 'bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-600',
              amber: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600',
              teal: 'bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-600',
              slate: 'bg-slate-100 text-slate-800 border-slate-300 group-hover:bg-slate-900'
            };

            return (
              <Link
                key={dept.id}
                href={dept.url}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-600 p-4 transition-all duration-150 shadow-xs hover:shadow-md flex flex-col justify-between active:scale-98"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-150 group-hover:text-white ${colorThemes[dept.color]}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      {dept.room}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition">
                    {lang === 'en' ? dept.nameEn : dept.nameHi}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug line-clamp-2">
                    {lang === 'en' ? dept.descEn : dept.descHi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-indigo-600 group-hover:translate-x-0.5 transition">
                  <span>{t.enterRoom}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 font-semibold hidden sm:block">
        {t.footerText}
      </footer>

    </div>
  );
}