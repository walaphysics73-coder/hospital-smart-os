'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Home, 
  Users, 
  Bed, 
  Ticket, 
  ExternalLink,
  Code2,
  Sparkles,
  HeartPulse,
  Mail,
  MessageSquare,
  Globe,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  return (
    <>
      {/* 1. Main Informative Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          
          {/* Top 4-Column Hospital Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            
            {/* Col 1: Hospital Info */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2.5 text-white">
                <div className="w-9 h-9 bg-sky-600 rounded-xl flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight leading-tight">
                    पोकरण हॉस्पिटल OS
                  </h3>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Smart Queue & Hospital Management
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                राजकीय सामान्य चिकित्सालय, पोकरण (जैसलमेर)। आमजन को कतार-मुक्त, पारदर्शी एवं डिजिटल स्वास्थ्य सुविधाएं उपलब्ध कराने हेतु समर्पित।
              </p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-lg text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>चिकित्सा एवं स्वास्थ्य विभाग, राजस्थान</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                डिजिटल सुविधाएं
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/kiosk" className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    सेल्फ टोकन कियोस्क (पर्ची स्कैनर)
                  </Link>
                </li>
                <li>
                  <Link href="/crowd" className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    लाइव ओपीडी भीड़ मीटर
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    जांच रिपोर्ट डाउनलोड वॉल्ट (BH01)
                  </Link>
                </li>
                <li>
                  <Link href="/beds" className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    आईपीडी वार्ड एवं खाली बेड स्थिति
                  </Link>
                </li>
                <li>
                  <Link href="/medicines" className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    निःशुल्क दवा स्टॉक स्टेटस (DDC)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: OPD Timings */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                समय सारिणी (Timings)
              </h4>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <div>
                  <span className="text-slate-200 font-bold block">ग्रीष्मकालीन (Summer OPD):</span>
                  प्रातः 08:00 AM से 02:00 PM
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">शीतकालीन (Winter OPD):</span>
                  प्रातः 09:00 AM से 03:00 PM
                </div>
                <div className="pt-1">
                  <span className="text-rose-400 font-bold block flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5" />
                    आपातकालीन ट्रॉमा वार्ड 00:
                  </span>
                  24 घंटे सातों दिन (सर्पदंश व हीटस्ट्रोक तैयार)
                </div>
              </div>
            </div>

            {/* Col 4: Contact & Helpdesk */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                संपर्क एवं आपातकालीन नंबर
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                रामदेवरा रोड, पोकरण, जिला - जैसलमेर (राजस्थान) - 345021
              </p>
              <div className="space-y-1.5 text-xs pt-1">
                <a href="tel:108" className="flex items-center gap-2 text-slate-300 hover:text-rose-400 transition">
                  <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>एम्बुलेंस सेवा: <strong className="text-rose-400 font-extrabold">108</strong></span>
                </a>
                <a href="tel:104" className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>स्वास्थ्य हेल्पलाइन: <strong className="text-sky-400 font-bold">104</strong></span>
                </a>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>हॉस्पिटल डेस्क: <strong>02994-222XXX</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Webnexa Premium Technology Partner Showcase Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              
              {/* Brand & Tagline */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                    Technology & Digital Architecture Partner
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Webnexa
                  </h3>
                  <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold px-2 py-0.5 rounded-full">
                    Pokaran & Beyond
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  <strong>Tagline:</strong> <em>"Empowering Healthcare & Modern Businesses with Ultra-Fast Digital Solutions"</em>
                  <br />
                  अस्पताल प्रबंधन, हाई-स्पीड वेब ऍप्लिकेशन्स और कस्टम सॉफ्टवेयर सॉल्यूशंस के लिए समर्पित डिजिटल एजेंसी।
                </p>
              </div>

              {/* Direct Action & Contact Triggers */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                
                {/* WhatsApp Trigger */}
                <a
                  href="https://wa.me/918619089899?text=Namaste%20Webnexa%2C%20I%20am%20interested%20in%20your%20software%20and%20web%20development%20solutions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Direct Call */}
                <a
                  href="tel:+918619089899"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>+91 861 908 9899</span>
                </a>

                {/* Email Trigger */}
                <a
                  href="mailto:webnexa2026@gmail.com"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95"
                  title="Email Webnexa"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Us</span>
                </a>

                {/* Live Website Link */}
                <a
                  href="https://webnexa-wine.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-extrabold shadow-md transition active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Webnexa</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

              </div>

            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p className="text-center sm:text-left text-[11px]">
              © {new Date().getFullYear()} राजकीय सामान्य चिकित्सालय, पोकरण (जैसलमेर). सर्वाधिकार सुरक्षित।
            </p>
            <p className="text-center sm:text-right text-[11px] text-slate-400">
              Architecture & Security powered by <strong>Webnexa</strong>.
            </p>
          </div>

        </div>
      </footer>

      {/* 3. Mobile App-Style Sticky Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <Link 
          href="/" 
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-sky-600 transition min-w-[50px] py-1"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">होम</span>
        </Link>

        <Link 
          href="/kiosk" 
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-sky-600 transition min-w-[50px] py-1"
        >
          <Ticket className="w-5 h-5" />
          <span className="text-[10px] font-bold">टोकन</span>
        </Link>

        <Link 
          href="/crowd" 
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-sky-600 transition min-w-[50px] py-1"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">भीड़ मीटर</span>
        </Link>

        <Link 
          href="/beds" 
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-sky-600 transition min-w-[50px] py-1"
        >
          <Bed className="w-5 h-5" />
          <span className="text-[10px] font-bold">वार्ड बेड</span>
        </Link>
      </nav>
    </>
  );
}