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
  ScanLine, 
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
  Bone,
  CheckSquare
} from 'lucide-react';

// ==============================================================
// 1. MASTER X-RAY INVESTIGATIONS DICTIONARY (MNJY RAJASTHAN)
// ==============================================================
export const MASTER_XRAY_EXAMS = {
  chest_pa: {
    id: 'chest_pa',
    nameEn: 'Chest PA View (Adult)',
    nameHi: 'छाती एक्स-रे (चेस्ट PA व्यू)',
    region: 'Chest',
    isPopular: true,
    findings: 'Trachea is midline. Both lung fields appear clear and well aerated. No focal parenchymal consolidation, infiltrate, or pleural effusion noted. Costophrenic and cardiophrenic angles are sharp. Cardiac size and aortic contour are within normal biological limits. Bony thoracic cage intact.',
    impression: 'NORMAL CHEST RADIOGRAPH (NO ACTIVE PULMONARY LESION SEEN)'
  },
  ls_spine: {
    id: 'ls_spine',
    nameEn: 'Lumbo-Sacral (LS) Spine AP & Lat',
    nameHi: 'कमर रीढ़ एक्स-रे (LS Spine AP/Lat)',
    region: 'Spine',
    isPopular: true,
    findings: 'Normal lumbar lordosis is maintained. Vertebral body heights and alignment are normal. Intervertebral disc spaces are well preserved. Pedicles, transverse, and spinous processes appear intact. No osteophytes, lytic/sclerotic lesion, or listhesis noted.',
    impression: 'NORMAL STUDY OF LUMBO-SACRAL SPINE'
  },
  cervical_spine: {
    id: 'cervical_spine',
    nameEn: 'Cervical Spine AP & Lat',
    nameHi: 'गर्दन रीढ़ एक्स-रे (Cervical Spine)',
    region: 'Spine',
    isPopular: true,
    findings: 'Normal cervical curvature is preserved. Vertebral body alignment and heights are normal. No prevertebral soft tissue swelling. Intervertebral disc spaces appear adequate. No fracture, dislocation or significant spondylotic changes.',
    impression: 'NORMAL STUDY OF CERVICAL SPINE'
  },
  knee_ap_lat: {
    id: 'knee_ap_lat',
    nameEn: 'Knee Joint AP & Lat (Bilateral)',
    nameHi: 'घुटने का एक्स-रे (Knee Joint AP/Lat)',
    region: 'Lower Limb',
    isPopular: true,
    findings: 'Bones forming the knee joint show normal cortical outlines and mineralization. Medial and lateral joint spaces are well preserved. No marginal osteophytes, subchondral sclerosis, or loose bodies seen. Patella and patellofemoral joint appear intact.',
    impression: 'NO RADIOLOGICAL EVIDENCE OF FRACTURE OR OSTEOARTHRITIC CHANGES'
  },
  pelvis_hips: {
    id: 'pelvis_hips',
    nameEn: 'Pelvis with Both Hip Joints (AP View)',
    nameHi: 'कूल्हे व पेल्विस एक्स-रे (Pelvis AP)',
    region: 'Lower Limb',
    isPopular: true,
    findings: 'Bony pelvis shows normal alignment. Sacroiliac and pubic symphysis joints appear normal. Both femoral heads are congruous within acetabular cavities. Neck of both femurs and trochanteric regions show intact cortices. No fracture or dislocation seen.',
    impression: 'NORMAL RADIOGRAPH OF PELVIS & BILATERAL HIP JOINTS'
  },
  ankle_ap_lat: {
    id: 'ankle_ap_lat',
    nameEn: 'Ankle Joint AP & Lat',
    nameHi: 'टखने का एक्स-रे (Ankle Joint AP/Lat)',
    region: 'Lower Limb',
    isPopular: true,
    findings: 'Tibiotalar and talofibular articulations are congruous. Medial, lateral, and posterior malleoli are intact with smooth cortical margins. No cortical disruption or fracture line identified. Surrounding soft tissues appear normal.',
    impression: 'NO FRACTURE OR DISLOCATION SEEN IN ANKLE JOINT'
  },
  hand_ap_oblique: {
    id: 'hand_ap_oblique',
    nameEn: 'Hand AP & Oblique View',
    nameHi: 'हाथ का पंजा (Hand AP/Oblique)',
    region: 'Upper Limb',
    isPopular: true,
    findings: 'Carpal, metacarpal, and phalangeal bones reveal normal configuration and mineralization. Joint spaces are preserved. No cortical break, periosteal reaction, or radio-opaque foreign body seen in the soft tissues.',
    impression: 'NO RADIOLOGICAL EVIDENCE OF BONY INJURY OR FRACTURE'
  },
  wrist_ap_lat: {
    id: 'wrist_ap_lat',
    nameEn: 'Wrist Joint AP & Lat',
    nameHi: 'कलाई का एक्स-रे (Wrist Joint)',
    region: 'Upper Limb',
    isPopular: false,
    findings: 'Distal radius and ulna reveal intact cortices. Carpal bones and radiocarpal joint alignment are anatomically normal. No fracture line or lunate/perilunate dislocation seen.',
    impression: 'NORMAL WRIST RADIOGRAPH (NO FRACTURE SEEN)'
  },
  forearm_ap_lat: {
    id: 'forearm_ap_lat',
    nameEn: 'Forearm (Radius & Ulna) AP & Lat',
    nameHi: 'अग्रबाहु एक्स-रे (Forearm AP/Lat)',
    region: 'Upper Limb',
    isPopular: false,
    findings: 'Shafts of radius and ulna show smooth and continuous cortical margins. Proximal and distal radioulnar joints are intact. No greenstick, hairline or displaced fracture identified.',
    impression: 'INTACT SHAFTS OF RADIUS & ULNA (NO FRACTURE)'
  },
  elbow_ap_lat: {
    id: 'elbow_ap_lat',
    nameEn: 'Elbow Joint AP & Lat',
    nameHi: 'कोहनी एक्स-रे (Elbow Joint AP/Lat)',
    region: 'Upper Limb',
    isPopular: false,
    findings: 'Distal humerus, proximal radius, and ulna appear intact. Anterior humeral line and radiocapitellar line alignment are maintained. No elevation of anterior/posterior fat pads (no sail sign).',
    impression: 'NORMAL ELBOW JOINT STUDY'
  },
  shoulder_ap: {
    id: 'shoulder_ap',
    nameEn: 'Shoulder Joint AP View',
    nameHi: 'कंधे का एक्स-रे (Shoulder Joint AP)',
    region: 'Upper Limb',
    isPopular: false,
    findings: 'Glenohumeral joint is congruous. Humeral head is properly seated in the glenoid cavity. Acromioclavicular joint appears intact. No fracture of proximal humerus or scapula.',
    impression: 'NORMAL SHOULDER JOINT (NO DISLOCATION OR FRACTURE)'
  },
  clavicle_ap: {
    id: 'clavicle_ap',
    nameEn: 'Clavicle AP View (Collar Bone)',
    nameHi: 'हंसली की हड्डी (Clavicle AP)',
    region: 'Upper Limb',
    isPopular: false,
    findings: 'Full length of clavicle shows smooth and continuous cortices. Sternal and acromial ends are normal. No cortical step-off, angulation, or displacement.',
    impression: 'NO FRACTURE NOTED IN CLAVICLE'
  },
  foot_ap_oblique: {
    id: 'foot_ap_oblique',
    nameEn: 'Foot AP & Oblique View',
    nameHi: 'पैर का पंजा (Foot AP/Oblique)',
    region: 'Lower Limb',
    isPopular: false,
    findings: 'Tarsal, metatarsal, and phalangeal bones reveal normal bony architecture. Tarsometatarsal alignment is preserved without Lisfranc disruption. No fracture or joint subluxation.',
    impression: 'NO BONY FRACTURE IDENTIFIED IN FOOT'
  },
  calcaneum_heel: {
    id: 'calcaneum_heel',
    nameEn: 'Calcaneum / Heel Lateral View',
    nameHi: 'एड़ी का एक्स-रे (Calcaneum Lateral)',
    region: 'Lower Limb',
    isPopular: false,
    findings: 'Calcaneus reveals normal trabecular pattern and intact cortices. Bohler\'s and Gissane\'s angles are within normal limits. Plantar aspect shows no significant calcaneal spur formation. Soft tissue heel pad thickness is normal.',
    impression: 'NORMAL CALCANEUM (NO FRACTURE OR PROMINENT SPUR)'
  },
  femur_thigh: {
    id: 'femur_thigh',
    nameEn: 'Femur / Thigh AP & Lat View',
    nameHi: 'जांघ की हड्डी (Femur AP/Lat)',
    region: 'Lower Limb',
    isPopular: false,
    findings: 'Femoral shaft shows thick, intact cortices with normal medullary canal. Adjacent soft tissues are unremarkable. No periosteal reaction, lytic lesion, or fracture line.',
    impression: 'NO FRACTURE DETECTED IN FEMUR'
  },
  leg_tibia_fibula: {
    id: 'leg_tibia_fibula',
    nameEn: 'Leg (Tibia & Fibula) AP & Lat',
    nameHi: 'पिंडी की हड्डी (Tibia-Fibula AP/Lat)',
    region: 'Lower Limb',
    isPopular: false,
    findings: 'Shafts of tibia and fibula show normal anatomical alignment. Cortices are intact throughout their extent. No fracture, stress reaction or cortical disruption.',
    impression: 'INTACT SHAFTS OF TIBIA & FIBULA'
  },
  pns_waters: {
    id: 'pns_waters',
    nameEn: 'PNS (Paranasal Sinuses - Water\'s View)',
    nameHi: 'साइनस एक्स-रे (PNS Water\'s View)',
    region: 'Head & Neck',
    isPopular: true,
    findings: 'Bilateral maxillary, frontal, and ethmoid sinuses are clear and normally pneumatized. No mucosal thickening, opacification, or fluid levels seen. Nasal septum appears in midline. Orbital margins are intact.',
    impression: 'NORMAL STUDY OF PARANASAL SINUSES (NO SINUSITIS)'
  },
  skull_ap_lat: {
    id: 'skull_ap_lat',
    nameEn: 'Skull AP & Lateral View',
    nameHi: 'खोपड़ी एक्स-रे (Skull AP/Lat)',
    region: 'Head & Neck',
    isPopular: false,
    findings: 'Calvarium shows normal thickness and density. Coronal, sagittal, and lambdoid sutures are normal. Sella turcica is normal in size and shape. No linear or depressed vault fracture identified.',
    impression: 'NO BONY INJURY OR FRACTURE SEEN IN CRANIAL VAULT'
  },
  mandible_ap_lat: {
    id: 'mandible_ap_lat',
    nameEn: 'Mandible AP & Oblique View',
    nameHi: 'निचला जबड़ा एक्स-रे (Mandible)',
    region: 'Head & Neck',
    isPopular: false,
    findings: 'Symphysis menti, body, angle, ramus, and condylar/coronoid processes of mandible show continuous cortical margins. Temporomandibular joints appear symmetrical. No fracture detected.',
    impression: 'INTACT MANDIBULAR BONE WITHOUT FRACTURE'
  },
  nasal_bone: {
    id: 'nasal_bone',
    nameEn: 'Nasal Bones Lateral View',
    nameHi: 'नाक की हड्डी (Nasal Bone Lateral)',
    region: 'Head & Neck',
    isPopular: false,
    findings: 'Nasal bone cortices show clean, continuous margins. Nasofrontal suture is normal. No fracture line, depression or displacement noted.',
    impression: 'NO RADIOLOGICAL EVIDENCE OF NASAL BONE FRACTURE'
  },
  abdomen_erect: {
    id: 'abdomen_erect',
    nameEn: 'Plain X-Ray Abdomen Erect View',
    nameHi: 'पेट का एक्स-रे (Abdomen Erect Plain)',
    region: 'Abdomen',
    isPopular: true,
    findings: 'Bowel gas distribution appears physiological. No multiple air-fluid levels or dilated bowel loops seen. Bilateral diaphragmatic domes are smooth, and NO free gas/air is seen under either dome of diaphragm. Psoas muscle margins are well visualized.',
    impression: 'NORMAL ABDOMINAL GAS PATTERN (NO PNEUMOPERITONEUM OR OBSTRUCTION)'
  },
  kub_plain: {
    id: 'kub_plain',
    nameEn: 'Plain X-Ray KUB (Kidney-Ureter-Bladder)',
    nameHi: 'किडनी-मूत्रमार्ग एक्स-रे (KUB Plain)',
    region: 'Abdomen',
    isPopular: true,
    findings: 'Renal shadows are bilateral, symmetrical, and normal in position. Psoas shadows are clearly delineated. No radio-opaque calculus, calcification, or foreign density is identified along the anatomical course of kidneys, ureters, or urinary bladder.',
    impression: 'NO RADIO-OPAQUE URINARY TRACT CALCULUS IDENTIFIED'
  }
};

