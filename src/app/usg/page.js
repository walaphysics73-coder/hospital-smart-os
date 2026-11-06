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
  Layers, 
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
  Activity,
  Baby,
  Filter
} from 'lucide-react';

// ==============================================================
// 1. MASTER USG INVESTIGATIONS DICTIONARY (MNJY RAJASTHAN)
// ==============================================================
export const MASTER_USG_EXAMS = {
  whole_abdomen: {
    id: 'whole_abdomen',
    nameEn: 'USG Whole Abdomen & Pelvis',
    nameHi: 'संपूर्ण पेट व पेल्विस सोनोग्राफी',
    category: 'Abdomen',
    isPopular: true,
    findings: 'Liver: Normal in size and echotexture. No focal lesion or intrahepatic biliary radicle dilatation (IHBRD). Gallbladder: Well distended, walls are smooth and thin. Lumen is anechoic with no calculus. CBD is normal. Spleen: Normal in size and parenchyma. Pancreas: Visualized portions appear normal. Both Kidneys: Normal in size, position, and cortical thickness. Corticomedullary differentiation is well preserved. No calculus or hydronephrosis seen. Urinary Bladder: Adequate distension, thin regular margins, no intraluminal lesion/calculus. Prostate/Uterus: Normal anatomical appearance for age. No free fluid in peritoneal cavity.',
    impression: 'NORMAL ULTRASOUND STUDY OF WHOLE ABDOMEN & PELVIS (NO SIGNIFICANT SONOLOGICAL ABNORMALITY)'
  },
  obstetric_anc: {
    id: 'obstetric_anc',
    nameEn: 'Obstetric Ultrasound (2nd / 3rd Trimester ANC)',
    nameHi: 'प्रसव पूर्व गर्भावस्‍था जांच (ANC Scan)',
    category: 'Obstetric',
    isPopular: true,
    findings: 'Single live intrauterine fetus seen in cephalic presentation. Fetal cardiac activity is regular and rhythmic (FHR: ~144 bpm). Active fetal somatic movements present. Fetal Biometry: BPD: 62 mm, FL: 44 mm, AC: 202 mm, HC: 230 mm corresponding to ~24 Weeks 3 Days Gestational Age. Placenta: Anterior, Grade-II maturity, well away from the internal os (no placenta previa). Amniotic Fluid Volume: Adequate (AFI: 14.0 cm). No gross congenital structural anomaly visualized on routine scan.',
    impression: 'SINGLE LIVE INTRAUTERINE FETUS CORRESPONDING TO ~24 WEEKS GESTATION WITH ADEQUATE LIQUOR & NORMALLY SITED PLACENTA'
  },
  kub_prostate: {
    id: 'kub_prostate',
    nameEn: 'USG KUB & Prostate (Renal Tract)',
    nameHi: 'गुर्दे, मूत्रमार्ग व प्रोस्टेट (KUB)',
    category: 'Abdomen',
    isPopular: true,
    findings: 'Right Kidney: 10.1 cm, Left Kidney: 10.4 cm. Both kidneys reveal normal bipolar length and cortical thickness. Corticomedullary differentiation is distinct. No renal parenchymal/pelvicalyceal calculus or backpressure hydronephrosis seen. Both ureters are not dilated. Urinary Bladder: Smooth mucosal wall, pre-void volume: ~320 ml. No radio-opaque or echogenic calculus. Post-void residual volume is insignificant (<20 ml). Prostate: Normal size (~22 cc) with homogeneous echotexture.',
    impression: 'NORMAL KUB STUDY — NO EVIDENCE OF NEPHROLITHIASIS, HYDRONEPHROSIS OR PROSTATIC ENLARGEMENT'
  },
  first_trimester_dating: {
    id: 'first_trimester_dating',
    nameEn: 'First Trimester Dating & Viability Scan',
    nameHi: 'प्रारंभिक गर्भावस्था डेटिंग स्कैन (1st Trimester)',
    category: 'Obstetric',
    isPopular: true,
    findings: 'Well-defined regular intrauterine gestational sac (GS) seen with a clear decidual reaction. A single fetal pole is identified with Crown-Rump Length (CRL) of 28 mm corresponding to 9 Weeks 4 Days. Distinct fetal cardiac pulsation present (FHR: ~165 bpm). Yolk sac is rounded and normal in size (~4.5 mm). Internal os is closed. Both adnexae appear normal with no ectopic gestation or subchorionic hematoma.',
    impression: 'SINGLE LIVE EARLY INTRAUTERINE PREGNANCY OF ~9 WEEKS 4 DAYS WITH ACTIVE FETAL CARDIAC FLICKER'
  },
  hepatobiliary_gb: {
    id: 'hepatobiliary_gb',
    nameEn: 'USG Hepatobiliary & Gallbladder Panel',
    nameHi: 'यकृत एवं पित्ताशय जांच (Hepatobiliary)',
    category: 'Abdomen',
    isPopular: false,
    findings: 'Liver measures 14.2 cm with normal homogeneous parenchymal echotexture. Intrahepatic vessels and portal vein caliber are normal. Gallbladder is well distended with thin, smooth wall (<3 mm). Lumen is clear without mobile echogenic calculus or acoustic shadowing. Common Bile Duct (CBD) measures 4.1 mm (normal). Spleen is normal in size.',
    impression: 'NORMAL HEPATOBILIARY STUDY (NO EVIDENCE OF HEPATOMEGALY OR CHOLELITHIASIS)'
  },
  female_pelvis: {
    id: 'female_pelvis',
    nameEn: 'USG Female Pelvis (Uterus & Adnexa)',
    nameHi: 'महिला पेल्विस एवं गर्भाशय जांच (Pelvis Gynae)',
    category: 'Gynaecology',
    isPopular: true,
    findings: 'Uterus is anteverted, normal in size, shape, and myometrial echotexture. No focal uterine fibroid (leiomyoma) or adenomyosis. Endometrial echo is centrally positioned, measuring 8.2 mm with regular margins. Bilateral ovaries appear normal in volume and follicular pattern. No adnexal mass, chocolate cyst, or fluid collection in the Pouch of Douglas (POD).',
    impression: 'NORMAL PELVIC ULTRASOUND STUDY (NORMAL UTERUS & BILATERAL OVARIES)'
  },
  scrotum_testes: {
    id: 'scrotum_testes',
    nameEn: 'USG Scrotum & Testes (High Resolution)',
    nameHi: 'अंडकोष एवं वृषण सोनोग्राफी (Scrotum)',
    category: 'Small Parts',
    isPopular: false,
    findings: 'Both testes are descended in the scrotal sac, symmetrical in size with normal homogeneous echotexture. Right testis: 3.8 x 2.2 cm, Left testis: 3.9 x 2.3 cm. Bilateral epididymal head and body appear normal. No testicular focal mass, calcification, or hydrocele. Pampiniform plexus veins show normal caliber with no varicocele.',
    impression: 'NORMAL SCROTAL ULTRASOUND (NO HYDROCELE, VARICOCELE OR EPIDIDYMO-ORCHITIS)'
  },
  thyroid_neck: {
    id: 'thyroid_neck',
    nameEn: 'USG Thyroid Gland & Neck Soft Tissue',
    nameHi: 'थायरॉइड ग्रंथि अल्ट्रासाउंड (Thyroid)',
    category: 'Small Parts',
    isPopular: false,
    findings: 'Both thyroid lobes and isthmus reveal normal dimensions and smooth capsular margins. Parenchymal echotexture is homogeneous with normal internal vascularity on Doppler. Right lobe: 4.1 x 1.4 x 1.5 cm, Left lobe: 4.0 x 1.3 x 1.4 cm. Isthmus thickness: 2.8 mm. No cystic/solid nodule, microcalcification, or suspicious cervical lymphadenopathy.',
    impression: 'NORMAL THYROID GLAND STUDY (NO THYROID NODULE OR GOITER)'
  },
  breast_usg: {
    id: 'breast_usg',
    nameEn: 'Bilateral Sonomammography (Breast USG)',
    nameHi: 'द्विपक्षीय स्तन सोनोग्राफी (Sonomammography)',
    category: 'Small Parts',
    isPopular: false,
    findings: 'Bilateral breasts reveal symmetrical fibroglandular parenchyma and subcutaneous fat. Ductal architecture is normal without ectasia. No solid mass, cystic lesion, architectural distortion, or microcalcification seen in either breast. Bilateral axillae show normal fatty preserved lymph nodes with no pathological adenopathy.',
    impression: 'NORMAL BILATERAL SONOMAMMOGRAM — BIRADS CATEGORY 1 (NEGATIVE)'
  },
  acute_abdomen_appendix: {
    id: 'acute_abdomen_appendix',
    nameEn: 'USG Acute Abdomen (Right Iliac Fossa / Appendix)',
    nameHi: 'तीव्र पेट दर्द / अपेंडिक्स जांच (Acute Abdomen)',
    category: 'Abdomen',
    isPopular: false,
    findings: 'Right iliac fossa (RIF) demonstrates compressible bowel loops. Appendix is not visualized as dilated or inflamed (outer diameter <6 mm). No surrounding mesenteric fat stranding, target sign, or localized free fluid in the RIF. Both iliac vessels show normal flow. Gallbladder and pancreas appear normal.',
    impression: 'NO SONOLOGICAL EVIDENCE OF ACUTE APPENDICITIS OR INTESTINAL INTUSSUSCEPTION'
  }
};

