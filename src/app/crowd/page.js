'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity, 
  Layers, 
  FileText, 
  Eye, 
  Baby, 
  Pill, 
  Stethoscope, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  Ticket
} from 'lucide-react';

export default function CrowdMeterPage() {
  const [lang, setLang] = useState('hi');
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('अभी-अभी (Live)');

  // Multilingual Strings
  const t = {
    hi: {
      backHome: 'होम पेज पर वापस',
      pageTitle: 'लाइव ओपीडी भीड़ मीटर',
      pageSub: 'राजकीय सामान्य चिकित्सालय, पोकरण — वास्तविक समय कतार स्थिति',
      liveSync: 'लाइव सिंक सक्रिय',
      refreshBtn: 'डेटा रिफ्रेश करें',
      totalWaiting: 'कुल कतार में मरीज',
      avgWaitTime: 'औसत प्रतीक्षा समय',
      fastestDept: 'सबसे तेज काउंटर',
      peakDept: 'सर्वाधिक भीड़ केंद्र',
      bestTimeTitle: 'अस्पताल आने का सबसे सही समय (Best Time to Visit)',
      bestTimeDesc: 'प्रातः 08:00 से 10:30 बजे सर्वाधिक भीड़ रहती है। 11:30 बजे के बाद प्रतीक्षा समय 60% घट जाता है।',
      filterAll: 'सभी केंद्र',
      filterDocs: 'ओपीडी डॉक्टर्स',
      filterLabs: 'जांच केंद्र (Labs)',
      filterCounters: 'दवा व पर्ची',
      servingNow: 'वर्तमान चालू टोकन:',
      waitingCount: 'कतार में:',
      estWait: 'अनुमानित समय:',
      getToken: 'टोकन लें',
      rushHigh: 'अधिक भीड़',
      rushMod: 'मध्यम भीड़',
      rushLow: 'सामान्य स्थिति',
      emergencyNoticeTitle: 'आपातकालीन सूचना (Emergency Bypass)',
      emergencyNoticeDesc: 'सर्पदंश, गंभीर चोट, छाती में दर्द या हीटस्ट्रोक के मरीजों को कतार में लगने की आवश्यकता नहीं है। सीधे आपातकालीन कक्ष (कमरा 00) जाएं।',
    },
    en: {
      backHome: 'Back to Home',
      pageTitle: 'Live OPD Crowd Meter',
      pageSub: 'Government Hospital Pokaran — Real-time Queue & Waiting Heatmap',
      liveSync: 'Live Sync Active',
      refreshBtn: 'Refresh Data',
      totalWaiting: 'Total In Queue',
      avgWaitTime: 'Average Wait Time',
      fastestDept: 'Fastest Service',
      peakDept: 'Peak Rush Center',
      bestTimeTitle: 'Recommended Visiting Hours',
      bestTimeDesc: 'Peak rush occurs between 08:00 AM – 10:30 AM. Waiting times drop by up to 60% after 11:30 AM.',
      filterAll: 'All Centers',
      filterDocs: 'OPD Doctors',
      filterLabs: 'Diagnostics & Labs',
      filterCounters: 'Medicine & Slip',
      servingNow: 'Serving Token:',
      waitingCount: 'Waiting:',
      estWait: 'Est. Wait Time:',
      getToken: 'Get Token',
      rushHigh: 'High Rush',
      rushMod: 'Moderate',
      rushLow: 'Low Rush',
      emergencyNoticeTitle: 'Emergency Priority Notice',
      emergencyNoticeDesc: 'Snakebite, cardiac, trauma, or severe heatstroke cases do not require a token. Report directly to Emergency Room 00.',
    }
  };

  const current = t[lang];

  // Room by Room Live Queue Data
  const [departments, setDepartments] = useState([
    {
      id: 'reg',
      category: 'counter',
      room: lang === 'hi' ? 'काउंटर 01-02' : 'Counter 01-02',
      name: lang === 'hi' ? 'सरकारी पर्ची पंजीकरण (Registration)' : 'OPD Registration Desk',
      currentToken: 'R-142',
      waiting: 8,
      waitTime: '4-6 min',
      status: 'Moderate',
      icon: Ticket,
      staff: 'कनिष्ठ लिपिक (2 काउंटर चालू)'
    },
    {
      id: 'general',
      category: 'doc',
      room: lang === 'hi' ? 'कमरा नं. 01' : 'Room No. 01',
      name: lang === 'hi' ? 'सामान्य चिकित्सा (Dr. S.K. Sharma)' : 'General Medicine (Dr. S.K. Sharma)',
      currentToken: 'GM-38',
      waiting: 14,
      waitTime: '12-15 min',
      status: 'Moderate',
      icon: Stethoscope,
      staff: 'डॉ. एस. के. शर्मा (कक्ष में उपस्थित)'
    },
    {
      id: 'pathology',
      category: 'lab',
      room: lang === 'hi' ? 'कमरा नं. 04' : 'Room No. 04',
      name: lang === 'hi' ? 'खून एवं पेशाब जांच (Pathology Lab)' : 'Pathology Lab (Blood & Urine)',
      currentToken: 'BH-61',
      waiting: 26,
      waitTime: '25-30 min',
      status: 'High',
      icon: Activity,
      staff: 'लैब तकनीशियन दल (3 स्टाफ कार्यरत)'
    },
    {
      id: 'medicine',
      category: 'counter',
      room: lang === 'hi' ? 'कमरा नं. 05' : 'Room No. 05',
      name: lang === 'hi' ? 'निःशुल्क दवा वितरण (DDC Counter)' : 'Free Medicine Distribution (DDC)',
      currentToken: 'M-180',
      waiting: 19,
      waitTime: '8-10 min',
      status: 'Moderate',
      icon: Pill,
      staff: 'फार्मासिस्ट (2 विंडो चालू)'
    },
    {
      id: 'usg',
      category: 'lab',
      room: lang === 'hi' ? 'कमरा नं. 08' : 'Room No. 08',
      name: lang === 'hi' ? 'सोनोग्राफी केंद्र (USG Department)' : 'Sonography Center (USG)',
      currentToken: 'SG-12',
      waiting: 7,
      waitTime: '15-20 min',
      status: 'Moderate',
      icon: FileText,
      staff: 'सोनोलॉजिस्ट उपलब्ध'
    },
    {
      id: 'xray',
      category: 'lab',
      room: lang === 'hi' ? 'कमरा नं. 11' : 'Room No. 11',
      name: lang === 'hi' ? 'डिजिटल एक्स-रे केंद्र (Digital X-Ray)' : 'Digital X-Ray Center',
      currentToken: 'XR-24',
      waiting: 3,
      waitTime: '4-5 min',
      status: 'Low',
      icon: Layers,
      staff: 'रेडियोग्राफर तैयार'
    },
    {
      id: 'gynae',
      category: 'doc',
      room: lang === 'hi' ? 'कमरा नं. 03' : 'Room No. 03',
      name: lang === 'hi' ? 'स्त्री एवं प्रसूति रोग (Dr. Anita Bishnoi)' : 'Gynecology (Dr. Anita Bishnoi)',
      currentToken: 'GY-29',
      waiting: 11,
      waitTime: '12-14 min',
      status: 'Moderate',
      icon: HeartPulseIcon,
      staff: 'डॉ. अनिता विश्नोई (उपस्थित)'
    },
    {
      id: 'eye',
      category: 'doc',
      room: lang === 'hi' ? 'कमरा नं. 02' : 'Room No. 02',
      name: lang === 'hi' ? 'नेत्र रोग ओपीडी (Eye Care)' : 'Eye Care OPD',
      currentToken: 'EY-19',
      waiting: 5,
      waitTime: '6-8 min',
      status: 'Low',
      icon: Eye,
      staff: 'नेत्र चिकित्सक उपलब्ध'
    },
    {
      id: 'pediatrics',
      category: 'doc',
      room: lang === 'hi' ? 'कमरा नं. 06' : 'Room No. 06',
      name: lang === 'hi' ? 'शिशु एवं बाल रोग (Pediatrics)' : 'Pediatrics & Child Care',
      currentToken: 'PD-22',
      waiting: 6,
      waitTime: '8-10 min',
      status: 'Low',
      icon: Baby,
      staff: 'डॉ. विक्रम चौधरी (उपस्थित)'
    }
  ]);

  // Handle Simulation Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDepartments(prev => 
        prev.map(dept => {
          const delta = Math.floor(Math.random() * 3) - 1;
          const newWait = Math.max(1, dept.waiting + delta);
          return {
            ...dept,
            waiting: newWait,
            status: newWait > 20 ? 'High' : newWait > 8 ? 'Moderate' : 'Low'
          };
        })
      );
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    if (filter === 'all') return departments;
    return departments.filter(d => d.category === filter);
  }, [filter, departments]);

  // Aggregate Stats
  const totalPatients = useMemo(() => departments.reduce((acc, curr) => acc + curr.waiting, 0), [departments]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-12 touch-manipulation overflow-x-hidden">
      
      {/* 1. Header with Breadcrumb & Language Switch */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Link
              href="/"
              className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition active:scale-95 shrink-0"
              title={current.backHome}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-snug truncate">
                  {current.pageTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {current.liveSync}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {current.pageSub}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 min-h-[34px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
              <span className="hidden xs:inline">{current.refreshBtn}</span>
            </button>

            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`min-h-[32px] px-2 py-0.5 text-xs font-black rounded-lg transition ${
                  lang === 'hi' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-h-[32px] px-2 py-0.5 text-xs font-black rounded-lg transition ${
                  lang === 'en' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 space-y-5 sm:space-y-6">

        {/* 2. Top Summary Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* Card 1: Total Waiting */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {current.totalWaiting}
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalPatients}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">लोग</span>
            </div>
          </div>

          {/* Card 2: Average Wait Time */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {current.avgWaitTime}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ~12
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">मिनट</span>
            </div>
          </div>

          {/* Card 3: Fastest Counter */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {current.fastestDept}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 min-w-0">
              <span className="text-sm sm:text-base font-black text-emerald-700 truncate block">
                एक्स-रे केंद्र (कमरा 11)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">प्रतीक्षा समय: ~4 मिनट</span>
            </div>
          </div>

          {/* Card 4: Peak Center */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {current.peakDept}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 min-w-0">
              <span className="text-sm sm:text-base font-black text-rose-700 truncate block">
                पैथोलॉजी लैब (कमरा 04)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">26 मरीज कतार में</span>
            </div>
          </div>

        </div>

        {/* 3. Desert Emergency Bypass Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xs sm:text-sm font-extrabold text-rose-950">
              {current.emergencyNoticeTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-rose-900 font-medium mt-0.5 leading-relaxed">
              {current.emergencyNoticeDesc}
            </p>
          </div>
        </div>

        {/* 4. Best Time to Visit Hourly Trend Strip */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                {current.bestTimeTitle}
              </h3>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
              अपडेट: {lastUpdated}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            {current.bestTimeDesc}
          </p>

          {/* Time Graph Bars */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 pt-2">
            {[
              { time: '08:00', level: '70%', label: 'मध्यम', color: 'bg-amber-400' },
              { time: '09:00', level: '100%', label: 'भारी भीड़', color: 'bg-rose-500' },
              { time: '10:00', level: '90%', label: 'भारी भीड़', color: 'bg-rose-500' },
              { time: '11:00', level: '60%', label: 'मध्यम', color: 'bg-amber-400' },
              { time: '12:00', level: '35%', label: 'कम भीड़', color: 'bg-emerald-500' },
              { time: '01:00', level: '20%', label: 'खाली', color: 'bg-emerald-500' },
            ].map((slot, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-full bg-slate-100 rounded-lg h-16 sm:h-20 flex items-end p-1">
                  <div 
                    className={`w-full rounded-md transition-all duration-500 ${slot.color}`} 
                    style={{ height: slot.level }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-700">{slot.time}</span>
                <span className="text-[9px] text-slate-400 font-medium hidden xs:inline">{slot.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Department Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: current.filterAll },
              { id: 'doc', label: current.filterDocs },
              { id: 'lab', label: current.filterLabs },
              { id: 'counter', label: current.filterCounters },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                  filter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500">
            {filteredList.length} केंद्र सक्रिय
          </span>
        </div>

        {/* 6. Live Room-by-Room Crowd Heatmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredList.map((dept) => {
            const Icon = dept.icon;
            const isHigh = dept.status === 'High';
            const isMod = dept.status === 'Moderate';

            const cardBorder = isHigh 
              ? 'border-rose-200 bg-rose-50/20' 
              : isMod 
              ? 'border-amber-200 bg-amber-50/20' 
              : 'border-slate-200 bg-white';

            const badgeColor = isHigh 
              ? 'bg-rose-100 text-rose-800 border-rose-300' 
              : isMod 
              ? 'bg-amber-100 text-amber-800 border-amber-300' 
              : 'bg-emerald-100 text-emerald-800 border-emerald-300';

            const badgeText = isHigh ? current.rushHigh : isMod ? current.rushMod : current.rushLow;

            return (
              <div
                key={dept.id}
                className={`rounded-2xl border p-4 shadow-xs transition hover:shadow-md flex flex-col justify-between gap-3 ${cardBorder}`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {dept.room}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Room Name */}
                  <div className="flex items-start gap-2.5 mt-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sky-600 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {dept.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {dept.staff}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Queue Stats Block */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      {current.servingNow}
                    </span>
                    <span className="text-base sm:text-lg font-black text-sky-700">
                      {dept.currentToken}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      {current.waitingCount}
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      {dept.waiting} मरीज
                    </span>
                  </div>
                </div>

                {/* Action Strip */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{current.estWait}</span>
                    <span className="font-extrabold text-slate-800">~{dept.waitTime}</span>
                  </div>

                  <Link
                    href="/kiosk"
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs shadow-xs transition active:scale-95"
                  >
                    <span>{current.getToken}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

// Fallback icon helper
function HeartPulseIcon(props) {
  return <Activity {...props} />;
}