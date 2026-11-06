'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Building2, Search, ArrowLeft, Download, Eye, CheckCircle2, ShieldCheck, Calendar, Phone } from 'lucide-react';

const RECENT_REPORTS = [
  { id: 'REP-101', parchiCode: '619283', patientName: 'Mohan Lal Paliwal', department: 'General OPD', doctor: 'Dr. S. K. Sharma', date: '06 Nov 2026', type: 'Prescription', status: 'Available' },
  { id: 'REP-102', parchiCode: '104829', patientName: 'Kalyan Singh Jodha', department: 'Pathology Lab', doctor: 'Suresh Kumar', date: '06 Nov 2026', type: 'CBC & Blood Sugar', status: 'Available' },
  { id: 'REP-103', parchiCode: '409182', patientName: 'Ramprasad Bishnoi', department: 'Digital X-Ray', doctor: 'Rameshwar Lal', date: '06 Nov 2026', type: 'Chest PA View', status: 'Available' },
  { id: 'REP-104', parchiCode: '581920', patientName: 'Suman Choudhary', department: 'Sonography USG', doctor: 'Dr. Anita Bishnoi', date: '06 Nov 2026', type: 'USG Whole Abdomen', status: 'Available' },
  { id: 'REP-105', parchiCode: '782190', patientName: 'Kailash Chand Verma', department: 'General OPD', doctor: 'Dr. S. K. Sharma', date: '06 Nov 2026', type: 'Prescription', status: 'Available' }
];

export default function ReportsArchivePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = RECENT_REPORTS.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.parchiCode.includes(searchTerm) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-xs">
              <FileText className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900">Hospital Diagnostic Reports Archive</h1>
              <p className="text-[10px] text-slate-500 font-semibold">Govt. Sub-District Hospital, Pokaran</p>
            </div>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-5 flex-1 w-full space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-300" />
            <span className="text-xs sm:text-sm font-black">Official Digital Patient Health Records (OPD, Lab, X-Ray & USG)</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">Digital Archive</span>
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient Name, 6-digit Parchi Code, or Department..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Reports Table / Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Verified Reports Available ({filteredReports.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Today: 06 Nov 2026</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs px-2 py-0.5 bg-slate-900 text-amber-400 rounded-md">
                      Parchi: {report.parchiCode}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{report.patientName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                      {report.department}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Investigation: <strong className="text-slate-800">{report.type}</strong> • Signed by: {report.doctor}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{report.status}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Opening report for Parchi ${report.parchiCode}`)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 font-semibold">
        Govt. Hospital Pokaran • Reports Archive • Webnexa Health
      </footer>
    </div>
  );
}