// ==============================================================
// 2. MULTILINGUAL DICTIONARY (PRIMARY: ENGLISH | SECONDARY: HINDI)
// ==============================================================
const XRAY_TRANSLATIONS = {
  en: {
    roomTitle: 'Room 07 : Digital X-Ray & Radiology',
    hospitalSub: 'Govt. Hospital Pokaran • DR Imaging System',
    verifiedBadge: 'Radiology Staff',
    micActive: 'Mic Active',
    logout: 'Logout',
    liveStatus: 'Live X-Ray Queue',
    waitingCount: 'Patients Waiting:',
    searchPlaceholder: 'Search token, parchi or name...',
    queueHeader: 'Radiology Queue List',
    liveBadge: 'Room 07 Live',
    emptyQueue: 'No patients waiting for X-Ray.',
    emptySub: 'Tokens will appear here immediately once issued from kiosk.',
    parchi: 'Parchi',
    time: 'Time',
    statusWaiting: 'Waiting',
    statusInRoom: 'Scanning',
    statusCompleted: 'Done',
    btnCall: 'Call',
    btnRecall: 'Recall',
    btnQuickEntry: 'Enter Finding',
    btnEdit: 'Edit Finding',
    btnWhatsApp: 'WhatsApp',
    lockTitle: 'Room 07 (Digital X-Ray)',
    lockSub: 'Govt. Hospital, Pokaran • Radiographer Access Only',
    enterPin: 'Enter 4-Digit Staff PIN (Default: 7070)',
    unlockBtn: 'Unlock Radiology Console',
    backToHome: 'Back to Hospital Portal',
    modalTitle: 'Radiological Impression & Findings',
    selectExamLabel: 'Select Standard Rajasthan MNJY X-Ray Investigation:',
    popularBadge: '⭐ Most Popular',
    presetFractureNotice: '⚠️ Abnormality Shortcut Presets:',
    presetFracture: '⚡ Insert Fracture Finding',
    presetPneumonia: '⚡ Insert Chest Consolidation / Infection',
    paramView: 'X-Ray View / Body Region',
    paramFindings: 'Radiological Findings (Observations)',
    paramImpression: 'Impression / Clinical Diagnosis',
    submitReport: 'Publish X-Ray Report & Complete',
    footerText: 'Government Hospital Pokaran • Room 07 Digital X-Ray Wing • Webnexa Health'
  },
  hi: {
    roomTitle: 'कमरा नं. 07 : डिजिटल एक्स-रे केंद्र',
    hospitalSub: 'राजकीय सामान्य चिकित्सालय पोकरण • डीआर इमेजिंग सिस्टम',
    verifiedBadge: 'रेडियोलॉजी स्टाफ',
    micActive: 'माइक चालू',
    logout: 'लॉगआउट',
    liveStatus: 'लाइव एक्स-रे कतार',
    waitingCount: 'प्रतीक्षारत मरीज:',
    searchPlaceholder: 'टोकन, पर्ची या मरीज खोजें...',
    queueHeader: 'एक्स-रे कतार सूची',
    liveBadge: 'कमरा 07 लाइव',
    emptyQueue: 'अभी एक्स-रे हेतु कोई मरीज कतार में नहीं है।',
    emptySub: 'कियोस्क से टोकन जारी होते ही यहाँ स्वतः आ जाएगा।',
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
    lockTitle: 'कमरा नं. 07 (डिजिटल एक्स-रे)',
    lockSub: 'राजकीय अस्पताल पोकरण • अधिकृत रेडियोग्राफर स्टाफ',
    enterPin: '4-अंकों का स्टाफ पिन दर्ज करें (डिफ़ॉल्ट: 7070)',
    unlockBtn: 'कंसोल अनलॉक करें',
    backToHome: 'अस्पताल मुख्य पोर्टल पर जाएं',
    modalTitle: 'एक्स-रे रिपोर्ट एवं रेडियोलॉजिकल निष्कर्ष',
    selectExamLabel: 'राजस्थान सरकार (MNJY) निःशुल्क एक्स-रे जांच चुनें:',
    popularBadge: '⭐ मुख्य जांच',
    presetFractureNotice: '⚠️ असामान्य / बीमारी शॉर्टकट:',
    presetFracture: '⚡ फ्रैक्चर दर्ज करें',
    presetPneumonia: '⚡ निमोनिया / इन्फेक्शन दर्ज करें',
    paramView: 'एक्स-रे व्यू / अंग (Body Region)',
    paramFindings: 'एक्स-रे निष्कर्ष (Radiological Findings)',
    paramImpression: 'अंतिम निष्कर्ष / निदान (Impression)',
    submitReport: 'एक्स-रे रिपोर्ट जारी करें एवं पूर्ण करें',
    footerText: 'राजकीय सामान्य चिकित्सालय पोकरण • कमरा नं. 07 डिजिटल एक्स-रे विंग • Webnexa'
  }
};

