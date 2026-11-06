'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Building2, 
  Ticket, 
  Printer, 
  RotateCcw, 
  Languages, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle, 
  Stethoscope, 
  Baby, 
  User, 
  Activity, 
  ScanLine, 
  Layers, 
  Smile, 
  Eye
} from 'lucide-react';

// ==============================================================
// 1. HOSPITAL DEPARTMENTS DIRECTORY
// ==============================================================
const KIOSK_DEPARTMENTS = [
  {
    id: 'opd',
    prefix: 'OPD',
    room: 'Room 01',
    nameEn: 'General Medicine (Physician)',
    nameHi: 'सामान्य चिकित्सा (फिजिशियन)',
    doctorEn: 'Dr. S. K. Sharma (MD)',
    doctorHi: 'डॉ. एस. के. शर्मा',
    symptomsEn: 'Fever, Cold, Cough, Sugar, BP, Infection',
    symptomsHi: 'बुखार, जुकाम, खांसी, शुगर, बीपी, उल्टी-दस्त',
    icon: Stethoscope
  },
  {
    id: 'gynae',
    prefix: 'GYN',
    room: 'Room 03',
    nameEn: 'Ladies / Gynae & ANC',
    nameHi: 'महिला एवं प्रसूति रोग (ANC)',
    doctorEn: 'Dr. Anita Bishnoi (MS)',
    doctorHi: 'डॉ. अनिता विश्नोई',
    symptomsEn: 'Pregnancy ANC, Delivery, PCOD, Periods issue',
    symptomsHi: 'गर्भावस्था जांच, प्रसव पूर्व परामर्श, महिला रोग',
    icon: User
  },
  {
    id: 'pediatrics',
    prefix: 'PED',
    room: 'Room 06',
    nameEn: 'Child Specialist (Pediatrics)',
    nameHi: 'शिशु एवं बाल रोग (बच्चों के डॉक्टर)',
    doctorEn: 'Dr. Vikram Choudhary (MD)',
    doctorHi: 'डॉ. विक्रम चौधरी',
    symptomsEn: 'Infant illness, Child fever, Vaccination',
    symptomsHi: 'बच्चों की बीमारी, बाल टीकाकरण, पोषण जांच',
    icon: Baby
  },
  {
    id: 'ortho',
    prefix: 'ORT',
    room: 'Room 09',
    nameEn: 'Bone & Joints (Orthopedic)',
    nameHi: 'हड्डी एवं जोड़ रोग (ऑर्थोपेडिक)',
    doctorEn: 'Dr. Ramesh Singh (MS)',
    doctorHi: 'डॉ. रमेश सिंह',
    symptomsEn: 'Bone Fracture, Sprain, Joint pain, Spine pain',
    symptomsHi: 'हड्डी टूटना, मोच, गठिया दर्द, कमर व घुटने का दर्द',
    icon: Activity
  },
  {
    id: 'pathology',
    prefix: 'BLD',
    room: 'Room 04',
    nameEn: 'Pathology & Blood Testing',
    nameHi: 'पैथोलॉजी व खून जांच केंद्र',
    doctorEn: 'Suresh Kumar (Sr. Tech)',
    doctorHi: 'सुरेश कुमार (लैब प्रभारी)',
    symptomsEn: 'CBC, Sugar, Dengue, Malaria, Urine test',
    symptomsHi: 'खून, पेशाब, सीबीसी, प्लेटलेट व शुगर जांच',
    icon: Activity
  },
  {
    id: 'xray',
    prefix: 'XRY',
    room: 'Room 07',
    nameEn: 'Digital X-Ray & Radiology',
    nameHi: 'डिजिटल एक्स-रे केंद्र',
    doctorEn: 'Rameshwar Lal (Radiographer)',
    doctorHi: 'रामेश्वर लाल (रेडियोग्राफर)',
    symptomsEn: 'Chest PA, Bone Fracture, Spine Digital X-Ray',
    symptomsHi: 'छाती, पसली, हाथ-पैर व रीढ़ की हड्डी एक्स-रे',
    icon: ScanLine
  },
  {
    id: 'usg',
    prefix: 'USG',
    room: 'Room 11',
    nameEn: 'Sonography & Ultrasound (USG)',
    nameHi: 'सोनोग्राफी एवं अल्ट्रासाउंड केंद्र',
    doctorEn: 'Dr. Anita Bishnoi (Sonologist)',
    doctorHi: 'डॉ. अनिता विश्नोई',
    symptomsEn: 'Abdomen scan, Pregnancy ANC Ultrasound, Stone',
    symptomsHi: 'पेट की सोनोग्राफी, पथरी, प्रसव पूर्व जांच',
    icon: Layers
  },
  {
    id: 'dental',
    prefix: 'DEN',
    room: 'Room 10',
    nameEn: 'Dental Surgery (Dentist)',
    nameHi: 'दंत चिकित्सा (दांतों के डॉक्टर)',
    doctorEn: 'Dr. Rahul Joshi (BDS)',
    doctorHi: 'डॉ. राहुल जोशी',
    symptomsEn: 'Toothache, Cavity, Gum swelling, Extraction',
    symptomsHi: 'दांत दर्द, मसूड़ों की सूजन, कीड़ा, दांत निकालना',
    icon: Smile
  },
  {
    id: 'eye',
    prefix: 'EYE',
    room: 'Room 02',
    nameEn: 'Eye Care & Vision (Eye Doctor)',
    nameHi: 'नेत्र रोग (आंखों की जांच)',
    doctorEn: 'Dr. K. L. Bishnoi (MS)',
    doctorHi: 'डॉ. के. एल. विश्नोई',
    symptomsEn: 'Vision testing, Cataract, Eye redness/pain',
    symptomsHi: 'आंखों की रोशनी, मोतियाबिंद, चश्मे का नंबर',
    icon: Eye
  }
];

