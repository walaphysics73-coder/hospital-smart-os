'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  PhoneCall, 
  Search, 
  Layers, 
  FileText, 
  Bed, 
  Users, 
  Eye, 
  Baby, 
  ShieldAlert, 
  Pill, 
  MapPin, 
  Stethoscope,
  X,
  ShieldCheck,
  Languages,
  ChevronRight,
  KeyRound
} from 'lucide-react';

export default function PokaranHospitalHome() {
  // By Default Primary Language: English ('en'), Secondary: Hindi ('hi')
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Sanitized search input (XSS protection)
  const handleSearchChange = (e) => {
    const cleanValue = e.target.value.replace(/[<>'"/\\&]/g, '');
    setSearchQuery(cleanValue);
  };

  // UI Strings Translation Dictionary (Primary: English | Secondary: Hindi)
  const t = {
    en: {
      hospitalName: 'Government Hospital, Pokaran',
      subTitle: 'Government Sub-District Hospital, Pokaran (Jaisalmer)',
      opdOpen: 'OPD Open (08:00 AM - 02:00 PM)',
      emergency: '108 Ambulance',
      staffLogin: 'Staff Login',
      staffLoginShort: 'Staff',
      staffBannerTitle: 'Hospital Staff & Doctor Switchboard',
      staffBannerDesc: 'Authorized access to Room 04 (Lab), Room 07 (X-Ray), Room 11 (USG) & Admin',
      staffBannerBtn: 'Enter Staff Portal',
      traumaTitle: 'Desert Emergency Care Unit (Trauma Ward 00)',
      traumaDesc: '24/7 dedicated beds, anti-snake venom and heatstroke emergency treatment ready.',
      traumaBadge: '24×7 Emergency Ward',
      searchLabel: 'Search Tests, Doctors or Room Numbers',
      searchPlaceholder: 'e.g. Blood test, X-Ray, Room 4, Sonography...',
      quickLinks: 'Quick Links:',
      clear: 'Clear',
      quickServices: 'Quick Services',
      services: {
        kioskTitle: 'Token Kiosk',
        kioskDesc: 'Scan slip & get token',
        crowdTitle: 'Live Rush Meter',
        crowdDesc: 'Check live OPD queue',
        reportTitle: 'Test Reports',
        reportDesc: 'Download PDF by Token',
        bedTitle: 'Vacant Bed Status',
        bedDesc: 'Ward & Oxygen beds',
      },
      deptHeading: 'Diagnostic Centers & OPD Departments',
      deptSubHeading: 'Room numbers & estimated wait time',
      avgTime: 'Avg Time',
      rushHigh: 'High Rush',
      rushMod: 'Moderate',
      rushLow: 'Low Rush',
      doctorsHeading: 'On-Duty Doctors Live Roster',
      doctorsSub: 'Specialist physicians available today',
      liveUpdate: 'Live Update',
      availableInOpd: 'Available (In OPD)',
      wardRound: 'On Ward Round (Back in 10 mins)',
      directionsTitle: 'Campus Navigation Guide',
      gateTitle: '1. Main Entrance:',
      gateDesc: 'Straight ahead is the Registration Counter and Room 01 (General OPD).',
      leftTitle: '2. Left Wing Corridor:',
      leftDesc: 'Room 04 (Pathology Lab) and Room 05 (Free Medicine Distribution Center).',
      rightTitle: '3. Right Wing Corridor:',
      rightDesc: 'Room 08 (Sonography / USG) and Room 11 (Digital X-Ray Center).',
    },
    hi: {
      hospitalName: 'राजकीय सामान्य चिकित्सालय, पोकरण',
      subTitle: 'Government Sub-District Hospital, Pokaran (जैसलमेर)',
      opdOpen: 'OPD खुली है (08:00 AM - 02:00 PM)',
      emergency: 'इमरजेंसी 108',
      staffLogin: 'स्टाफ लॉगिन',
      staffLoginShort: 'स्टाफ',
      staffBannerTitle: 'अस्पताल स्टाफ एवं डॉक्टर सेंट्रल स्विचबोर्ड',
      staffBannerDesc: 'कमरा नं. 04 (लैब), कमरा 07 (एक्स-रे), कमरा 11 (सोनोग्राफी) व एडमिन टर्मिनल',
      staffBannerBtn: 'स्टाफ पोर्टल खोलें',
      traumaTitle: 'मरुस्थलीय आपातकालीन सहायता केंद्र (Trauma Ward 00)',
      traumaDesc: 'सर्पदंश (Anti-Snake Venom) एवं लू (Heatstroke) के लिए 24 घंटे विशेष बेड और इंजेक्शन उपलब्ध हैं।',
      traumaBadge: '24×7 आपातकालीन कक्ष',
      searchLabel: 'जांच, डॉक्टर या कमरा नंबर खोजें',
      searchPlaceholder: 'उदा. खून जांच, एक्स-रे, कमरा 4, सोनोग्राफी...',
      quickLinks: 'त्वरित लिंक:',
      clear: 'साफ़ करें',
      quickServices: 'मुख्य सुविधाएं (Quick Services)',
      services: {
        kioskTitle: 'टोकन कियोस्क',
        kioskDesc: 'पर्ची स्कैन करें व नंबर पाएं',
        crowdTitle: 'लाइव भीड़ मीटर',
        crowdDesc: 'ओपीडी लाइन स्थिति देखें',
        reportTitle: 'जांच रिपोर्ट',
        reportDesc: 'टोकन से PDF प्राप्त करें',
        bedTitle: 'खाली बेड स्थिति',
        bedDesc: 'वार्ड व ऑक्सीजन बेड स्टेटस',
      },
      deptHeading: 'जांच केंद्र एवं ओपीडी विभाग',
      deptSubHeading: 'कमरा नंबर एवं प्रतीक्षा समय',
      avgTime: 'औसत समय',
      rushHigh: 'अधिक भीड़',
      rushMod: 'मध्यम भीड़',
      rushLow: 'सामान्य स्थिति',
      doctorsHeading: 'ड्यूटी डॉक्टर लाइव रोस्टर (On-Duty Doctors)',
      doctorsSub: 'आज उपस्थित विशेषज्ञ चिकित्सक',
      liveUpdate: 'लाइव अपडेट',
      availableInOpd: 'उपलब्ध (In OPD)',
      wardRound: 'वार्ड राउंड पर (10 मिनट में वापसी)',
      directionsTitle: 'अस्पताल परिसर दिशा-निर्देश (Hospital Walkthrough)',
      gateTitle: '1. मुख्य प्रवेश द्वार:',
      gateDesc: 'सीधे आगे पर्ची काउंटर एवं कक्ष 01 (सामान्य चिकित्सा) स्थित है।',
      leftTitle: '2. बायां गलियारा:',
      leftDesc: 'कमरा नं. 04 (खून जांच) एवं कमरा नं. 05 (निःशुल्क दवा वितरण केंद्र)।',
      rightTitle: '3. दायां गलियारा:',
      rightDesc: 'कमरा नं. 08 (सोनोग्राफी) एवं कमरा नं. 11 (डिजिटल एक्स-रे केंद्र)।',
    }
  };

  const current = t[lang];

  // Hospital Departments Data
  const departments = [
    {
      id: 'pathology',
      title: lang === 'en' ? 'Pathology Lab (Blood & Urine Tests)' : 'खून एवं पेशाब जांच (Pathology Lab)',
      room: lang === 'en' ? 'Room No. 04' : 'कमरा नं. 04',
      status: 'High',
      waitTime: lang === 'en' ? '~25 mins' : '~25 मिनट',
      icon: Activity,
      desc: lang === 'en' ? 'CBC, Sugar, LFT, KFT, Malaria, Dengue tests' : 'CBC, Sugar, LFT, KFT, मलेरिया, डेंगू जांच'
    },
    {
      id: 'xray',
      title: lang === 'en' ? 'Digital X-Ray Center' : 'डिजिटल एक्स-रे केंद्र (Digital X-Ray)',
      room: lang === 'en' ? 'Room No. 07' : 'कमरा नं. 07',
      status: 'Low',
      waitTime: lang === 'en' ? '~5 mins' : '~5 मिनट',
      icon: Layers,
      desc: lang === 'en' ? 'Chest, Bone, Joints & Spine X-Ray' : 'छाती, हड्डी, जोड़ एवं स्पाइन एक्स-रे'
    },
    {
      id: 'usg',
      title: lang === 'en' ? 'Sonography Center (USG)' : 'सोनोग्राफी केंद्र (USG Department)',
      room: lang === 'en' ? 'Room No. 11' : 'कमरा नं. 11',
      status: 'Moderate',
      waitTime: lang === 'en' ? '~15 mins' : '~15 मिनट',
      icon: FileText,
      desc: lang === 'en' ? 'Abdominal & Pregnancy ultrasound scan' : 'पेट एवं गर्भावस्‍था की सोनोग्राफी जांच'
    },
    {
      id: 'general',
      title: lang === 'en' ? 'General Medicine OPD' : 'सामान्य चिकित्सा ओपीडी (General Medicine)',
      room: lang === 'en' ? 'Room No. 01' : 'कमरा नं. 01',
      status: 'Moderate',
      waitTime: lang === 'en' ? '~12 mins' : '~12 मिनट',
      icon: Stethoscope,
      desc: lang === 'en' ? 'Fever, cough, BP, diabetes & routine consults' : 'बुखार, जुकाम, बीपी, शुगर व सामान्य परामर्श'
    },
    {
      id: 'eye',
      title: lang === 'en' ? 'Eye Care & Vision Department' : 'नेत्र रोग विभाग (Eye Care & Vision)',
      room: lang === 'en' ? 'Room No. 02' : 'कमरा नं. 02',
      status: 'Low',
      waitTime: lang === 'en' ? '~8 mins' : '~8 मिनट',
      icon: Eye,
      desc: lang === 'en' ? 'Comprehensive eye checkup & vision tests' : 'आंखों की जांच, दृष्टि परीक्षण एवं परामर्श'
    },
    {
      id: 'pediatrics',
      title: lang === 'en' ? 'Pediatrics & Child Care Ward' : 'शिशु एवं बाल रोग (Pediatrics Ward)',
      room: lang === 'en' ? 'Room No. 06' : 'कमरा नं. 06',
      status: 'Low',
      waitTime: lang === 'en' ? '~10 mins' : '~10 मिनट',
      icon: Baby,
      desc: lang === 'en' ? 'Child immunization & pediatric consultations' : 'बच्चों का टीकाकरण एवं स्वास्थ्य परामर्श'
    },
    {
      id: 'medicine',
      title: lang === 'en' ? 'Free Medicine Distribution (DDC)' : 'निःशुल्क दवा वितरण केंद्र (DDC Counter)',
      room: lang === 'en' ? 'Room No. 05' : 'कमरा नं. 05',
      status: 'Low',
      waitTime: lang === 'en' ? '~6 mins' : '~6 मिनट',
      icon: Pill,
      desc: lang === 'en' ? 'Government free medicine distribution' : 'मुख्यमंत्री निःशुल्क दवा योजना'
    }
  ];

  // Doctors On Duty
  const doctors = [
    {
      name: lang === 'en' ? 'Dr. S. K. Sharma' : 'डॉ. एस. के. शर्मा',
      role: lang === 'en' ? 'Senior Physician (Medical Specialist)' : 'वरिष्ठ फिजिशियन (Medical Specialist)',
      room: lang === 'en' ? 'Room 01' : 'कक्ष 01',
      status: current.availableInOpd,
      available: true
    },
    {
      name: lang === 'en' ? 'Dr. Anita Bishnoi' : 'डॉ. अनिता विश्नोई',
      role: lang === 'en' ? 'Gynecologist & Obstetrician' : 'स्त्री एवं प्रसूति रोग विशेषज्ञ (Gynecologist)',
      room: lang === 'en' ? 'Room 03' : 'कक्ष 03',
      status: current.availableInOpd,
      available: true
    },
    {
      name: lang === 'en' ? 'Dr. Ramesh Singh' : 'डॉ. रमेश सिंह',
      role: lang === 'en' ? 'Orthopedic Surgeon' : 'हड्डी एवं जोड़ रोग विशेषज्ञ (Orthopedic)',
      room: lang === 'en' ? 'Room 09' : 'कक्ष 09',
      status: current.wardRound,
      available: false
    },
    {
      name: lang === 'en' ? 'Dr. Vikram Choudhary' : 'डॉ. विक्रम चौधरी',
      role: lang === 'en' ? 'Pediatrician (Child Specialist)' : 'शिशु रोग विशेषज्ञ (Pediatrician)',
      room: lang === 'en' ? 'Room 06' : 'कक्ष 06',
      status: current.availableInOpd,
      available: true
    }
  ];

  // Quick Search Filter Tags
  const quickTags = lang === 'en'
    ? ['Blood Test', 'X-Ray', 'Room 04', 'Room 01', 'Sonography', 'Medicine']
    : ['खून जांच', 'एक्स-रे', 'कमरा 04', 'कक्ष 01', 'सोनोग्राफी', 'दवा वितरण'];

  // Filtered List based on search
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return departments;
    const q = searchQuery.toLowerCase();
    return departments.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.room.toLowerCase().includes(q) || 
      d.desc.toLowerCase().includes(q)
    );
  }, [searchQuery, departments]);

  return (
    <div translate="no" className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-14 touch-manipulation overflow-x-hidden">
      
      {/* 1. Sticky Hospital Top Header with Responsive Staff Login for Mobile & Desktop */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 shadow-xs w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Hospital Branding */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-snug truncate">
                  {current.hospitalName}
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {current.opdOpen}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                {current.subTitle}
              </p>
            </div>
          </div>

          {/* Header Action Controls (Staff Login + Language Switcher + Emergency 108) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Staff Login Button (Cleanly Sized for Mobile & Desktop) */}
            <Link
              href="/login"
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1 shadow-2xs transition active:scale-95 shrink-0"
              title={current.staffLogin}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-indigo-200" />
              <span className="hidden xs:inline">{current.staffLogin}</span>
              <span className="xs:hidden">{current.staffLoginShort}</span>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg sm:rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-h-[28px] sm:min-h-[32px] px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-black rounded-md sm:rounded-lg transition active:scale-95 ${
                  lang === 'en' 
                    ? 'bg-sky-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="English language"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`min-h-[28px] sm:min-h-[32px] px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-black rounded-md sm:rounded-lg transition active:scale-95 ${
                  lang === 'hi' 
                    ? 'bg-sky-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Hindi language"
              >
                हिं
              </button>
            </div>

            {/* Emergency SOS Callout */}
            <a
              href="tel:108"
              className="flex items-center gap-1 min-h-[32px] sm:min-h-[36px] px-2 sm:px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs shadow-2xs transition active:scale-95 shrink-0"
              title="Emergency Ambulance"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <span className="whitespace-nowrap hidden sm:inline">{current.emergency}</span>
              <span className="sm:hidden font-black">108</span>
            </a>

          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 md:px-6 pt-3.5 sm:pt-5 space-y-3.5 sm:space-y-5">

        {/* 2. Staff Operations Launchpad Quick Banner */}
        <Link
          href="/login"
          className="group block bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-indigo-800/50 shadow-md hover:shadow-lg transition active:scale-99"
        >
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center shrink-0 border border-indigo-400/30 group-hover:scale-105 transition">
                <KeyRound className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-xs sm:text-sm font-black text-white truncate">
                    {current.staffBannerTitle}
                  </h2>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-black border border-amber-400/30 uppercase tracking-wider">
                    Authorized
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-indigo-200 font-medium mt-0.5 truncate">
                  {current.staffBannerDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 group-hover:bg-indigo-500 rounded-xl text-[11px] font-black text-white shrink-0 transition">
              <span>{current.staffBannerBtn}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </Link>

        {/* 3. Desert Emergency Alert Strip */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-extrabold text-amber-950 leading-snug break-words">
                {current.traumaTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-900 font-medium mt-0.5 leading-relaxed break-words">
                {current.traumaDesc}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2 py-0.5 bg-amber-200 text-amber-950 text-[10px] sm:text-[11px] font-black rounded-lg shrink-0">
            {current.traumaBadge}
          </span>
        </div>

        {/* 4. Smart Search & Quick Filter */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {current.searchLabel}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={current.searchPlaceholder}
              className="w-full min-h-[42px] pl-9 sm:pl-10 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
            <span className="text-slate-400 font-semibold text-[10px] sm:text-xs mr-0.5">{current.quickLinks}</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="min-h-[30px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-[10px] sm:text-[11px] transition active:scale-95"
              >
                {tag}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="min-h-[30px] px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded-lg text-[10px] sm:text-[11px] hover:bg-rose-100 transition"
              >
                {current.clear} ✕
              </button>
            )}
          </div>
        </div>

        {/* 5. Primary 4-Action Hub (Bento Matrix) */}
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            {current.quickServices}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            
            <Link
              href="/kiosk"
              className="p-3 sm:p-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow-xs transition active:scale-98 flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="mt-2 min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base leading-snug break-words">{current.services.kioskTitle}</h3>
                <p className="text-[10px] sm:text-xs text-sky-100 mt-0.5 leading-tight break-words">{current.services.kioskDesc}</p>
              </div>
            </Link>

            <Link
              href="/crowd"
              className="p-3 sm:p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition active:scale-98 flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-2 min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-snug break-words">{current.services.crowdTitle}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight break-words">{current.services.crowdDesc}</p>
              </div>
            </Link>

            <Link
              href="/reports"
              className="p-3 sm:p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition active:scale-98 flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-2 min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-snug break-words">{current.services.reportTitle}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight break-words">{current.services.reportDesc}</p>
              </div>
            </Link>

            <Link
              href="/beds"
              className="p-3 sm:p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition active:scale-98 flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl flex items-center justify-center">
                <Bed className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-2 min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-snug break-words">{current.services.bedTitle}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight break-words">{current.services.bedDesc}</p>
              </div>
            </Link>

          </div>
        </div>

        {/* 6. Departments & Diagnostic Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              {current.deptHeading} ({filteredDepartments.length})
            </h2>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{current.deptSubHeading}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {filteredDepartments.map((dept) => {
              const Icon = dept.icon;
              const isHigh = dept.status === 'High';
              const isMod = dept.status === 'Moderate';
              const badgeStyle = isHigh 
                ? 'text-rose-700 bg-rose-50 border-rose-200' 
                : isMod 
                ? 'text-amber-700 bg-amber-50 border-amber-200' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-200';
              const badgeText = isHigh ? current.rushHigh : isMod ? current.rushMod : current.rushLow;

              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className="font-black text-slate-900 text-xs sm:text-sm">{dept.room}</span>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${badgeStyle}`}>
                          {badgeText}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug break-words">{dept.title}</h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed break-words">{dept.desc}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{dept.waitTime}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">{current.avgTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Doctors on Duty Roster */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 mb-3">
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                {current.doctorsHeading}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500">{current.doctorsSub}</p>
            </div>
            <span className="self-start xs:self-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {current.liveUpdate}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {doctors.map((doc, idx) => (
              <div 
                key={idx}
                className="p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col xs:flex-row xs:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {doc.name.charAt(0) || 'D'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{doc.role} — <span className="font-semibold text-slate-700">{doc.room}</span></p>
                  </div>
                </div>
                <span className={`self-start xs:self-auto text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${doc.available ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Campus Navigation Landmark Guide */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <h3 className="font-extrabold text-xs sm:text-sm tracking-wide">
              {current.directionsTitle}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-300">
            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-0.5">{current.gateTitle}</span>
              {current.gateDesc}
            </div>
            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80 leading-relaxed">
              <span className="font-bold text-sky-400 block mb-0.5">{current.leftTitle}</span>
              {current.leftDesc}
            </div>
            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-0.5">{current.rightTitle}</span>
              {current.rightDesc}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}