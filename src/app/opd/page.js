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
  Stethoscope, 
  Lock, 
  KeyRound, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Search, 
  FileCheck, 
  AlertCircle, 
  Share2, 
  X, 
  Sparkles, 
  LogOut, 
  Check, 
  Languages, 
  Pill, 
  Printer, 
  Activity, 
  Plus, 
  Trash2,
  Users,
  Megaphone,
  UserCheck,
  Baby,
  Eye,
  Smile,
  Ear,
  Sparkle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// ==============================================================
// 1. ALL 8 OPD SPECIALTY DOCTORS & CHAMBERS DIRECTORY
// ==============================================================
export const OPD_DOCTORS_DIRECTORY = [
  {
    id: 'opd_gen',
    roomNumber: 'Room 01',
    doctorNameEn: 'Dr. S. K. Sharma (MD Physician)',
    doctorNameHi: 'डॉ. एस. के. शर्मा (वरिष्ठ फिजिशियन)',
    specialtyEn: 'General Medicine (Fever, BP, Sugar, Infection)',
    specialtyHi: 'सामान्य चिकित्सा (बुखार, बीपी, शुगर, संक्रमण)',
    badgeEn: 'Gen Medicine',
    badgeHi: 'जनरल फिजिशियन',
    prefix: 'OPD',
    color: 'emerald',
    icon: Stethoscope
  },
  {
    id: 'opd_gynae',
    roomNumber: 'Room 03',
    doctorNameEn: 'Dr. Anita Bishnoi (MS Gynae)',
    doctorNameHi: 'डॉ. अनिता विश्नोई (स्त्री एवं प्रसूति रोग विशेषज्ञ)',
    specialtyEn: 'Ladies / Gynae & Obstetrics (Pregnancy, ANC, PCOD)',
    specialtyHi: 'महिला एवं प्रसूति रोग (गर्भावस्था, प्रसव पूर्व, पीसीओडी)',
    badgeEn: 'Ladies / Gynae',
    badgeHi: 'महिला विशेषज्ञ',
    prefix: 'GYN',
    color: 'purple',
    icon: User
  },
  {
    id: 'opd_pedia',
    roomNumber: 'Room 06',
    doctorNameEn: 'Dr. Vikram Choudhary (MD Pediatrics)',
    doctorNameHi: 'डॉ. विक्रम चौधरी (शिशु एवं बाल रोग विशेषज्ञ)',
    specialtyEn: 'Child Specialist (Infant, Child Care, Vaccination)',
    specialtyHi: 'शिशु एवं बाल रोग (बच्चों की जांच, टीकाकरण, पोषण)',
    badgeEn: 'Child Specialist',
    badgeHi: 'बच्चों के डॉक्टर',
    prefix: 'PED',
    color: 'sky',
    icon: Baby
  },
  {
    id: 'opd_ortho',
    roomNumber: 'Room 09',
    doctorNameEn: 'Dr. Ramesh Singh (MS Orthopedics)',
    doctorNameHi: 'डॉ. रमेश सिंह (हड्डी एवं जोड़ रोग विशेषज्ञ)',
    specialtyEn: 'Bone & Joints (Fractures, Arthritis, Spine, Pain)',
    specialtyHi: 'हड्डी एवं जोड़ रोग (फ्रैक्चर, मोच, गठिया, कमर दर्द)',
    badgeEn: 'Bone & Joints',
    badgeHi: 'हड्डी रोग विशेषज्ञ',
    prefix: 'ORT',
    color: 'amber',
    icon: Activity
  },
  {
    id: 'opd_eye',
    roomNumber: 'Room 02',
    doctorNameEn: 'Dr. K. L. Bishnoi (MS Eye)',
    doctorNameHi: 'डॉ. के. एल. विश्नोई (नेत्र रोग विशेषज्ञ)',
    specialtyEn: 'Ophthalmology (Vision, Cataract, Eye Checkup)',
    specialtyHi: 'नेत्र रोग (मोतियाबिंद, दृष्टि परीक्षण, आंखों की एलर्जी)',
    badgeEn: 'Eye Care',
    badgeHi: 'आंखों के डॉक्टर',
    prefix: 'EYE',
    color: 'teal',
    icon: Eye
  },
  {
    id: 'opd_dental',
    roomNumber: 'Room 10',
    doctorNameEn: 'Dr. Rahul Joshi (BDS Dental)',
    doctorNameHi: 'डॉ. राहुल जोशी (दंत रोग विशेषज्ञ)',
    specialtyEn: 'Dental Surgery (Toothache, Gum care, Extraction)',
    specialtyHi: 'दंत चिकित्सा (दांत दर्द, आरसीटी, मसूड़े, दांत निकालना)',
    badgeEn: 'Dental Care',
    badgeHi: 'दांतों के डॉक्टर',
    prefix: 'DEN',
    color: 'rose',
    icon: Smile
  },
  {
    id: 'opd_ent',
    roomNumber: 'Room 12',
    doctorNameEn: 'Dr. Preeti Sharma (MS ENT)',
    doctorNameHi: 'डॉ. प्रीति शर्मा (कान, नाक एवं गला विशेषज्ञ)',
    specialtyEn: 'ENT (Ear, Nose, Throat, Sinus, Tonsil)',
    specialtyHi: 'कान, नाक व गला (कान बहना, टॉन्सिल, साइनस, आवाज)',
    badgeEn: 'ENT Specialist',
    badgeHi: 'कान-नाक-गला',
    prefix: 'ENT',
    color: 'indigo',
    icon: Ear
  },
  {
    id: 'opd_ayush',
    roomNumber: 'Room 08',
    doctorNameEn: 'Dr. Suresh Paliwal (BAMS Ayush)',
    doctorNameHi: 'डॉ. सुरेश पालीवाल (आयुष एवं प्राकृतिक चिकित्सा)',
    specialtyEn: 'Ayush & Wellness (Digestive, Immunity, Chronic Care)',
    specialtyHi: 'आयुष एवं प्राकृतिक चिकित्सा (गैस, वात, रोग प्रतिरोधक क्षमता)',
    badgeEn: 'Ayush / Wellness',
    badgeHi: 'आयुष चिकित्सा',
    prefix: 'AYU',
    color: 'emerald',
    icon: Sparkle
  }
];