// ==============================================================
// 2. MULTILINGUAL DICTIONARY
// ==============================================================
const KIOSK_TEXTS = {
  en: {
    kioskTitle: 'OPD Registration Kiosk',
    kioskSub: 'Govt. Sub-District Hospital, Pokaran • Free Healthcare',
    step1Title: 'Step 1: Select Department or Illness',
    step1Sub: 'Tap on your required specialist or test center',
    step2Title: 'Step 2: Enter Patient Details',
    step2Sub: 'Provide basic demographic details for the digital slip',
    schemeBadge: '100% Free Service • Rajasthan MNJY / MNDY Scheme',
    patientNameLabel: 'Patient Full Name *',
    namePlaceholder: 'Enter full name...',
    mobileLabel: 'Mobile Number (10 Digits) *',
    mobilePlaceholder: 'e.g. 9829012345...',
    ageLabel: 'Age (Years) *',
    genderLabel: 'Gender *',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    btnGenerate: 'Generate Token & Print Slip',
    btnBackStep: 'Back to Departments',
    slipTitle: 'GOVERNMENT SUB-DISTRICT HOSPITAL, POKARAN',
    slipSub: 'Department of Health & Family Welfare, Govt. of Rajasthan',
    freeNotice: 'CHIEF MINISTER FREE HEALTHCARE SCHEME (MNJY / MNDY)',
    tokenLabel: 'TOKEN NO',
    parchiLabel: '6-Digit Parchi Code',
    patientLabel: 'Patient',
    ageGenderLabel: 'Age / Gender',
    deptLabel: 'Department',
    doctorLabel: 'Doctor',
    roomLabel: 'Assigned Room',
    dateTimeLabel: 'Date & Time',
    trackerInstruction: '📱 Live mobile queue status: hospital-pokaran.in/tracker',
    medicineNotice: 'Collect free medicines from Room 05 (DDC Counter).',
    btnPrint: 'Print Thermal Slip',
    btnNewToken: 'Register Next Patient',
    footerText: 'Government Hospital Pokaran • Patient Token Kiosk • Powered by Webnexa'
  },
  hi: {
    kioskTitle: 'स्वयं-सेवा ओपीडी टोकन पर्ची कियोस्क',
    kioskSub: 'राजकीय सामान्य चिकित्सालय पोकरण • 100% निःशुल्क सेवा',
    step1Title: 'चरण 1: बीमारी या विभाग का चयन करें',
    step1Sub: 'अपनी तकलीफ के अनुसार संबंधित डॉक्टर या जांच केंद्र पर टैप करें',
    step2Title: 'चरण 2: मरीज का विवरण दर्ज करें',
    step2Sub: 'डिजिटल पर्ची निर्माण हेतु नाम एवं फोन नंबर दर्ज करें',
    schemeBadge: '100% निःशुल्क जांच व उपचार • मुख्यमंत्री निरोगी राजस्थान योजना',
    patientNameLabel: 'मरीज का पूरा नाम *',
    namePlaceholder: 'मरीज का नाम दर्ज करें...',
    mobileLabel: 'मोबाइल नंबर (10 अंक) *',
    mobilePlaceholder: 'उदा. 9829012345...',
    ageLabel: 'उम्र (वर्ष) *',
    genderLabel: 'लिंग *',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    btnGenerate: 'टोकन बनाएं एवं पर्ची प्राप्त करें',
    btnBackStep: 'वापस विभाग बदलें',
    slipTitle: 'राजकीय सामान्य चिकित्सालय, पोकरण (जैसलमेर)',
    slipSub: 'चिकित्सा एवं स्वास्थ्य विभाग, राजस्थान सरकार',
    freeNotice: 'मुख्यमंत्री निःशुल्क निरोगी राजस्थान योजना (100% फ्री)',
    tokenLabel: 'टोकन संख्या (TOKEN)',
    parchiLabel: '6-अंकों का पर्ची कोड',
    patientLabel: 'मरीज का नाम',
    ageGenderLabel: 'उम्र / लिंग',
    deptLabel: 'विभाग / विशेषज्ञता',
    doctorLabel: 'उपस्थित चिकित्सक',
    roomLabel: 'कक्ष संख्या (कमरा नं.)',
    dateTimeLabel: 'जारी दिनांक व समय',
    trackerInstruction: '📱 अपने फोन पर लाइव नंबर देखें: hospital-pokaran.in/tracker',
    medicineNotice: 'परामर्श बाद निःशुल्क दवाइयां कमरा नं. 05 (DDC काउंटर) से प्राप्त करें।',
    btnPrint: 'थर्मल पर्ची प्रिंट करें',
    btnNewToken: 'अगले मरीज की पर्ची बनाएं',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • कियोस्क प्रणाली • Webnexa Health'
  }
};

