'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Building2, 
  Bed, 
  Activity, 
  ShieldCheck, 
  Languages, 
  KeyRound, 
  LogOut, 
  UserPlus, 
  UserMinus, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Flame, 
  Wind, 
  X, 
  Check, 
  Phone, 
  Clock, 
  User
} from 'lucide-react';

const WARDS_CONFIG = [
  {
    id: 'icu',
    nameEn: 'ICU & Emergency Trauma Ward',
    nameHi: 'आईसीयू एवं आपातकालीन ट्रॉमा वार्ड',
    roomEn: 'Ground Floor • Ward 00',
    roomHi: 'भूतल • ट्रॉमा वार्ड 00',
    totalBeds: 8,
    color: 'rose',
    hasVentilators: true
  },
  {
    id: 'male',
    nameEn: 'Male Medical & Surgical Ward',
    nameHi: 'पुरुष चिकित्सा एवं सर्जिकल वार्ड',
    roomEn: 'First Floor • Ward 01',
    roomHi: 'प्रथम तल • वार्ड 01',
    totalBeds: 24,
    color: 'sky',
    hasVentilators: false
  },
  {
    id: 'female',
    nameEn: 'Female Medical & Maternity Ward',
    nameHi: 'महिला एवं प्रसूति वार्ड (Maternity)',
    roomEn: 'First Floor • Ward 02',
    roomHi: 'प्रथम तल • वार्ड 02',
    totalBeds: 20,
    color: 'purple',
    hasVentilators: false
  },
  {
    id: 'pediatrics',
    nameEn: 'Pediatrics / SNCU Ward',
    nameHi: 'शिशु एवं बाल रोग वार्ड (SNCU)',
    roomEn: 'Ground Floor • Ward 06',
    roomHi: 'भूतल • वार्ड 06',
    totalBeds: 12,
    color: 'emerald',
    hasVentilators: true
  }
];

const INITIAL_BEDS_DATA = [
  { id: 'ICU-01', bedNumber: 'ICU-B1', wardId: 'icu', status: 'occupied', patientName: 'Sumer Singh', mobile: '9829012345', parchiCode: '104829', doctor: 'Dr. S. K. Sharma', oxygenSupported: true, ventilatorOn: true, admittedAt: '06:30 AM' },
  { id: 'ICU-02', bedNumber: 'ICU-B2', wardId: 'icu', status: 'occupied', patientName: 'Bhanwari Devi', mobile: '9414098765', parchiCode: '209381', doctor: 'Dr. S. K. Sharma', oxygenSupported: true, ventilatorOn: false, admittedAt: '08:15 AM' },
  { id: 'ICU-03', bedNumber: 'ICU-B3', wardId: 'icu', status: 'available', patientName: '', mobile: '', parchiCode: '', doctor: '', oxygenSupported: true, ventilatorOn: false, admittedAt: '' },
  { id: 'ICU-04', bedNumber: 'ICU-B4', wardId: 'icu', status: 'available', patientName: '', mobile: '', parchiCode: '', doctor: '', oxygenSupported: true, ventilatorOn: false, admittedAt: '' },
  { id: 'MW-01', bedNumber: 'MW-01', wardId: 'male', status: 'occupied', patientName: 'Mohan Lal Paliwal', mobile: '9782109823', parchiCode: '619283', doctor: 'Dr. S. K. Sharma', oxygenSupported: true, ventilatorOn: false, admittedAt: '09:30 AM' },
  { id: 'MW-02', bedNumber: 'MW-02', wardId: 'male', status: 'available', patientName: '', mobile: '', parchiCode: '', doctor: '', oxygenSupported: false, ventilatorOn: false, admittedAt: '' },
  { id: 'FW-01', bedNumber: 'FW-01', wardId: 'female', status: 'occupied', patientName: 'Suman Kanwar', mobile: '9782134560', parchiCode: '581921', doctor: 'Dr. Anita Bishnoi', oxygenSupported: false, ventilatorOn: false, admittedAt: '05:40 AM' },
  { id: 'FW-02', bedNumber: 'FW-02', wardId: 'female', status: 'available', patientName: '', mobile: '', parchiCode: '', doctor: '', oxygenSupported: true, ventilatorOn: false, admittedAt: '' },
  { id: 'PED-01', bedNumber: 'NICU-1', wardId: 'pediatrics', status: 'occupied', patientName: 'Baby of Geeta', mobile: '9414098765', parchiCode: '109284', doctor: 'Dr. Vikram Choudhary', oxygenSupported: true, ventilatorOn: false, admittedAt: '09:00 AM' },
  { id: 'PED-02', bedNumber: 'NICU-2', wardId: 'pediatrics', status: 'available', patientName: '', mobile: '', parchiCode: '', doctor: '', oxygenSupported: true, ventilatorOn: false, admittedAt: '' }
];