// ==============================================================
// 2. FREE MEDICINE ROSTER (MNDY RAJASTHAN STANDARD FORMULARY)
// ==============================================================
const COMMON_FREE_MEDICINES = [
  { name: 'Tab. Paracetamol 650 mg', dosage: '1 Tab - TID (दिन में 3 बार)', days: '3 Days' },
  { name: 'Tab. Pantoprazole 40 mg', dosage: '1 Tab - OD खाली पेट (सुबह)', days: '5 Days' },
  { name: 'Tab. Amoxicillin + Clavulanic 625 mg', dosage: '1 Tab - BD (सुबह-शाम भोजन बाद)', days: '5 Days' },
  { name: 'Tab. Cetirizine 10 mg', dosage: '1 Tab - HS (रात को सोते समय)', days: '3 Days' },
  { name: 'Tab. Metformin 500 mg', dosage: '1 Tab - BD (भोजन के साथ)', days: '30 Days' },
  { name: 'Tab. Amlodipine 5 mg', dosage: '1 Tab - OD (सुबह)', days: '30 Days' },
  { name: 'ORS Sachet (Oral Rehydration Salts)', dosage: '1 पैकेट 1 लीटर उबले पानी में घोलकर', days: '2 Days' },
  { name: 'Tab. Ondansetron 4 mg', dosage: '1 Tab - उल्टी होने पर (SOS)', days: '3 Days' },
  { name: 'Tab. Diclofenac + Paracetamol', dosage: '1 Tab - दर्द होने पर (SOS)', days: '3 Days' },
  { name: 'Syp. Sucralfate + Oxetacaine', dosage: '2 चम्मच (10 ml) भोजन से आधा घंटा पहले', days: '5 Days' }
];