// ==============================================================
// 2. MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const USG_TRANSLATIONS = {
  en: {
    roomTitle: 'Room 11 : Sonography & Ultrasound',
    hospitalSub: 'Govt. Hospital Pokaran • High-Resolution Ultrasound Wing',
    verifiedBadge: 'USG Specialist',
    micActive: 'Mic Active',
    logout: 'Logout',
    liveStatus: 'Live USG Queue',
    waitingCount: 'Patients Waiting:',
    searchPlaceholder: 'Search token, parchi or name...',
    queueHeader: 'Ultrasound Queue List',
    liveBadge: 'Room 11 Live',
    emptyQueue: 'No patients waiting for Sonography.',
    emptySub: 'Tokens will appear here immediately once issued from kiosk.',
    parchi: 'Parchi',
    time: 'Time',
    statusWaiting: 'Waiting',
    statusInRoom: 'Scanning',
    statusCompleted: 'Done',
    btnCall: 'Call',
    btnRecall: 'Recall',
    btnQuickEntry: 'Enter Scan',
    btnEdit: 'Edit Scan',
    btnWhatsApp: 'WhatsApp',
    lockTitle: 'Room 11 (Sonography / USG)',
    lockSub: 'Govt. Hospital, Pokaran • Radiologist / Sonologist Access Only',
    enterPin: 'Enter 4-Digit Staff PIN (Default: 1111)',
    unlockBtn: 'Unlock USG Console',
    backToHome: 'Back to Hospital Portal',
    modalTitle: 'Ultrasound Scan Report & Findings',
    selectExamLabel: 'Select Standard Rajasthan MNJY Ultrasound Investigation:',
    presetAbnormalNotice: '⚠️ Abnormality Shortcut Presets:',
    presetGallstone: '⚡ Gallbladder Stone (Cholelithiasis)',
    presetRenalStone: '⚡ Kidney Stone (Nephrolithiasis)',
    presetFattyLiver: '⚡ Fatty Liver (Grade-I/II)',
    presetLowAfi: '⚡ Low Amniotic Fluid (Oligohydramnios)',
    paramStudy: 'Type of Ultrasound Study',
    paramOrganFindings: 'Organ-Specific Observations',
    paramImpression: 'Diagnostic Impression / Conclusion',
    submitReport: 'Publish USG Report & Complete Token',
    footerText: 'Government Hospital Pokaran • Room 11 Sonography Wing • Webnexa Health'
  },
  hi: {
    roomTitle: 'कमरा नं. 11 : सोनोग्राफी एवं अल्ट्रासाउंड केंद्र',
    hospitalSub: 'राजकीय सामान्य चिकित्सालय पोकरण • अल्ट्रासाउंड विंग',
    verifiedBadge: 'सोनोलॉजिस्ट सत्यापित',
    micActive: 'माइक चालू',
    logout: 'लॉगआउट',
    liveStatus: 'लाइव सोनोग्राफी कतार',
    waitingCount: 'प्रतीक्षारत मरीज:',
    searchPlaceholder: 'टोकन, पर्ची या मरीज खोजें...',
    queueHeader: 'सोनोग्राफी कतार सूची',
    liveBadge: 'कमरा 11 लाइव',
    emptyQueue: 'अभी सोनोग्राफी हेतु कोई मरीज कतार में नहीं है।',
    emptySub: 'कियोस्क से टोकन बनते ही यहाँ स्वतः आ जाएगा।',
    parchi: 'पर्ची',
    time: 'समय',
    statusWaiting: 'कतार में',
    statusInRoom: 'कक्ष में',
    statusCompleted: 'पूर्ण',
    btnCall: 'बुलाएं',
    btnRecall: 'पुनः बुलाएं',
    btnQuickEntry: 'जांच निष्कर्ष',
    btnEdit: 'एडिट निष्कर्ष',
    btnWhatsApp: 'WhatsApp',
    lockTitle: 'कमरा नं. 11 (सोनोग्राफी विंग)',
    lockSub: 'राजकीय अस्पताल पोकरण • अधिकृत सोनोलॉजिस्ट स्टाफ',
    enterPin: '4-अंकों का स्टाफ पिन दर्ज करें (डिफ़ॉल्ट: 1111)',
    unlockBtn: 'कंसोल अनलॉक करें',
    backToHome: 'अस्पताल मुख्य पोर्टल पर जाएं',
    modalTitle: 'सोनोग्राफी जांच विवरण एवं निष्कर्ष',
    selectExamLabel: 'राजस्थान सरकार (MNJY) निःशुल्क सोनोग्राफी जांच चुनें:',
    presetAbnormalNotice: '⚠️ असामान्य / बीमारी शॉर्टकट:',
    presetGallstone: '⚡ पित्ताशय की पथरी (Gallstone)',
    presetRenalStone: '⚡ गुर्दे की पथरी (Kidney Stone)',
    presetFattyLiver: '⚡ फैटी लिवर (Fatty Liver)',
    presetLowAfi: '⚡ कम पानी (Oligohydramnios)',
    paramStudy: 'सोनोग्राफी जांच का प्रकार',
    paramOrganFindings: 'अंगवार प्रेक्षण (Organ Findings)',
    paramImpression: 'अंतिम नैदानिक निष्कर्ष (Impression)',
    submitReport: 'सोनोग्राफी रिपोर्ट जारी करें एवं पूर्ण करें',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • कमरा नं. 11 सोनोग्राफी विंग • Webnexa'
  }
};