export default function PatientKioskRegistration() {
  const [lang, setLang] = useState('en');
  const t = KIOSK_TEXTS[lang];

  // 100% Hydration Proof Client-Only Mount Flag
  const [isClientReady, setIsClientReady] = useState(false);

  // Kiosk Flow States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState(KIOSK_DEPARTMENTS[0]);

  // Form Inputs
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generated Slip Data
  const [generatedSlip, setGeneratedSlip] = useState(null);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Safe Guard: Until client mounts completely, render empty container (Immune to Extension HTML Injection)
  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSelectDepartment = (dept) => {
    setSelectedDept(dept);
    setCurrentStep(2);
    setFormError('');
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();

    if (!patientName.trim()) {
      setFormError(lang === 'en' ? 'Please enter patient name' : 'कृपया मरीज का नाम दर्ज करें');
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const tokenNumber = `${selectedDept.prefix}-${randomSuffix}`;
    const parchiCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `PKR-${Math.floor(10000 + Math.random() * 90000)}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRecord = {
      tokenNumber,
      parchiCode,
      trackingCode,
      patientName: patientName.trim(),
      mobile: cleanPhone,
      age: `${patientAge} Yrs`,
      gender: patientGender,
      departmentId: selectedDept.id,
      departmentName: selectedDept.nameEn,
      doctorName: selectedDept.doctorEn,
      roomNumber: selectedDept.room,
      status: 'waiting',
      timeStr,
      dateStr,
      isEmergency: false
    };

    if (db) {
      try {
        await addDoc(collection(db, 'tokens'), {
          ...newRecord,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore fallback note:', err);
      }
    }

    setGeneratedSlip(newRecord);
    setCurrentStep(3);
    setIsSubmitting(false);
  };

  const handleResetForNext = () => {
    setPatientName('');
    setMobileNumber('');
    setPatientAge('32');
    setPatientGender('Male');
    setGeneratedSlip(null);
    setCurrentStep(1);
    setFormError('');
  };

  const handlePrintSlip = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div 
      translate="no" 
      className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-100 overflow-x-hidden font-sans"
    >
      
      {/* 1. Header (Hidden during printing) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs w-full print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <Link 
              href="/" 
              className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xs hover:bg-sky-700 transition shrink-0"
              title="Home"
            >
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-base font-black text-slate-900 truncate">
                  {t.kioskTitle}
                </h1>
                <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black rounded-md hidden xs:inline">
                  Free OPD
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">
                {t.kioskSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[34px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 overflow-x-hidden">
        
        {/* Rajasthan Govt Scheme Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-2.5 sm:p-3 rounded-2xl shadow-xs mb-4 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs font-black truncate">
              {t.schemeBadge}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-lg shrink-0">
            ₹0 Fee
          </span>
        </div>

        {/* STEP 1: SELECT SPECIALTY / ROOM */}
        {currentStep === 1 && (
          <div className="space-y-3.5 print:hidden">
            <div>
              <h2 className="text-sm sm:text-lg font-black text-slate-900">
                {t.step1Title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.step1Sub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {KIOSK_DEPARTMENTS.map((dept) => {
                const IconComponent = dept.icon;

                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => handleSelectDepartment(dept)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-md transition text-left flex flex-col justify-between group active:scale-98 min-h-[110px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition">
                          {dept.room}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-600 transition leading-snug">
                        {lang === 'en' ? dept.nameEn : dept.nameHi}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {lang === 'en' ? dept.doctorEn : dept.doctorHi}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                        {lang === 'en' ? dept.symptomsEn : dept.symptomsHi}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PATIENT DETAIL ENTRY */}
        {currentStep === 2 && (
          <div className="max-w-xl mx-auto space-y-4 print:hidden">
            
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase block">Selected Clinic:</span>
                  <strong className="text-xs sm:text-sm font-black text-slate-900 block">
                    {selectedDept.room} : {lang === 'en' ? selectedDept.nameEn : selectedDept.nameHi}
                  </strong>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {lang === 'en' ? selectedDept.doctorEn : selectedDept.doctorHi}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-300 transition shrink-0"
                >
                  Change
                </button>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  {t.step2Title}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t.step2Sub}
                </p>
              </div>

              <form onSubmit={handleGenerateToken} className="space-y-3.5">
                
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    {t.patientNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    {t.mobileLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t.mobilePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      {t.ageLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={110}
                      required
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      {t.genderLabel}
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPatientGender(g)}
                          className={`py-2 rounded-xl text-xs font-black transition border ${
                            patientGender === g
                              ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {g === 'Male' ? t.male : g === 'Female' ? t.female : t.other}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 pt-1"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>{t.btnGenerate}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 pt-1"
                >
                  ← {t.btnBackStep}
                </button>

              </form>

            </div>

          </div>
        )}

        {/* STEP 3: OFFICIAL THERMAL SLIP & PRINT */}
        {currentStep === 3 && generatedSlip && (
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Screen Action Bar */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="flex-1 min-h-[44px] bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.btnPrint}</span>
              </button>

              <button
                type="button"
                onClick={handleResetForNext}
                className="min-h-[44px] px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition active:scale-98 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btnNewToken}</span>
              </button>
            </div>

            {/* Standard 58mm/80mm Thermal Slip Layout */}
            <div id="thermal-receipt" className="bg-white border-2 border-slate-900 p-4 sm:p-6 rounded-2xl shadow-xl font-mono text-slate-900 space-y-3 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
              
              <div className="text-center border-b border-dashed border-slate-400 pb-2.5">
                <h3 className="font-sans font-black text-xs sm:text-sm tracking-tight leading-tight">
                  {t.slipTitle}
                </h3>
                <p className="font-sans text-[9px] text-slate-500 font-bold mt-0.5">
                  {t.slipSub}
                </p>
                <span className="inline-block mt-1 font-sans text-[8px] font-black uppercase px-2 py-0.2 bg-slate-900 text-white rounded">
                  {t.freeNotice}
                </span>
              </div>

              <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-xl my-2 print:bg-transparent print:border-dashed">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  {t.tokenLabel}
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-slate-950">
                  {generatedSlip.tokenNumber}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-0.5">
                  {t.parchiLabel}: <strong className="text-slate-900 font-black">{generatedSlip.parchiCode}</strong>
                </div>
              </div>

              <div className="text-xs space-y-1.5 border-b border-dashed border-slate-400 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.patientLabel}:</span>
                  <span className="font-black text-slate-950 text-right truncate max-w-[180px]">{generatedSlip.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.ageGenderLabel}:</span>
                  <span className="font-bold">{generatedSlip.age} / {generatedSlip.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile:</span>
                  <span className="font-bold">+91 {generatedSlip.mobile}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">{t.deptLabel}:</span>
                  <span className="font-black text-right text-sky-800">{generatedSlip.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.doctorLabel}:</span>
                  <span className="font-bold text-right truncate max-w-[170px]">{generatedSlip.doctorName}</span>
                </div>
                <div className="flex justify-between bg-slate-100 p-1 rounded font-black text-slate-900">
                  <span>{t.roomLabel}:</span>
                  <span className="text-sm underline">{generatedSlip.roomNumber}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>{t.dateTimeLabel}:</span>
                  <span>{generatedSlip.dateStr} • {generatedSlip.timeStr}</span>
                </div>
              </div>

              <div className="text-[10px] space-y-1 text-center font-sans font-medium text-slate-600 pt-1">
                <p className="font-bold text-slate-900">
                  {t.trackerInstruction}
                </p>
                <p className="text-[9px] text-slate-500">
                  {t.medicineNotice}
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 font-semibold print:hidden">
        {t.footerText}
      </footer>

      {/* CSS for Direct 58mm/80mm Thermal Receipt Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt, #thermal-receipt * {
            visibility: visible;
          }
          #thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 80mm;
            padding: 2mm !important;
            margin: 0 !important;
            border: none !important;
          }
          @page {
            size: auto;
            margin: 0;
          }
        }
      `}</style>

    </div>
  );
}