// ==============================================================
// 3. MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const OPD_TRANSLATIONS = {
  en: {
    hospitalSub: 'Govt. Sub-District Hospital, Pokaran • OPD Clinical OS',
    doctorChamberSwitch: 'Select Active Doctor Chamber:',
    micActive: 'Mic Active',
    logout: 'Logout',
    benchTitle: 'Indoor Chamber Bench (5-Patient Batch)',
    benchSub: 'Patients seated inside chamber ready for rapid consultation:',
    callBatchInitialBtn: '📢 Call Initial Batch (First 5)',
    callNextBatchBtn: '⚡ Complete & Call Next 5 Patients',
    chair1: 'Chair 1 (Now Examining)',
    seat: 'Seat',
    emptyChair: 'Empty Seat',
    waitingQueueTitle: 'Upcoming Waiting Queue',
    searchPlaceholder: 'Search token, parchi or patient name...',
    emptyQueue: 'No patients waiting in queue.',
    emptySub: 'Tokens issued from Kiosk will appear automatically.',
    parchi: 'Parchi',
    time: 'Time',
    statusWaiting: 'Waiting',
    statusInRoom: 'On Bench',
    statusCompleted: 'Completed',
    btnCallSingle: 'Call Single',
    btnExamine: 'Examine & Rx',
    btnEdit: 'Edit Rx',
    btnWhatsApp: 'WhatsApp',
    lockTitle: 'OPD Doctor Consultation Console',
    lockSub: 'Govt. Hospital, Pokaran • Physician PIN Authentication',
    enterPin: 'Enter 4-Digit Doctor PIN (Default: 1010)',
    unlockBtn: 'Unlock Doctor Console',
    backToHome: 'Back to Hospital Portal',
    modalTitle: 'Digital e-Prescription & Consultation',
    vitalsTitle: 'Clinical Vitals (BP, Pulse, Temp, Weight)',
    complaintsLabel: 'Chief Complaints / Clinical Symptoms',
    diagnosisLabel: 'Provisional Diagnosis / Clinical Assessment',
    referralTitle: '1-Click Diagnostic Orders & Investigation Referrals:',
    referLab: '+ Refer to Room 04 (Pathology Lab)',
    referXray: '+ Refer to Room 07 (Digital X-Ray)',
    referUsg: '+ Refer to Room 11 (Sonography USG)',
    medsTitle: 'Free Medicines (MNDY Rajasthan Formulary):',
    selectMedPlaceholder: 'Select common free medicine to add...',
    addMedBtn: 'Add Drug',
    adviceLabel: 'Doctor Advice & Instructions',
    submitRx: 'Save e-Prescription & Complete Token',
    footerText: 'Government Hospital Pokaran • OPD Clinical Chamber Console • Webnexa Health'
  },
  hi: {
    hospitalSub: 'राजकीय सामान्य चिकित्सालय पोकरण • ओपीडी डॉक्टर कंसोल',
    doctorChamberSwitch: 'सक्रिय डॉक्टर चैंबर का चयन करें:',
    micActive: 'माइक चालू',
    logout: 'लॉगआउट',
    benchTitle: 'कक्ष इनडोर बेंच (5-मरीज बैच व्यवस्था)',
    benchSub: 'कमरे के अंदर बेंच पर बैठे मरीज (तत्काल जांच हेतु तैयार):',
    callBatchInitialBtn: '📢 प्रारंभिक 5 मरीज अंदर बुलाएं',
    callNextBatchBtn: '⚡ पूर्ण करें एवं अगले 5 मरीज बुलाएं',
    chair1: 'कुर्सी 1 (डॉक्टर के सामने)',
    seat: 'सीट',
    emptyChair: 'खाली सीट',
    waitingQueueTitle: 'आगामी प्रतीक्षारत कतार',
    searchPlaceholder: 'टोकन, पर्ची या मरीज का नाम खोजें...',
    emptyQueue: 'अभी कतार में कोई मरीज प्रतीक्षारत नहीं है।',
    emptySub: 'कियोस्क से टोकन जारी होते ही यहाँ स्वतः आ जाएगा।',
    parchi: 'पर्ची',
    time: 'समय',
    statusWaiting: 'कतार में',
    statusInRoom: 'बेंच पर उपस्थित',
    statusCompleted: 'पूर्ण',
    btnCallSingle: 'माइक से बुलाएं',
    btnExamine: 'परामर्श व पर्ची',
    btnEdit: 'पर्ची एडिट',
    btnWhatsApp: 'WhatsApp',
    lockTitle: 'ओपीडी डॉक्टर परामर्श कंसोल',
    lockSub: 'राजकीय अस्पताल पोकरण • अधिकृत चिकित्सक पिन सत्यापन',
    enterPin: '4-अंकों का डॉक्टर पिन दर्ज करें (डिफ़ॉल्ट: 1010)',
    unlockBtn: 'कंसोल अनलॉक करें',
    backToHome: 'अस्पताल मुख्य पोर्टल पर जाएं',
    modalTitle: 'डिजिटल ई-पर्ची एवं नैदानिक परामर्श',
    vitalsTitle: 'शारीरिक वाइटल्स (BP, Pulse, Temp, Weight)',
    complaintsLabel: 'मुख्य लक्षण व तकलीफ (Complaints)',
    diagnosisLabel: 'प्राथमिक निदान (Diagnosis)',
    referralTitle: 'जांच हेतु तुरंत रेफरल भेजें (1-Click Referrals):',
    referLab: '+ कमरा 04 (खून जांच)',
    referXray: '+ कमरा 07 (एक्स-रे)',
    referUsg: '+ कमरा 11 (सोनोग्राफी USG)',
    medsTitle: 'मुख्यमंत्री निःशुल्क दवा योजना (MNDY पर्ची):',
    selectMedPlaceholder: 'दवा चुनें व पर्ची में जोड़ें...',
    addMedBtn: 'दवा जोड़ें',
    adviceLabel: 'चिकित्सक परामर्श व परहेज (Advice)',
    submitRx: 'ई-पर्ची जारी करें एवं पूर्ण करें',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • ओपीडी क्लिनिकल कंसोल • Webnexa'
  }
};

