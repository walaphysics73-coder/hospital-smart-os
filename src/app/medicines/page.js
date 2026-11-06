'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pill, Building2, Search, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

const COMMON_DRUGS = [
  { name: 'Tab. Paracetamol 650 mg', type: 'Tablet', stock: 'In Stock (4,200 Tabs)', mndy: 'Free MNDY' },
  { name: 'Tab. Pantoprazole 40 mg', type: 'Tablet', stock: 'In Stock (2,800 Tabs)', mndy: 'Free MNDY' },
  { name: 'Tab. Amoxicillin + Clavulanic 625 mg', type: 'Antibiotic', stock: 'In Stock (1,150 Tabs)', mndy: 'Free MNDY' },
  { name: 'Tab. Cetirizine 10 mg', type: 'Antiallergic', stock: 'In Stock (3,400 Tabs)', mndy: 'Free MNDY' },
  { name: 'Tab. Metformin 500 mg', type: 'Diabetes', stock: 'In Stock (5,000 Tabs)', mndy: 'Free MNDY' },
  { name: 'Tab. Amlodipine 5 mg', type: 'Hypertension', stock: 'In Stock (3,800 Tabs)', mndy: 'Free MNDY' },
  { name: 'ORS Sachet (Oral Rehydration Salts)', type: 'Powder', stock: 'In Stock (900 Packets)', mndy: 'Free MNDY' },
  { name: 'Syp. Paracetamol 120 mg/5ml', type: 'Syrup (Pediatric)', stock: 'In Stock (420 Bottles)', mndy: 'Free MNDY' }
];

export default function MedicinesStockPage() {
  const [search, setSearch] = useState('');

  const filtered = COMMON_DRUGS.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-xs">
              <Pill className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900">Room 05 : Free Medicine Store (DDC)</h1>
              <p className="text-[10px] text-slate-500 font-semibold">Govt. Hospital Pokaran • MNDY Scheme</p>
            </div>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 flex-1 w-full space-y-4">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-black">Mukhyamantri Nishulk Dava Yojana (MNDY) Live Drug Inventory</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/30 px-2 py-0.5 rounded">100% Free</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine name, salt or type..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((drug, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">{drug.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{drug.type} • {drug.mndy}</p>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black shrink-0">
                {drug.stock}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 font-semibold">
        Govt. Hospital Pokaran • Room 05 Pharmacy • Webnexa Health
      </footer>
    </div>
  );
}