export default function XRayConsole() {
  const [lang, setLang] = useState('en');
  const t = XRAY_TRANSLATIONS[lang];

  // Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Authentication State (Staff PIN: 7070)
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
  const [selectedExamKey, setSelectedExamKey] = useState('chest_pa');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');
  const [xrayView, setXrayView] = useState(MASTER_XRAY_EXAMS.chest_pa.nameEn);
  const [xrayFindings, setXrayFindings] = useState(MASTER_XRAY_EXAMS.chest_pa.findings);
  const [xrayImpression, setXrayImpression] = useState(MASTER_XRAY_EXAMS.chest_pa.impression);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('xray_session_auth');
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
        body: JSON.stringify({ type: 'xray', pin: pinInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('xray_session_auth', 'true');
        setPinInput('');
      } else if (pinInput === '7070') {
        setIsAuthenticated(true);
        sessionStorage.setItem('xray_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Invalid PIN! Use 7070.' : 'गलत पिन! सही पिन 7070 दर्ज करें।');
      }
    } catch (err) {
      if (pinInput === '7070') {
        setIsAuthenticated(true);
        sessionStorage.setItem('xray_session_auth', 'true');
        setPinInput('');
      } else {
        setPinError(lang === 'en' ? 'Server verification failed.' : 'सत्यापन विफल रहा।');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('xray_session_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Dedicated X-Ray Queue List
  const [xrayQueue, setXrayQueue] = useState([
    {
      id: 'XRY-D1',
      tokenNumber: 'XRY-201',
      trackingCode: 'PKR-40918',
      parchiCode: '409182',
      patientName: 'Ramprasad Bishnoi',
      mobile: '9414022334',
      status: 'waiting',
      timeStr: '09:00 AM',
      reportData: null
    },
    {
      id: 'XRY-D2',
      tokenNumber: 'XRY-202',
      trackingCode: 'PKR-11829',
      parchiCode: '118290',
      patientName: 'Kavita Kanwar',
      mobile: '9828456123',
      status: 'waiting',
      timeStr: '09:25 AM',
      reportData: null
    }
  ]);

  // Real-time Firestore Sync (Department: xray)
  useEffect(() => {
    if (!db || !isAuthenticated) return;

    try {
      const q = query(
        collection(db, 'tokens'),
        where('departmentId', '==', 'xray')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveTokens = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setXrayQueue(liveTokens);
        }
      }, (err) => console.warn('X-Ray Sync notice:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn('Realtime fallback active:', err);
    }
  }, [isAuthenticated]);

  // Audio Loudspeaker Calling for Room 07
  const callPatient = useCallback((patient) => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsCallingAudio(true);

      const message = lang === 'en'
        ? `Token Number ${patient.tokenNumber}. Patient ${patient.patientName}. Please proceed to Room Number 07 Digital X-Ray.`
        : `टोकन नंबर ${patient.tokenNumber}। मरीज ${patient.patientName}। कृपया डिजिटल एक्स-रे हेतु तुरंत कमरा नंबर 07 में पधारें।`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.88;

      utterance.onend = () => setIsCallingAudio(false);
      utterance.onerror = () => setIsCallingAudio(false);

      window.speechSynthesis.speak(utterance);
    }

    setXrayQueue(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'in-room' } : p));

    if (db && patient.id && !patient.id.startsWith('XRY-D')) {
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

  // Switch to a selected investigation from the 22+ Master List
  const handleSelectExam = (key) => {
    setSelectedExamKey(key);
    const exam = MASTER_XRAY_EXAMS[key];
    if (exam) {
      setXrayView(lang === 'en' ? exam.nameEn : exam.nameHi);
      setXrayFindings(exam.findings);
      setXrayImpression(exam.impression);
    }
  };

  // Quick Preset: Fracture Abnormality Insert
  const insertFracturePreset = () => {
    setXrayFindings(prev => `${prev}\n[ABNORMALITY OBSERVED]: Displaced cortical fracture line identified with mild surrounding soft tissue swelling. Alignment requires orthopedic review.`);
    setXrayImpression('EVIDENCE OF BONY FRACTURE - CLINICAL & ORTHOPEDIC CORRELATION ADVISED');
  };

  // Quick Preset: Consolidation / Pneumonia Insert
  const insertPneumoniaPreset = () => {
    setXrayFindings('Trachea is midline. Ill-defined inhomogeneous opacity / consolidation noted in the right lower lung zone with air bronchograms. Left lung field is clear. Costophrenic angles intact.');
    setXrayImpression('NON-HOMOGENOUS CONSOLIDATION IN RIGHT LOWER ZONE - LIKELY INFECTIVE / PNEUMONIA');
  };

  // Open Diagnostic Entry Form
  const handleOpenForm = (patient) => {
    setActiveReportPatient(patient);
    if (patient.reportData) {
      setXrayView(patient.reportData.view || MASTER_XRAY_EXAMS.chest_pa.nameEn);
      setXrayFindings(patient.reportData.findings || MASTER_XRAY_EXAMS.chest_pa.findings);
      setXrayImpression(patient.reportData.impression || MASTER_XRAY_EXAMS.chest_pa.impression);
    } else {
      handleSelectExam('chest_pa');
    }
  };

  // Publish X-Ray Findings
  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!activeReportPatient) return;

    setIsPublishing(true);

    const reportData = {
      view: xrayView,
      findings: xrayFindings,
      impression: xrayImpression,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      radiographer: 'Rameshwar Lal (Senior Radiographer, Pokaran)'
    };

    setXrayQueue(prev => prev.map(p => {
      if (p.id === activeReportPatient.id) {
        return {
          ...p,
          status: 'completed',
          reportData
        };
      }
      return p;
    }));

    if (db && activeReportPatient.id && !activeReportPatient.id.startsWith('XRY-D')) {
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
      `*Digital X-Ray Report (Room 07)*\n\n` +
      `Patient: *${patient.patientName}*\n` +
      `Parchi: *${patient.parchiCode}* | Token: *${patient.tokenNumber}*\n\n` +
      `📷 *View:* ${rep.view}\n` +
      `📋 *Findings:* ${rep.findings}\n\n` +
      `🔍 *Impression:* *${rep.impression}*\n\n` +
      `Verified: ${rep.radiographer}\n` +
      `🏥 _Official digital report generated by Hospital Smart OS._`
    );

    window.open(`https://wa.me/${mobileNumber}?text=${message}`, '_blank');
  };

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return xrayQueue.filter(item => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        item.patientName?.toLowerCase().includes(q) ||
        item.tokenNumber?.toLowerCase().includes(q) ||
        item.parchiCode?.includes(q) ||
        item.mobile?.includes(q)
      );
    });
  }, [xrayQueue, searchFilter]);

  // Master Exams filtered by Region
  const filteredMasterExams = useMemo(() => {
    const list = Object.entries(MASTER_XRAY_EXAMS);
    if (selectedRegionFilter === 'All') return list;
    return list.filter(([_, exam]) => exam.region === selectedRegionFilter);
  }, [selectedRegionFilter]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-xs">
            <ScanLine className="w-6 h-6 sm:w-7 sm:h-7" />
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
                className="w-full text-center tracking-[0.6em] text-xl sm:text-2xl font-black py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 transition"
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
    <div translate="no" className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-100 overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 shadow-xs w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5">
          
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ScanLine className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                  {t.roomTitle}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-black shrink-0 hidden xs:inline">
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
              <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
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

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3 flex-1 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* Status Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <ScanLine className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">{t.liveStatus}</span>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900">
                {t.waitingCount} {xrayQueue.filter(p => p.status === 'waiting').length}
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
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg sm:rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

        </div>

        {/* Patients Queue List */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-2.5 sm:p-3.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
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
                          isCompleted ? 'bg-slate-700 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-700'
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

      {/* ================= MODAL: 22+ X-RAY INVESTIGATIONS PRESET FINDINGS ================= */}
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
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
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
              
              {/* Region Category Tabs */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 mb-1">
                  {t.selectExamLabel}
                </label>
                
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  {['All', 'Chest', 'Spine', 'Upper Limb', 'Lower Limb', 'Head & Neck', 'Abdomen'].map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedRegionFilter(reg)}
                      className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-[10px] font-black transition shrink-0 ${
                        selectedRegionFilter === reg
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>

                {/* Grid of All Investigations */}
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
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : exam.isPopular
                            ? 'bg-amber-50/70 border-amber-300 text-slate-900 hover:bg-amber-100'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 w-full">
                          <span className="text-[10px] font-black leading-tight line-clamp-1">
                            {lang === 'en' ? exam.nameEn : exam.nameHi}
                          </span>
                          {exam.isPopular && (
                            <span className={`text-[8px] font-bold px-1 rounded shrink-0 ${
                              isSelected ? 'bg-indigo-800 text-amber-300' : 'bg-amber-200 text-amber-900'
                            }`}>
                              ★
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-medium block truncate mt-1 ${
                          isSelected ? 'text-indigo-200' : 'text-slate-400'
                        }`}>
                          {exam.region}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Abnormality Shortcut Buttons */}
              <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-rose-800 block">
                  {t.presetFractureNotice}
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={insertFracturePreset}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetFracture}
                  </button>
                  <button
                    type="button"
                    onClick={insertPneumoniaPreset}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-[10px] font-black shadow-2xs transition active:scale-95"
                  >
                    {t.presetPneumonia}
                  </button>
                </div>
              </div>

              {/* View Input */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramView}
                </label>
                <input
                  type="text"
                  value={xrayView}
                  onChange={(e) => setXrayView(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Findings Box */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramFindings}
                </label>
                <textarea
                  rows={3}
                  value={xrayFindings}
                  onChange={(e) => setXrayFindings(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                ></textarea>
              </div>

              {/* Impression Box */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 mb-0.5">
                  {t.paramImpression}
                </label>
                <input
                  type="text"
                  value={xrayImpression}
                  onChange={(e) => setXrayImpression(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full min-h-[42px] py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
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