export default function SonographyConsole() {
  const [lang, setLang] = useState('en');
  const t = USG_TRANSLATIONS[lang];

  // Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Authentication State (Staff PIN: 1111)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Queue & UI State
  const [searchFilter, setSearchFilter] = useState('');
  const [isCallingAudio, setIsCallingAudio] = useState(false);
  const [activeReportPatient, setActiveReportPatient] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Active Selected Investigation & Form Values
  const [selectedExamKey, setSelectedExamKey] = useState('whole_abdomen');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [usgStudyType, setUsgStudyType] = useState(MASTER_USG_EXAMS.whole_abdomen.nameEn);
  const [usgFindings, setUsgFindings] = useState(MASTER_USG_EXAMS.whole_abdomen.findings);
  const [usgImpression, setUsgImpression] = useState(MASTER_USG_EXAMS.whole_abdomen.impression);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('usg_session_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Staff PIN Verification (Local + Server API)
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
        body: JSON.stringify({ type: 'usg', pin: pinInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('usg_session_auth', 'true');
        setPinInput('');
      } else if (pinInput === '1111') {
        setIsAuthenticated(true);
        sessionStorage.setItem('usg_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Invalid PIN! Use 1111.' : 'गलत पिन! सही पिन 1111 दर्ज करें।');
      }
    } catch (err) {
      if (pinInput === '1111') {
        setIsAuthenticated(true);
        sessionStorage.setItem('usg_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Server verification failed.' : 'सत्यापन विफल रहा।');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('usg_session_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Dedicated USG Queue List (Local Fallback + Firestore Sync)
  const [usgQueue, setUsgQueue] = useState([
    {
      id: 'USG-D1',
      tokenNumber: 'USG-301',
      trackingCode: 'PKR-58192',
      parchiCode: '581920',
      patientName: 'Suman Choudhary',
      mobile: '9782134560',
      status: 'waiting',
      timeStr: '09:15 AM',
      reportData: null
    },
    {
      id: 'USG-D2',
      tokenNumber: 'USG-302',
      trackingCode: 'PKR-99214',
      parchiCode: '992143',
      patientName: 'Santosh Meena',
      mobile: '9414238710',
      status: 'waiting',
      timeStr: '09:35 AM',
      reportData: null
    }
  ]);

  // Real-time Firestore Sync (Department: usg)
  useEffect(() => {
    if (!db || !isAuthenticated) return;

    try {
      const q = query(
        collection(db, 'tokens'),
        where('departmentId', '==', 'usg')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveTokens = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setUsgQueue(liveTokens);
        }
      }, (err) => console.warn('USG Sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active:', err);
    }
  }, [isAuthenticated]);

  // Audio Loudspeaker Calling for Room 11
  const callPatient = useCallback((patient) => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsCallingAudio(true);

      const message = lang === 'en'
        ? `Token Number ${patient.tokenNumber}. Patient ${patient.patientName}. Please proceed to Room Number 11 Sonography.`
        : `टोकन नंबर ${patient.tokenNumber}। मरीज ${patient.patientName}। कृपया सोनोग्राफी जांच के लिए तुरंत कमरा नंबर 11 में पधारें।`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;

      utterance.onend = () => setIsCallingAudio(false);
      utterance.onerror = () => setIsCallingAudio(false);

      window.speechSynthesis.speak(utterance);
    }

    setUsgQueue(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'in-room' } : p));

    if (db && patient.id && !patient.id.startsWith('USG-D')) {
      try {
        updateDoc(doc(db, 'tokens', patient.id), {
          status: 'in-room',
          calledAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Status write warning:', err);
      }
    }
  }, [lang]);

  // Switch to a selected investigation from the 10+ Master List
  const handleSelectExam = (key) => {
    setSelectedExamKey(key);
    const exam = MASTER_USG_EXAMS[key];
    if (exam) {
      setUsgStudyType(lang === 'en' ? exam.nameEn : exam.nameHi);
      setUsgFindings(exam.findings);
      setUsgImpression(exam.impression);
    }
  };

  // Shortcut 1: Gallstone Abnormality Insertion
  const insertGallstonePreset = () => {
    setUsgFindings(prev => `${prev}\n[ABNORMALITY DETECTED]: Gallbladder shows single/multiple mobile, echogenic foci measuring ~8.5 mm in the lumen producing strong posterior acoustic shadowing. Gallbladder wall thickness is preserved (<3 mm). No pericholecystic fluid.`);
    setUsgImpression('CHOLELITHIASIS (GALLBLADDER CALCULUS) WITHOUT ACUTE CHOLECYSTITIS');
  };

  // Shortcut 2: Kidney Stone Abnormality Insertion
  const insertRenalStonePreset = () => {
    setUsgFindings(prev => `${prev}\n[ABNORMALITY DETECTED]: Right/Left kidney demonstrates a well-defined echogenic focus measuring ~6.2 mm in the mid/lower pole calyx causing definite posterior acoustic shadowing with mild pelvicalyceal fullness (Grade-I Hydronephrosis).`);
    setUsgImpression('NEPHROLITHIASIS (CALCULUS) WITH MILD BACKPRESSURE HYDRONEPHROSIS');
  };

  // Shortcut 3: Fatty Liver Abnormality Insertion
  const insertFattyLiverPreset = () => {
    setUsgFindings(prev => `${prev}\n[ABNORMALITY DETECTED]: Liver reveals diffuse increase in parenchymal echogenicity with mild impairment in visual transmission of diaphragm and intrahepatic vessels (Grade-I to II Hepatic Steatosis).`);
    setUsgImpression('DIFFUSE FATTY LIVER (GRADE-I/II HEPATIC STEATOSIS)');
  };

  // Shortcut 4: Oligohydramnios (Low Water) in Pregnancy
  const insertLowAfiPreset = () => {
    setUsgFindings(prev => `${prev}\n[ABNORMALITY DETECTED]: Amniotic fluid index (AFI) is reduced, measuring ~6.2 cm (single deepest vertical pocket ~2.1 cm). Placenta is anterior, Grade-II/III maturity.`);
    setUsgImpression('SINGLE LIVE INTRAUTERINE FETUS WITH OLIGOHYDRAMNIOS (LOW LIQUOR) - CLINICAL & FETAL SURVEILLANCE ADVISED');
  };

  // Open Diagnostic Entry Form
  const handleOpenForm = (patient) => {
    setActiveReportPatient(patient);
    if (patient.reportData) {
      setUsgStudyType(patient.reportData.study || MASTER_USG_EXAMS.whole_abdomen.nameEn);
      setUsgFindings(patient.reportData.findings || MASTER_USG_EXAMS.whole_abdomen.findings);
      setUsgImpression(patient.reportData.impression || MASTER_USG_EXAMS.whole_abdomen.impression);
    } else {
      handleSelectExam('whole_abdomen');
    }
  };

  // Publish USG Report
  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!activeReportPatient) return;

    setIsPublishing(true);

    const reportData = {
      study: usgStudyType,
      findings: usgFindings,
      impression: usgImpression,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      sonologist: 'Dr. Anita Bishnoi (Consultant Radiologist / Sonologist)'
    };

    setUsgQueue(prev => prev.map(p => {
      if (p.id === activeReportPatient.id) {
        return {
          ...p,
          status: 'completed',
          reportData
        };
      }
      return p;
    }));

    if (db && activeReportPatient.id && !activeReportPatient.id.startsWith('USG-D')) {
      try {
        await updateDoc(doc(db, 'tokens', activeReportPatient.id), {
          status: 'completed',
          reportData,
          completedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Report write warning:', err);
      }
    }

    setIsPublishing(false);
    setActiveReportPatient(null);
  };

  // Direct WhatsApp Report Link
  const handleSendWhatsApp = (patient) => {
    const rep = patient.reportData;
    if (!rep) return;

    const cleanPhone = patient.mobile.replace(/\D/g, '');
    const mobileNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = encodeURIComponent(
      `*Govt. Hospital, Pokaran*\n` +
      `*Ultrasound / Sonography Report (Room 11)*\n\n` +
      `Patient: *${patient.patientName}*\n` +
      `Parchi: *${patient.parchiCode}* | Token: *${patient.tokenNumber}*\n\n` +
      `🔍 *Study:* ${rep.study}\n` +
      `📋 *Findings:* ${rep.findings}\n\n` +
      `🎯 *Impression:* *${rep.impression}*\n\n` +
      `Verified: ${rep.sonologist}\n` +
      `🏥 _Official digital diagnostic report generated by Hospital Smart OS._`
    );

    window.open(`https://wa.me/${mobileNumber}?text=${message}`, '_blank');
  };

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return usgQueue.filter(item => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        item.patientName?.toLowerCase().includes(q) ||
        item.tokenNumber?.toLowerCase().includes(q) ||
        item.parchiCode?.includes(q) ||
        item.mobile?.includes(q)
      );
    });
  }, [usgQueue, searchFilter]);

  // Master Exams filtered by Category
  const filteredMasterExams = useMemo(() => {
    const list = Object.entries(MASTER_USG_EXAMS);
    if (selectedCategoryFilter === 'All') return list;
    return list.filter(([_, exam]) => exam.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
              <Languages className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-purple-100 shadow-xs">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
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
                className="w-full text-center tracking-[0.6em] text-xl sm:text-2xl font-black py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-purple-600 transition"
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
              className="w-full min-h-[44px] bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
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
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-purple-100 overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5">
          
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {t.roomTitle}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-black shrink-0 hidden xs:inline">
                  {t.verifiedBadge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate hidden md:block">
                {t.hospitalSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] font-black flex items-center gap-1 transition border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-purple-600 shrink-0" />
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

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3 flex-1 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* Status Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">{t.liveStatus}</span>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900">
                {t.waitingCount} {usgQueue.filter(p => p.status === 'waiting').length}
              </h3>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg sm:rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

        </div>

        {/* Patients Queue List */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-2.5 sm:p-3.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
              <span>{t.queueHeader} ({filteredQueue.length})</span>
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold shrink-0">
              {t.liveBadge}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredQueue.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="font-bold text-xs sm:text-sm">{t.emptyQueue}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.emptySub}</p>
              </div>
            ) : (
              filteredQueue.map((patient) => {
                const isWaiting = patient.status === 'waiting';
                const isInRoom = patient.status === 'in-room';
                const isCompleted = patient.status === 'completed';

                return (
                  <div 
                    key={patient.id}
                    className={`p-2.5 sm:p-3.5 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                      isInRoom ? 'bg-amber-50/60' : isCompleted ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="h-10 w-14 sm:h-12 sm:w-16 bg-slate-900 text-amber-400 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-xs px-1 shadow-2xs shrink-0 select-none">
                        {patient.tokenNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
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
                              ? 'bg-sky-100 text-sky-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            ● {isWaiting ? t.statusWaiting : isInRoom ? t.statusInRoom : t.statusCompleted}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Touch-Friendly Action Buttons */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-0">
                      
                      <button
                        type="button"
                        onClick={() => callPatient(patient)}
                        className="min-h-[34px] sm:min-h-[36px] px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isInRoom ? t.btnRecall : t.btnCall}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenForm(patient)}
                        className={`min-h-[34px] sm:min-h-[36px] px-2.5 py-1 text-white font-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95 ${
                          isCompleted ? 'bg-slate-700 hover:bg-slate-800' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{isCompleted ? t.btnEdit : t.btnQuickEntry}</span>
                      </button>

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(patient)}
                          className="min-h-[34px] sm:min-h-[36px] px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs transition active:scale-95 col-span-2 sm:col-auto"
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

      {/* ================= MODAL: 10+ USG INVESTIGATIONS PRESET FINDINGS ================= */}
      {activeReportPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 relative my-auto animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setActiveReportPatient(null)}
              className="absolute top-3 right-3 min-h-[32px] min-w-[32px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2.5 pr-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                {t.modalTitle}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                {activeReportPatient.patientName} ({activeReportPatient.tokenNumber})
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold">
                {t.parchi}: {activeReportPatient.parchiCode} • +91 {activeReportPatient.mobile}
              </p>
            </div>

            <form onSubmit={handleSaveReport} className="mt-3.5 space-y-3.5">
              
              {/* Category Filter Tabs */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 mb-1">
                  {t.selectExamLabel}
                </label>
                
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  {['All', 'Abdomen', 'Obstetric', 'Gynaecology', 'Small Parts'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-[10px] font-black transition shrink-0 ${
                        selectedCategoryFilter === cat
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of All USG Investigations */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {filteredMasterExams.map(([key, exam]) => {
                    const isSelected = selectedExamKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectExam(key)}
                        className={`p-2 rounded-lg text-left transition flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                            : exam.isPopular
                            ? 'bg-purple-50/70 border-purple-200 text-slate-900 hover:bg-purple-100'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 w-full">
                          <span className="text-[10px] font-black leading-tight line-clamp-1">
                            {lang === 'en' ? exam.nameEn : exam.nameHi}
                          </span>
                          {exam.isPopular && (
                            <span className={`text-[8px] font-bold px-1 rounded shrink-0 ${
                              isSelected ? 'bg-purple-800 text-amber-300' : 'bg-purple-200 text-purple-900'
                            }`}>
                              ★
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-medium block truncate mt-1 ${
                          isSelected ? 'text-purple-200' : 'text-slate-400'
                        }`}>
                          {exam.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Abnormality Shortcut Buttons */}
              <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-amber-900 block">
                  {t.presetAbnormalNotice}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={insertGallstonePreset}
                    className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetGallstone}
                  </button>
                  <button
                    type="button"
                    onClick={insertRenalStonePreset}
                    className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetRenalStone}
                  </button>
                  <button
                    type="button"
                    onClick={insertFattyLiverPreset}
                    className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetFattyLiver}
                  </button>
                  <button
                    type="button"
                    onClick={insertLowAfiPreset}
                    className="px-2 py-0.5 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetLowAfi}
                  </button>
                </div>
              </div>

              {/* Study Type Input */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramStudy}
                </label>
                <input
                  type="text"
                  value={usgStudyType}
                  onChange={(e) => setUsgStudyType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Findings Box */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramOrganFindings}
                </label>
                <textarea
                  rows={4}
                  value={usgFindings}
                  onChange={(e) => setUsgFindings(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
              </div>

              {/* Impression Box */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramImpression}
                </label>
                <input
                  type="text"
                  value={usgImpression}
                  onChange={(e) => setUsgImpression(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full min-h-[42px] py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                {isPublishing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.submitReport}</span>
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