export default function HospitalBedsTracker() {
  const [lang, setLang] = useState('en');
  const [isClientReady, setIsClientReady] = useState(false);

  const [isStaffMode, setIsStaffMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [staffPinInput, setStaffPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [selectedWardFilter, setSelectedWardFilter] = useState('all');
  const [searchPatient, setSearchPatient] = useState('');
  const [bedsList, setBedsList] = useState(INITIAL_BEDS_DATA);

  const [admitTargetBed, setAdmitTargetBed] = useState(null);
  const [formPatientName, setFormPatientName] = useState('');
  const [formParchiCode, setFormParchiCode] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDoctor, setFormDoctor] = useState('Dr. S. K. Sharma');
  const [formNeedOxygen, setFormNeedOxygen] = useState(true);

  useEffect(() => {
    setIsClientReady(true);
    const savedStaffSession = sessionStorage.getItem('beds_staff_authenticated');
    if (savedStaffSession === 'true') {
      setIsStaffMode(true);
    }
  }, []);

  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'hospital_beds'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveBeds = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setBedsList(liveBeds);
        }
      }, (err) => console.warn('Beds sync warning:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active on Beds:', err);
    }
  }, []);

  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleVerifyStaffPin = (e) => {
    e.preventDefault();
    if (staffPinInput === '2020') {
      setIsStaffMode(true);
      sessionStorage.setItem('beds_staff_authenticated', 'true');
      setShowPinModal(false);
      setStaffPinInput('');
      setPinError('');
    } else {
      setPinError(lang === 'en' ? 'Invalid PIN! Use 2020.' : 'गलत पिन! सही पिन 2020 दर्ज करें।');
    }
  };

  const handleLogoutStaff = () => {
    setIsStaffMode(false);
    sessionStorage.removeItem('beds_staff_authenticated');
  };

  const handleOpenAdmitModal = (bed) => {
    setAdmitTargetBed(bed);
    setFormPatientName('');
    setFormParchiCode(`${Math.floor(100000 + Math.random() * 900000)}`);
    setFormMobile('');
    setFormNeedOxygen(bed.oxygenSupported);
  };

  const handleConfirmAdmission = async (e) => {
    e.preventDefault();
    if (!admitTargetBed || !formPatientName.trim()) return;

    const updatedData = {
      status: 'occupied',
      patientName: formPatientName.trim(),
      parchiCode: formParchiCode.trim(),
      mobile: formMobile.trim() || '9829012345',
      doctor: formDoctor,
      oxygenSupported: formNeedOxygen,
      admittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBedsList(prev => prev.map(b => b.id === admitTargetBed.id ? { ...b, ...updatedData } : b));

    if (db && admitTargetBed.id && !admitTargetBed.id.includes('-')) {
      try {
        await updateDoc(doc(db, 'hospital_beds', admitTargetBed.id), {
          ...updatedData,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Admission update error:', err);
      }
    }

    setAdmitTargetBed(null);
  };

  const handleDischargePatient = async (bed) => {
    const clearedData = {
      status: 'available',
      patientName: '',
      mobile: '',
      parchiCode: '',
      doctor: '',
      ventilatorOn: false,
      admittedAt: ''
    };

    setBedsList(prev => prev.map(b => b.id === bed.id ? { ...b, ...clearedData } : b));

    if (db && bed.id && !bed.id.includes('-')) {
      try {
        await updateDoc(doc(db, 'hospital_beds', bed.id), {
          ...clearedData,
          dischargedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Discharge update error:', err);
      }
    }
  };

  const totalBeds = bedsList.length;
  const occupiedBeds = bedsList.filter(b => b.status === 'occupied').length;
  const vacantBeds = bedsList.filter(b => b.status === 'available').length;
  const oxygenBeds = bedsList.filter(b => b.status === 'available' && b.oxygenSupported).length;

  const filteredBeds = bedsList.filter(b => {
    if (selectedWardFilter !== 'all' && b.wardId !== selectedWardFilter) return false;
    if (!searchPatient.trim()) return true;
    const q = searchPatient.toLowerCase();
    return (
      b.bedNumber?.toLowerCase().includes(q) ||
      b.patientName?.toLowerCase().includes(q) ||
      b.parchiCode?.includes(q)
    );
  });

  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-100 overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <Link 
              href="/" 
              className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-xs hover:bg-teal-700 transition shrink-0"
              title="Home"
            >
              <Bed className="w-5 h-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-base font-black text-slate-900 truncate">
                  {lang === 'en' ? 'Hospital Wards & Bed Tracker' : 'अस्पताल वार्ड एवं बेड ट्रैकर'}
                </h1>
                <span className={`px-2 py-0.2 rounded-md text-[9px] font-black border shrink-0 ${
                  isStaffMode 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {isStaffMode ? (lang === 'en' ? 'Staff Mode ON' : 'स्टाफ मोड सक्रिय') : (lang === 'en' ? 'Public View' : 'पब्लिक व्यू')}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">
                Govt. Sub-District Hospital, Pokaran
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isStaffMode ? (
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="min-h-[34px] px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-1 transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{lang === 'en' ? 'Staff Login' : 'स्टाफ लॉगिन'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogoutStaff}
                className="min-h-[34px] px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{lang === 'en' ? 'Exit Staff' : 'लॉगआउट'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[34px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4 flex-1 pb-20 overflow-x-hidden">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl shrink-0"><Bed className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Total Beds' : 'कुल बेड'}</span>
              <h3 className="text-xl font-black text-slate-900">{totalBeds}</h3>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Vacant Beds' : 'खाली उपलब्ध'}</span>
              <h3 className="text-xl font-black text-emerald-600">{vacantBeds}</h3>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl shrink-0"><Wind className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Oxygen Free' : 'ऑक्सीजन खाली'}</span>
              <h3 className="text-xl font-black text-sky-600">{oxygenBeds}</h3>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0"><Flame className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Admitted' : 'भर्ती मरीज'}</span>
              <h3 className="text-xl font-black text-rose-600">{occupiedBeds}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedWardFilter('all')}
              className={`min-h-[32px] px-3 py-1 rounded-xl text-xs font-black transition shrink-0 ${
                selectedWardFilter === 'all' ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lang === 'en' ? 'All Wards' : 'सभी वार्ड'}
            </button>
            {WARDS_CONFIG.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWardFilter(w.id)}
                className={`min-h-[32px] px-3 py-1 rounded-xl text-xs font-black transition shrink-0 ${
                  selectedWardFilter === w.id ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {lang === 'en' ? w.nameEn.split('&')[0] : w.nameHi.split('(')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Bed, Parchi..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Beds Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredBeds.map((bed) => {
            const isOccupied = bed.status === 'occupied';

            return (
              <div
                key={bed.id}
                className={`p-3.5 rounded-2xl border-2 transition flex flex-col justify-between ${
                  isOccupied ? 'bg-rose-50/50 border-rose-300' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm px-2 py-0.5 bg-slate-900 text-white rounded-lg">
                      {bed.bedNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isOccupied ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isOccupied ? (lang === 'en' ? 'OCCUPIED' : 'भर्ती') : (lang === 'en' ? 'VACANT' : 'उपलब्ध')}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="space-y-1 bg-white p-2 rounded-xl border border-rose-200 text-xs">
                      <div className="font-black text-slate-900 truncate">{bed.patientName}</div>
                      <div className="text-[10px] text-slate-500">Parchi: {bed.parchiCode}</div>
                      <div className="text-[10px] text-slate-600 truncate">Dr: {bed.doctor}</div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                      {lang === 'en' ? 'Ready for admission' : 'भर्ती हेतु खाली'}
                    </div>
                  )}
                </div>

                {isStaffMode && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    {!isOccupied ? (
                      <button
                        type="button"
                        onClick={() => handleOpenAdmitModal(bed)}
                        className="w-full py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black transition"
                      >
                        {lang === 'en' ? 'Admit Patient' : 'मरीज भर्ती करें'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDischargePatient(bed)}
                        className="w-full py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition"
                      >
                        {lang === 'en' ? 'Discharge' : 'डिस्चार्ज करें'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* Staff PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-base font-black text-slate-900">Ward Staff Login</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter 4-Digit Ward PIN (Default: 2020)</p>

            <form onSubmit={handleVerifyStaffPin} className="mt-4 space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={staffPinInput}
                onChange={(e) => {
                  setStaffPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setPinError('');
                }}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-2xl font-black py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />

              {pinError && (
                <div className="p-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">{pinError}</div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admit Modal */}
      {admitTargetBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl">
            <h3 className="text-base font-black text-slate-900">Admit to {admitTargetBed.bedNumber}</h3>
            
            <form onSubmit={handleConfirmAdmission} className="mt-3 space-y-3">
              <input
                type="text"
                required
                autoFocus
                placeholder="Patient Full Name"
                value={formPatientName}
                onChange={(e) => setFormPatientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Parchi Code"
                  value={formParchiCode}
                  onChange={(e) => setFormParchiCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile (10 digits)"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdmitTargetBed(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Confirm Admit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