export default function MultiDoctorOPDConsole() {
  const [lang, setLang] = useState('en');
  const t = OPD_TRANSLATIONS[lang];

  // Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Authentication State (PIN: 1010)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Selected Doctor Chamber State
  const [selectedDoctorId, setSelectedDoctorId] = useState('opd_gen');
  const activeDoctor = useMemo(() => {
    return OPD_DOCTORS_DIRECTORY.find(d => d.id === selectedDoctorId) || OPD_DOCTORS_DIRECTORY[0];
  }, [selectedDoctorId]);

  // Queue & UI State
  const [searchFilter, setSearchFilter] = useState('');
  const [isCallingAudio, setIsCallingAudio] = useState(false);
  const [activeConsultPatient, setActiveConsultPatient] = useState(null);
  const [isSavingRx, setIsSavingRx] = useState(false);

  // Consultation Form State
  const [vitals, setVitals] = useState({ bp: '120/80', pulse: '74', temp: '98.4', weight: '65' });
  const [complaints, setComplaints] = useState('Acute fever, severe body ache and dry cough since 2 days.');
  const [diagnosis, setDiagnosis] = useState('Acute Febrile Illness / Viral Upper Respiratory Infection (URI)');
  const [prescribedMeds, setPrescribedMeds] = useState([
    { name: 'Tab. Paracetamol 650 mg', dosage: '1 Tab - TID (दिन में 3 बार)', days: '3 Days' },
    { name: 'Tab. Pantoprazole 40 mg', dosage: '1 Tab - OD खाली पेट (सुबह)', days: '5 Days' },
    { name: 'Tab. Cetirizine 10 mg', dosage: '1 Tab - HS (रात को)', days: '3 Days' }
  ]);
  const [selectedQuickMed, setSelectedQuickMed] = useState('');
  const [investigationReferral, setInvestigationReferral] = useState([]);
  const [doctorAdvice, setDoctorAdvice] = useState('Drink plenty of boiled warm fluids. Take light diet (khichdi/dalia). Avoid sour/cold items. Review after 3 days.');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('opd_session_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Staff PIN Verification
  const handleVerifyPin = async (e) => {
    e.preventDefault();
    if (pinInput.length !== 4) {
      setPinError(lang === 'en' ? 'Please enter 4-digit PIN' : 'कृपया 4-अंकों का स्टाफ पिन दर्ज करें');
      return;
    }

    setIsVerifying(true);
    setPinError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'opd', pin: pinInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('opd_session_auth', 'true');
        setPinInput('');
      } else if (pinInput === '1010') {
        setIsAuthenticated(true);
        sessionStorage.setItem('opd_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Invalid PIN! Use 1010.' : 'गलत पिन! सही पिन 1010 दर्ज करें।');
      }
    } catch (err) {
      if (pinInput === '1010') {
        setIsAuthenticated(true);
        sessionStorage.setItem('opd_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Server verification failed.' : 'सत्यापन विफल रहा।');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('opd_session_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Multi-Doctor Master Queue List (Local Fallback + Firestore Sync)
  const [masterQueue, setMasterQueue] = useState([
    // Room 01 (General OPD - Dr. S. K. Sharma)
    { id: 'OPD-101', tokenNumber: 'OPD-101', parchiCode: '619283', patientName: 'Mohan Lal Paliwal', mobile: '9928345678', deptId: 'opd_gen', status: 'in-room', timeStr: '09:20 AM', prescriptionData: null },
    { id: 'OPD-102', tokenNumber: 'OPD-102', parchiCode: '782190', patientName: 'Kailash Chand Verma', mobile: '9829145620', deptId: 'opd_gen', status: 'in-room', timeStr: '09:22 AM', prescriptionData: null },
    { id: 'OPD-103', tokenNumber: 'OPD-103', parchiCode: '318742', patientName: 'Bhanwar Lal Soni', mobile: '9414012399', deptId: 'opd_gen', status: 'in-room', timeStr: '09:25 AM', prescriptionData: null },
    { id: 'OPD-104', tokenNumber: 'OPD-104', parchiCode: '492104', patientName: 'Ghewar Ram Meghwal', mobile: '9782109823', deptId: 'opd_gen', status: 'in-room', timeStr: '09:28 AM', prescriptionData: null },
    { id: 'OPD-105', tokenNumber: 'OPD-105', parchiCode: '581920', patientName: 'Prem Devi Paliwal', mobile: '9928456123', deptId: 'opd_gen', status: 'in-room', timeStr: '09:30 AM', prescriptionData: null },
    { id: 'OPD-106', tokenNumber: 'OPD-106', parchiCode: '918230', patientName: 'Shaitan Singh', mobile: '9829445566', deptId: 'opd_gen', status: 'waiting', timeStr: '09:35 AM', prescriptionData: null },
    { id: 'OPD-107', tokenNumber: 'OPD-107', parchiCode: '918231', patientName: 'Manohar Joshi', mobile: '9414223344', deptId: 'opd_gen', status: 'waiting', timeStr: '09:38 AM', prescriptionData: null },
    { id: 'OPD-108', tokenNumber: 'OPD-108', parchiCode: '918232', patientName: 'Santosh Kanwar', mobile: '9928001122', deptId: 'opd_gen', status: 'waiting', timeStr: '09:40 AM', prescriptionData: null },
    { id: 'OPD-109', tokenNumber: 'OPD-109', parchiCode: '918233', patientName: 'Rameshwar Bheel', mobile: '9782334455', deptId: 'opd_gen', status: 'waiting', timeStr: '09:42 AM', prescriptionData: null },
    { id: 'OPD-110', tokenNumber: 'OPD-110', parchiCode: '918234', patientName: 'Om Prakash Khatri', mobile: '9829778899', deptId: 'opd_gen', status: 'waiting', timeStr: '09:45 AM', prescriptionData: null },
    { id: 'OPD-111', tokenNumber: 'OPD-111', parchiCode: '918235', patientName: 'Geeta Devi Bishnoi', mobile: '9414098765', deptId: 'opd_gen', status: 'waiting', timeStr: '09:48 AM', prescriptionData: null },

    // Room 03 (Gynae / Ladies - Dr. Anita Bishnoi)
    { id: 'GYN-301', tokenNumber: 'GYN-301', parchiCode: '581921', patientName: 'Suman Kanwar (ANC 24 Wks)', mobile: '9782134560', deptId: 'opd_gynae', status: 'in-room', timeStr: '09:15 AM', prescriptionData: null },
    { id: 'GYN-302', tokenNumber: 'GYN-302', parchiCode: '581922', patientName: 'Santosh Meena (ANC 32 Wks)', mobile: '9414238710', deptId: 'opd_gynae', status: 'in-room', timeStr: '09:20 AM', prescriptionData: null },
    { id: 'GYN-303', tokenNumber: 'GYN-303', parchiCode: '581923', patientName: 'Pooja Vishnoi (PCOD)', mobile: '9829112233', deptId: 'opd_gynae', status: 'waiting', timeStr: '09:25 AM', prescriptionData: null },
    { id: 'GYN-304', tokenNumber: 'GYN-304', parchiCode: '581924', patientName: 'Kavita Rathore', mobile: '9414334455', deptId: 'opd_gynae', status: 'waiting', timeStr: '09:30 AM', prescriptionData: null },

    // Room 06 (Pediatrics / Children - Dr. Vikram Choudhary)
    { id: 'PED-601', tokenNumber: 'PED-601', parchiCode: '109283', patientName: 'Master Aarav (3 Yrs - Fever)', mobile: '9829012345', deptId: 'opd_pedia', status: 'in-room', timeStr: '09:10 AM', prescriptionData: null },
    { id: 'PED-602', tokenNumber: 'PED-602', parchiCode: '109284', patientName: 'Baby Priya (8 Months - Cough)', mobile: '9414098765', deptId: 'opd_pedia', status: 'in-room', timeStr: '09:15 AM', prescriptionData: null },
    { id: 'PED-603', tokenNumber: 'PED-603', parchiCode: '109285', patientName: 'Master Daksh (5 Yrs)', mobile: '9928345678', deptId: 'opd_pedia', status: 'waiting', timeStr: '09:20 AM', prescriptionData: null },
    { id: 'PED-604', tokenNumber: 'PED-604', parchiCode: '109286', patientName: 'Baby Anaya (1 Yr - Vaccine)', mobile: '9782112233', deptId: 'opd_pedia', status: 'waiting', timeStr: '09:25 AM', prescriptionData: null },

    // Room 09 (Orthopedics - Dr. Ramesh Singh)
    { id: 'ORT-901', tokenNumber: 'ORT-901', parchiCode: '409181', patientName: 'Ramprasad Bishnoi (Knee Pain)', mobile: '9414022334', deptId: 'opd_ortho', status: 'in-room', timeStr: '09:00 AM', prescriptionData: null },
    { id: 'ORT-902', tokenNumber: 'ORT-902', parchiCode: '409182', patientName: 'Shambhu Dayal (Ankle Sprain)', mobile: '9828456123', deptId: 'opd_ortho', status: 'waiting', timeStr: '09:15 AM', prescriptionData: null }
  ]);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!db || !isAuthenticated) return;

    try {
      const q = query(collection(db, 'tokens'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveTokens = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setMasterQueue(liveTokens);
        }
      }, (err) => console.warn('Sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active:', err);
    }
  }, [isAuthenticated]);

  // Active Doctor's Patients Filter
  const currentChamberPatients = useMemo(() => {
    return masterQueue.filter(p => {
      // Match department id or prefix
      const matchDept = p.deptId === activeDoctor.id || p.departmentId === activeDoctor.id;
      const matchPrefix = p.tokenNumber?.startsWith(activeDoctor.prefix);
      return matchDept || matchPrefix;
    });
  }, [masterQueue, activeDoctor]);

  // Chamber Bench Patients (Currently in-room batch of up to 5)
  const currentBenchPatients = useMemo(() => {
    return currentChamberPatients.filter(p => p.status === 'in-room');
  }, [currentChamberPatients]);

  // Chamber Waiting Queue
  const currentWaitingPatients = useMemo(() => {
    return currentChamberPatients.filter(p => p.status === 'waiting');
  }, [currentChamberPatients]);

  // ==============================================================
  // 4. POWER FEATURE: 1-CLICK COMPLETE CURRENT & CALL NEXT 5 BATCH
  // ==============================================================
  const handleCompleteAndCallNextBatch = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Next 5 waiting patients
    const nextFive = currentWaitingPatients.slice(0, 5);
    if (nextFive.length === 0) return;

    const firstTok = nextFive[0].tokenNumber;
    const lastTok = nextFive[nextFive.length - 1].tokenNumber;

    // Loudspeaker Audio Announcement
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsCallingAudio(true);

      const doctorName = lang === 'en' ? activeDoctor.doctorNameEn : activeDoctor.doctorNameHi;
      const roomNum = lang === 'en' ? activeDoctor.roomNumber : activeDoctor.roomNumber.replace('Room', 'कमरा नंबर');

      const message = lang === 'en'
        ? `Attention. Tokens ${firstTok} to ${lastTok}. Please proceed to ${roomNum}, ${doctorName}, and take your seats on the bench inside.`
        : `कृपया ध्यान दें। टोकन नंबर ${firstTok} से ${lastTok}। तुरंत ${roomNum}, ${doctorName} के कक्ष में पधारें और अंदर बेंच पर बैठें।`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;

      utterance.onend = () => setIsCallingAudio(false);
      utterance.onerror = () => setIsCallingAudio(false);

      window.speechSynthesis.speak(utterance);
    }

    // Step 1: Mark previous in-room patients as completed (if not already completed)
    const prevInRoomIds = currentBenchPatients.map(p => p.id);
    const nextFiveIds = nextFive.map(p => p.id);

    setMasterQueue(prev => prev.map(p => {
      if (prevInRoomIds.includes(p.id)) {
        return { ...p, status: 'completed' };
      }
      if (nextFiveIds.includes(p.id)) {
        return { ...p, status: 'in-room' };
      }
      return p;
    }));

    // Update Firestore
    nextFive.forEach(p => {
      if (db && p.id && !p.id.startsWith('OPD-') && !p.id.startsWith('GYN-') && !p.id.startsWith('PED-') && !p.id.startsWith('ORT-')) {
        try {
          updateDoc(doc(db, 'tokens', p.id), {
            status: 'in-room',
            calledAt: serverTimestamp()
          });
        } catch (err) {
          console.warn('Batch write notice:', err);
        }
      }
    });
  }, [currentWaitingPatients, currentBenchPatients, activeDoctor, lang]);

  // Single Patient Call
  const callSinglePatient = useCallback((patient) => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsCallingAudio(true);

      const message = lang === 'en'
        ? `Token Number ${patient.tokenNumber}. Patient ${patient.patientName}. Please come forward to the doctor table.`
        : `टोकन नंबर ${patient.tokenNumber}। मरीज ${patient.patientName}। कृपया डॉक्टर की टेबल पर आएं।`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;

      utterance.onend = () => setIsCallingAudio(false);
      utterance.onerror = () => setIsCallingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [lang]);

  // Medicine Prescription Handlers
  const handleAddMedicine = () => {
    if (!selectedQuickMed) return;
    const medObj = COMMON_FREE_MEDICINES.find(m => m.name === selectedQuickMed);
    if (medObj && !prescribedMeds.some(m => m.name === medObj.name)) {
      setPrescribedMeds(prev => [...prev, medObj]);
    }
    setSelectedQuickMed('');
  };

  const handleRemoveMedicine = (index) => {
    setPrescribedMeds(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleReferral = (deptKey) => {
    setInvestigationReferral(prev => 
      prev.includes(deptKey) ? prev.filter(k => k !== deptKey) : [...prev, deptKey]
    );
  };

  // Open Consultation Form
  const handleOpenConsultation = (patient) => {
    setActiveConsultPatient(patient);
    if (patient.prescriptionData) {
      setVitals(patient.prescriptionData.vitals || { bp: '120/80', pulse: '74', temp: '98.4', weight: '65' });
      setComplaints(patient.prescriptionData.complaints || '');
      setDiagnosis(patient.prescriptionData.diagnosis || '');
      setPrescribedMeds(patient.prescriptionData.medicines || []);
      setInvestigationReferral(patient.prescriptionData.referrals || []);
      setDoctorAdvice(patient.prescriptionData.advice || '');
    }
  };

  // Save e-Prescription
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!activeConsultPatient) return;

    setIsSavingRx(true);

    const prescriptionData = {
      vitals,
      complaints,
      diagnosis,
      medicines: prescribedMeds,
      referrals: investigationReferral,
      advice: doctorAdvice,
      doctorName: lang === 'en' ? activeDoctor.doctorNameEn : activeDoctor.doctorNameHi,
      roomNumber: activeDoctor.roomNumber,
      prescribedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN')
    };

    setMasterQueue(prev => prev.map(p => {
      if (p.id === activeConsultPatient.id) {
        return {
          ...p,
          status: 'completed',
          prescriptionData
        };
      }
      return p;
    }));

    if (db && activeConsultPatient.id && !activeConsultPatient.id.startsWith('OPD-') && !activeConsultPatient.id.startsWith('GYN-') && !activeConsultPatient.id.startsWith('PED-') && !activeConsultPatient.id.startsWith('ORT-')) {
      try {
        await updateDoc(doc(db, 'tokens', activeConsultPatient.id), {
          status: 'completed',
          prescriptionData,
          completedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Prescription write warning:', err);
      }
    }

    setIsSavingRx(false);
    setActiveConsultPatient(null);
  };

  // WhatsApp e-Prescription Dispatch
  const handleSendWhatsApp = (patient) => {
    const rx = patient.prescriptionData;
    if (!rx) return;

    const cleanPhone = patient.mobile.replace(/\D/g, '');
    const mobileNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const medsList = rx.medicines.map((m, i) => `${i + 1}. *${m.name}*\n   - खुराक: ${m.dosage} (${m.days})`).join('\n');
    const referralText = rx.referrals.length > 0 ? `\n\n🔬 *जांच रेफरल:*\n${rx.referrals.join(', ')}` : '';

    const message = encodeURIComponent(
      `*राजकीय सामान्य चिकित्सालय, पोकरण*\n` +
      `*डिजिटल ओपीडी परामर्श पर्ची (${rx.roomNumber})*\n\n` +
      `मरीज का नाम: *${patient.patientName}*\n` +
      `पर्ची कोड: *${patient.parchiCode}* | टोकन: *${patient.tokenNumber}*\n` +
      `वाइटल्स: BP: ${rx.vitals.bp} | Pulse: ${rx.vitals.pulse} | Temp: ${rx.vitals.temp}°F\n\n` +
      `🩺 *निदान (Diagnosis):* *${rx.diagnosis}*\n\n` +
      `💊 *निःशुल्क दवाइयां (Free Medicines MNDY):*\n${medsList}${referralText}\n\n` +
      `📋 *चिकित्सक सलाह:* ${rx.advice}\n\n` +
      `परामर्शदाता: ${rx.doctorName}\n` +
      `🏥 _दवाइयां कमरा नं. 05 निःशुल्क दवा वितरण केंद्र से प्राप्त करें।_`
    );

    window.open(`https://wa.me/${mobileNumber}?text=${message}`, '_blank');
  };

  // Filtered Queue for the Active Doctor
  const filteredActiveQueue = useMemo(() => {
    return currentChamberPatients.filter(item => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        item.patientName?.toLowerCase().includes(q) ||
        item.tokenNumber?.toLowerCase().includes(q) ||
        item.parchiCode?.includes(q) ||
        item.mobile?.includes(q)
      );
    });
  }, [currentChamberPatients, searchFilter]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= 1. LOCK SCREEN =================
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
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-xs">
            <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {t.lockTitle}
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {t.lockSub}
          </p>

          <form onSubmit={handleVerifyPin} className="mt-5 space-y-3">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {t.enterPin}
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                inputMode="numeric"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setPinError('');
                }}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-xl sm:text-2xl font-black py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            {pinError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
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

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
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

  // ================= 2. AUTHENTICATED STAFF CONSOLE =================
  return (
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-100 overflow-x-hidden">
      
      {/* 1. Header with Active Chamber Identity */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5">
          
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-black text-xs sm:text-sm bg-slate-900 text-amber-400 px-2 py-0.5 rounded-md">
                  {activeDoctor.roomNumber}
                </span>
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {lang === 'en' ? activeDoctor.doctorNameEn : activeDoctor.doctorNameHi}
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate hidden md:block">
                {lang === 'en' ? activeDoctor.specialtyEn : activeDoctor.specialtyHi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {isCallingAudio && (
              <div className="flex items-center gap-1 px-1.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[9px] sm:text-[10px] font-black animate-pulse">
                <Volume2 className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="hidden sm:inline">{t.micActive}</span>
              </div>
            )}

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

      {/* 2. Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3.5 flex-1 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* ================= SECTION A: 8-DOCTOR SPECIALTY CHAMBER SWITCHER ================= */}
        <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              {t.doctorChamberSwitch}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              8 Rooms Available
            </span>
          </div>

          {/* Horizontal Scrollable Doctor Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {OPD_DOCTORS_DIRECTORY.map((docItem) => {
              const isSelected = selectedDoctorId === docItem.id;
              const DoctorIcon = docItem.icon;

              return (
                <button
                  key={docItem.id}
                  type="button"
                  onClick={() => setSelectedDoctorId(docItem.id)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition shrink-0 border active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {docItem.roomNumber}
                  </span>
                  <span>{lang === 'en' ? docItem.badgeEn : docItem.badgeHi}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SECTION B: 5-PATIENT INDOOR BENCH TRACKER & NEXT BATCH BUTTON ================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-700 shadow-lg space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  {activeDoctor.roomNumber} • {lang === 'en' ? activeDoctor.badgeEn : activeDoctor.badgeHi}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {currentWaitingPatients.length} Patients in Queue
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-1">
                {t.benchTitle}
              </h3>
            </div>

            {/* UNMISSABLE NEXT 5 BATCH ACTION BUTTON */}
            <button
              type="button"
              onClick={handleCompleteAndCallNextBatch}
              disabled={currentWaitingPatients.length === 0}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md shrink-0 ${
                currentWaitingPatients.length > 0
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Megaphone className="w-4 h-4 text-slate-950 shrink-0" />
              <span>
                {currentBenchPatients.length === 0 
                  ? `${t.callBatchInitialBtn} (${currentWaitingPatients.length} Waiting)` 
                  : `${t.callNextBatchBtn} (${currentWaitingPatients.length} Left)`}
              </span>
            </button>
          </div>

          {/* 5-Seat Indoor Chamber Cards (Responsive on Mobile & Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const patient = currentBenchPatients[slotIdx];
              const isDoctorChair = slotIdx === 0;

              return (
                <div
                  key={slotIdx}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between transition min-h-[92px] ${
                    patient
                      ? isDoctorChair
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'bg-slate-800/90 border-slate-600 text-slate-200'
                      : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-500'
                  } ${slotIdx === 4 ? 'col-span-2 sm:col-auto' : ''}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      isDoctorChair ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {isDoctorChair ? t.chair1 : `${t.seat} ${slotIdx + 1}`}
                    </span>
                    {patient && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </div>

                  {patient ? (
                    <div className="mt-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-amber-400">
                          {patient.tokenNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          P: {patient.parchiCode}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-white truncate mt-0.5">
                        {patient.patientName}
                      </h5>

                      <button
                        type="button"
                        onClick={() => handleOpenConsultation(patient)}
                        className={`mt-2 w-full py-1 text-white font-black rounded-lg text-[10px] flex items-center justify-center gap-1 transition ${
                          isDoctorChair ? 'bg-emerald-600 hover:bg-emerald-500 shadow-sm' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{isDoctorChair ? 'Examine (Now)' : 'Open Rx'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[10px] italic text-slate-600">
                      {t.emptyChair}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= SECTION C: UPCOMING WAITING QUEUE LIST ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.waitingQueueTitle} ({filteredActiveQueue.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                {activeDoctor.roomNumber} • {lang === 'en' ? activeDoctor.doctorNameEn : activeDoctor.doctorNameHi}
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredActiveQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="font-bold text-xs sm:text-sm">{t.emptyQueue}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.emptySub}</p>
              </div>
            ) : (
              filteredActiveQueue.map((patient) => {
                const isWaiting = patient.status === 'waiting';
                const isInRoom = patient.status === 'in-room';
                const isCompleted = patient.status === 'completed';

                return (
                  <div 
                    key={patient.id}
                    className={`p-2.5 sm:p-3.5 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                      isInRoom ? 'bg-amber-50/70 border-l-4 border-amber-500' : isCompleted ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className={`h-10 w-14 sm:h-12 sm:w-16 rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-xs px-1 shadow-2xs shrink-0 select-none ${
                        isInRoom ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-900 text-amber-400'
                      }`}>
                        {patient.tokenNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                            {patient.patientName}
                          </h5>
                          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded shrink-0">
                            {t.parchi}: {patient.parchiCode}
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
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            ● {isWaiting ? t.statusWaiting : isInRoom ? t.statusInRoom : t.statusCompleted}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Touch-Friendly Action Controls */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-0">
                      
                      <button
                        type="button"
                        onClick={() => callSinglePatient(patient)}
                        className="min-h-[36px] px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.btnCallSingle}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenConsultation(patient)}
                        className={`min-h-[36px] px-2.5 py-1 text-white font-black rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95 ${
                          isCompleted ? 'bg-slate-700 hover:bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{isCompleted ? t.btnEdit : t.btnExamine}</span>
                      </button>

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(patient)}
                          className="min-h-[36px] px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95 col-span-2 sm:col-auto"
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

      {/* ================= MODAL: DIGITAL E-PRESCRIPTION & CONSULTATION ================= */}
      {activeConsultPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setActiveConsultPatient(null)}
              className="absolute top-3 right-3 min-h-[32px] min-w-[32px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2.5 pr-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                {activeDoctor.roomNumber} • {t.modalTitle}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                {activeConsultPatient.patientName} ({activeConsultPatient.tokenNumber})
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold">
                {t.parchi}: {activeConsultPatient.parchiCode} • +91 {activeConsultPatient.mobile}
              </p>
            </div>

            <form onSubmit={handleSavePrescription} className="mt-3.5 space-y-3.5">
              
              {/* Vitals Grid */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1.5">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                  {t.vitalsTitle}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">BP (mmHg)</label>
                    <input
                      type="text"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Pulse</label>
                    <input
                      type="text"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Temp (°F)</label>
                    <input
                      type="text"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Weight (kg)</label>
                    <input
                      type="text"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Complaints & Provisional Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.complaintsLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                    {t.diagnosisLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  ></textarea>
                </div>
              </div>

              {/* 1-Click Investigation Referrals */}
              <div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  {t.referralTitle}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleToggleReferral('Room 04 (Pathology Lab)')}
                    className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                      investigationReferral.includes('Room 04 (Pathology Lab)')
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {t.referLab}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReferral('Room 07 (Digital X-Ray)')}
                    className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                      investigationReferral.includes('Room 07 (Digital X-Ray)')
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {t.referXray}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReferral('Room 11 (Sonography USG)')}
                    className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                      investigationReferral.includes('Room 11 (Sonography USG)')
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {t.referUsg}
                  </button>
                </div>
              </div>

              {/* MNDY Free Medicines Selection */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-2">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">
                  {t.medsTitle}
                </span>

                <div className="flex gap-2">
                  <select
                    value={selectedQuickMed}
                    onChange={(e) => setSelectedQuickMed(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="">{t.selectMedPlaceholder}</option>
                    {COMMON_FREE_MEDICINES.map((med) => (
                      <option key={med.name} value={med.name}>{med.name}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="min-h-[32px] px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow-2xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addMedBtn}</span>
                  </button>
                </div>

                {/* Prescribed Drug List */}
                <div className="space-y-1.5 pt-1">
                  {prescribedMeds.map((med, index) => (
                    <div 
                      key={index}
                      className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <strong className="text-xs font-black text-slate-900 block truncate">{med.name}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">{med.dosage} • {med.days}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice Box */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.adviceLabel}
                </label>
                <textarea
                  rows={2}
                  value={doctorAdvice}
                  onChange={(e) => setDoctorAdvice(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

              {/* Submit Prescription Button */}
              <button
                type="submit"
                disabled={isSavingRx}
                className="w-full min-h-[44px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                {isSavingRx ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.submitRx}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}