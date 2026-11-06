'use client';

import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Search, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  User, 
  Building2, 
  Calendar, 
  Activity, 
  ChevronRight, 
  Eye, 
  Check, 
  Stethoscope, 
  X, 
  ArrowLeft 
} from 'lucide-react';

// ==========================================
// 1. MASTER MEDICAL TESTS DICTIONARY (JSON)
// ==========================================
export const MASTER_LAB_TESTS = {
  cbc: {
    id: 'cbc',
    name: 'Complete Blood Count (CBC & Hemogram)',
    category: 'Hematology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'EDTA Whole Blood (2 ml)',
    method: 'Automated 5-Part Cell Counter & Microscopy',
    parameters: [
      { key: 'hb', name: 'Hemoglobin (Hb)', unit: 'g/dL', minM: 13.5, maxM: 17.5, minF: 12.0, maxF: 15.5, defaultVal: '13.5', type: 'numeric' },
      { key: 'tlc', name: 'Total Leucocyte Count (TLC / WBC)', unit: '/cumm', min: 4000, max: 11000, defaultVal: '7500', type: 'numeric' },
      { key: 'rbc', name: 'Total RBC Count', unit: 'mil/cumm', minM: 4.5, maxM: 5.9, minF: 4.0, maxF: 5.2, defaultVal: '4.8', type: 'numeric' },
      { key: 'platelets', name: 'Platelet Count', unit: 'Lakh/cumm', min: 1.5, max: 4.5, defaultVal: '2.4', type: 'numeric' },
      { key: 'pcv', name: 'Packed Cell Volume (PCV / Hematocrit)', unit: '%', minM: 40, maxM: 52, minF: 36, maxF: 48, defaultVal: '42.0', type: 'numeric' },
      { key: 'mcv', name: 'Mean Corpuscular Volume (MCV)', unit: 'fL', min: 80, max: 100, defaultVal: '88.5', type: 'numeric' },
      { key: 'mch', name: 'Mean Corpuscular Hemoglobin (MCH)', unit: 'pg', min: 27, max: 32, defaultVal: '29.2', type: 'numeric' },
      { key: 'mchc', name: 'Mean Corpuscular Hb Conc (MCHC)', unit: 'g/dL', min: 32, max: 36, defaultVal: '33.5', type: 'numeric' },
      { key: 'neutrophils', name: 'Neutrophils', unit: '%', min: 40, max: 75, defaultVal: '62', type: 'numeric' },
      { key: 'lymphocytes', name: 'Lymphocytes', unit: '%', min: 20, max: 45, defaultVal: '30', type: 'numeric' },
      { key: 'eosinophils', name: 'Eosinophils', unit: '%', min: 1, max: 6, defaultVal: '3', type: 'numeric' },
      { key: 'monocytes', name: 'Monocytes', unit: '%', min: 2, max: 8, defaultVal: '4', type: 'numeric' },
      { key: 'basophils', name: 'Basophils', unit: '%', min: 0, max: 1, defaultVal: '1', type: 'numeric' }
    ]
  },

  sugar: {
    id: 'sugar',
    name: 'Blood Glucose & Glycemic Profile (शुगर)',
    category: 'Biochemistry',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Fluoride Plasma / Whole Blood',
    method: 'GOD-POD Enzymatic Method & HPLC',
    parameters: [
      { key: 'fbs', name: 'Fasting Blood Sugar (FBS)', unit: 'mg/dL', min: 70, max: 100, defaultVal: '88', type: 'numeric' },
      { key: 'ppbs', name: 'Post Prandial Blood Sugar (PPBS, 2hr)', unit: 'mg/dL', min: 80, max: 140, defaultVal: '124', type: 'numeric' },
      { key: 'rbs', name: 'Random Blood Sugar (RBS)', unit: 'mg/dL', min: 70, max: 140, defaultVal: '104', type: 'numeric' },
      { key: 'hba1c', name: 'Glycated Hemoglobin (HbA1c)', unit: '%', min: 4.0, max: 5.6, defaultVal: '5.2', type: 'numeric' }
    ]
  },

  kft: {
    id: 'kft',
    name: 'Kidney / Renal Function Test (KFT / RFT)',
    category: 'Biochemistry',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (Plain Clot Vial, 3 ml)',
    method: 'Spectrophotometry & Ion Selective Electrode (ISE)',
    parameters: [
      { key: 'urea', name: 'Blood Urea', unit: 'mg/dL', min: 15, max: 40, defaultVal: '24', type: 'numeric' },
      { key: 'creatinine', name: 'Serum Creatinine', unit: 'mg/dL', minM: 0.7, maxM: 1.3, minF: 0.6, maxF: 1.1, defaultVal: '0.9', type: 'numeric' },
      { key: 'uric_acid', name: 'Serum Uric Acid', unit: 'mg/dL', minM: 3.5, maxM: 7.2, minF: 2.6, maxF: 6.0, defaultVal: '4.8', type: 'numeric' },
      { key: 'bun', name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', min: 7, max: 20, defaultVal: '12', type: 'numeric' },
      { key: 'sodium', name: 'Serum Sodium (Na+)', unit: 'mEq/L', min: 135, max: 145, defaultVal: '140', type: 'numeric' },
      { key: 'potassium', name: 'Serum Potassium (K+)', unit: 'mEq/L', min: 3.5, max: 5.1, defaultVal: '4.2', type: 'numeric' },
      { key: 'chloride', name: 'Serum Chloride (Cl-)', unit: 'mEq/L', min: 96, max: 106, defaultVal: '101', type: 'numeric' }
    ]
  },

  lft: {
    id: 'lft',
    name: 'Liver Function Test (LFT Panel)',
    category: 'Biochemistry',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (3 ml Plain Vial)',
    method: 'Fully Automated Clinical Chemistry Analyzer',
    parameters: [
      { key: 'bili_total', name: 'Bilirubin Total', unit: 'mg/dL', min: 0.2, max: 1.2, defaultVal: '0.8', type: 'numeric' },
      { key: 'bili_direct', name: 'Bilirubin Direct (Conjugated)', unit: 'mg/dL', min: 0.0, max: 0.3, defaultVal: '0.2', type: 'numeric' },
      { key: 'bili_indirect', name: 'Bilirubin Indirect (Unconjugated)', unit: 'mg/dL', min: 0.1, max: 0.8, defaultVal: '0.6', type: 'numeric' },
      { key: 'sgot', name: 'SGOT / AST (Aspartate Aminotransferase)', unit: 'U/L', min: 5, max: 40, defaultVal: '26', type: 'numeric' },
      { key: 'sgpt', name: 'SGPT / ALT (Alanine Aminotransferase)', unit: 'U/L', min: 7, max: 56, defaultVal: '32', type: 'numeric' },
      { key: 'alp', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', min: 44, max: 147, defaultVal: '88', type: 'numeric' },
      { key: 'protein_total', name: 'Total Protein', unit: 'g/dL', min: 6.0, max: 8.3, defaultVal: '7.2', type: 'numeric' },
      { key: 'albumin', name: 'Serum Albumin', unit: 'g/dL', min: 3.5, max: 5.5, defaultVal: '4.4', type: 'numeric' },
      { key: 'ag_ratio', name: 'A:G Ratio', unit: 'Ratio', min: 1.2, max: 2.2, defaultVal: '1.6', type: 'numeric' }
    ]
  },

  lipid: {
    id: 'lipid',
    name: 'Lipid Profile (कोलेस्ट्रॉल एवं फैट जांच)',
    category: 'Biochemistry',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (Fasting 12 Hours, 3 ml)',
    method: 'Enzymatic Colorimetric Method',
    parameters: [
      { key: 'cholesterol_total', name: 'Total Cholesterol', unit: 'mg/dL', min: 125, max: 200, defaultVal: '165', type: 'numeric' },
      { key: 'triglycerides', name: 'Serum Triglycerides', unit: 'mg/dL', min: 60, max: 150, defaultVal: '128', type: 'numeric' },
      { key: 'hdl', name: 'HDL Cholesterol ("अच्छा" HDL)', unit: 'mg/dL', minM: 40, maxM: 60, minF: 50, maxF: 70, defaultVal: '46', type: 'numeric' },
      { key: 'ldl', name: 'LDL Cholesterol ("हानिकारक" LDL)', unit: 'mg/dL', min: 0, max: 100, defaultVal: '88', type: 'numeric' },
      { key: 'vldl', name: 'VLDL Cholesterol', unit: 'mg/dL', min: 5, max: 30, defaultVal: '25.6', type: 'numeric' },
      { key: 'chol_hdl_ratio', name: 'Total Chol / HDL Ratio', unit: 'Ratio', min: 3.0, max: 5.0, defaultVal: '3.6', type: 'numeric' }
    ]
  },

  widal: {
    id: 'widal',
    name: 'Widal Slide / Tube Test (टाइफाइड जांच)',
    category: 'Serology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (2 ml)',
    method: 'Slide & Tube Agglutination Reaction',
    parameters: [
      { key: 's_typhi_o', name: 'Salmonella typhi "O" Antigen', unit: 'Titre', range: '< 1:80 (Non-Reactive)', defaultVal: '< 1:80', type: 'select', options: ['< 1:80 (Non-Reactive)', '1:80 (Borderline)', '1:160 (Reactive / Positive)', '1:320 (Strongly Reactive)'] },
      { key: 's_typhi_h', name: 'Salmonella typhi "H" Antigen', unit: 'Titre', range: '< 1:80 (Non-Reactive)', defaultVal: '< 1:80', type: 'select', options: ['< 1:80 (Non-Reactive)', '1:80 (Borderline)', '1:160 (Reactive / Positive)', '1:320 (Strongly Reactive)'] },
      { key: 's_paratyphi_ah', name: 'Salmonella paratyphi "AH" Antigen', unit: 'Titre', range: '< 1:80 (Non-Reactive)', defaultVal: '< 1:80', type: 'select', options: ['< 1:80 (Non-Reactive)', '1:80 (Borderline)', '1:160 (Reactive)'] },
      { key: 's_paratyphi_bh', name: 'Salmonella paratyphi "BH" Antigen', unit: 'Titre', range: '< 1:80 (Non-Reactive)', defaultVal: '< 1:80', type: 'select', options: ['< 1:80 (Non-Reactive)', '1:80 (Borderline)', '1:160 (Reactive)'] }
    ]
  },

  mp_card: {
    id: 'mp_card',
    name: 'Malarial Parasite (मलेरिया MP Card & Smear)',
    category: 'Microbiology & Parasitology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Whole Blood / Finger Prick',
    method: 'Immunochromatographic Rapid Card & Leishman Stain PBS',
    parameters: [
      { key: 'pv', name: 'Plasmodium vivax (P.v. Antigen)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Negative', type: 'select', options: ['Negative', 'Positive (Reactive)'] },
      { key: 'pf', name: 'Plasmodium falciparum (P.f. Antigen)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Negative', type: 'select', options: ['Negative', 'Positive (Reactive)'] },
      { key: 'smear', name: 'Peripheral Blood Smear (PBS for MP)', unit: 'Microscopy', range: 'No hemoparasite seen', defaultVal: 'No malarial parasite trophozoites or gametocytes seen in smear', type: 'text' }
    ]
  },

  dengue: {
    id: 'dengue',
    name: 'Dengue Serology (डेंगू कार्ड जांच)',
    category: 'Serology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum / Clot Blood (2 ml)',
    method: 'Immunochromatographic Rapid Card Assay',
    parameters: [
      { key: 'dengue_ns1', name: 'Dengue NS1 Antigen (प्रारंभिक 1-5 दिन)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Negative', type: 'select', options: ['Negative', 'Positive (संक्रमित)'] },
      { key: 'dengue_igm', name: 'Dengue IgM Antibody (हालिया संक्रमण)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Negative', type: 'select', options: ['Negative', 'Positive (संक्रमित)'] },
      { key: 'dengue_igg', name: 'Dengue IgG Antibody (पूर्व संक्रमण)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Negative', type: 'select', options: ['Negative', 'Positive (संक्रमित)'] }
    ]
  },

  urine_rm: {
    id: 'urine_rm',
    name: 'Urine Routine & Microscopic (पेशाब जांच R/M)',
    category: 'Clinical Pathology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Fresh Midstream Clean Catch Urine (15 ml)',
    method: 'Dry Strip Chemistry & Centrifuged Urine Microscopy',
    parameters: [
      { key: 'color', name: 'Color & Appearance', unit: 'Physical', range: 'Pale Yellow / Clear', defaultVal: 'Pale Yellow, Clear', type: 'text' },
      { key: 'sp_gravity', name: 'Specific Gravity', unit: 'Index', min: 1.005, max: 1.030, defaultVal: '1.018', type: 'numeric' },
      { key: 'ph', name: 'Reaction (pH)', unit: 'pH', min: 4.8, max: 7.5, defaultVal: '6.5', type: 'numeric' },
      { key: 'albumin', name: 'Chemical: Albumin / Protein', unit: 'Chemical', range: 'Nil / Negative', defaultVal: 'Nil', type: 'select', options: ['Nil', 'Trace', '+ (30 mg/dL)', '++ (100 mg/dL)', '+++ (300 mg/dL)'] },
      { key: 'sugar', name: 'Chemical: Urine Glucose / Sugar', unit: 'Chemical', range: 'Nil / Negative', defaultVal: 'Nil', type: 'select', options: ['Nil', 'Trace', '+ (100 mg/dL)', '++ (250 mg/dL)', '+++ (500 mg/dL)'] },
      { key: 'pus_cells', name: 'Microscopic: Pus Cells (WBCs)', unit: '/HPF', min: 0, max: 5, defaultVal: '1-2', type: 'text' },
      { key: 'rbc', name: 'Microscopic: Red Blood Cells (RBCs)', unit: '/HPF', min: 0, max: 2, defaultVal: 'Nil', type: 'text' },
      { key: 'epith_cells', name: 'Microscopic: Epithelial Cells', unit: '/HPF', min: 0, max: 5, defaultVal: '2-3', type: 'text' },
      { key: 'casts', name: 'Microscopic: Casts', unit: '/LPF', range: 'Nil / Absent', defaultVal: 'Nil', type: 'text' },
      { key: 'crystals', name: 'Microscopic: Crystals', unit: '/HPF', range: 'Nil / Absent', defaultVal: 'Nil', type: 'text' }
    ]
  },

  thyroid: {
    id: 'thyroid',
    name: 'Thyroid Profile (थायरॉइड जांच TSH, T3, T4)',
    category: 'Biochemistry',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (Plain Vial, 2 ml)',
    method: 'Chemiluminescence Immunoassay (CLIA / ELISA)',
    parameters: [
      { key: 'tsh', name: 'Thyroid Stimulating Hormone (TSH)', unit: 'µIU/mL', min: 0.35, max: 4.94, defaultVal: '2.45', type: 'numeric' },
      { key: 't3_total', name: 'Total Triiodothyronine (Total T3)', unit: 'ng/mL', min: 0.8, max: 2.0, defaultVal: '1.25', type: 'numeric' },
      { key: 't4_total', name: 'Total Thyroxine (Total T4)', unit: 'µg/dL', min: 5.1, max: 14.1, defaultVal: '8.4', type: 'numeric' }
    ]
  },

  blood_group: {
    id: 'blood_group',
    name: 'Blood Grouping & Rh Factor (रक्त समूह)',
    category: 'Hematology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'EDTA Whole Blood / Finger Prick',
    method: 'Slide & Tube Agglutination (Monoclonal Antisera)',
    parameters: [
      { key: 'abo_group', name: 'ABO Blood Group (रक्त समूह)', unit: 'Type', range: 'A / B / AB / O', defaultVal: 'B Positive (B+ve)', type: 'select', options: ['A Positive (A+ve)', 'A Negative (A-ve)', 'B Positive (B+ve)', 'B Negative (B-ve)', 'AB Positive (AB+ve)', 'AB Negative (AB-ve)', 'O Positive (O+ve)', 'O Negative (O-ve)'] },
      { key: 'rh_factor', name: 'Rh (D) Factor', unit: 'Antigen', range: 'Positive / Negative', defaultVal: 'Positive (+ve)', type: 'select', options: ['Positive (+ve)', 'Negative (-ve)'] }
    ]
  },

  viral_marker: {
    id: 'viral_marker',
    name: 'Viral Screening & ANC Profile (HBsAg, HIV, HCV, VDRL)',
    category: 'Serology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (3 ml Plain Vial)',
    method: 'Rapid Immunochromatographic Card Test',
    parameters: [
      { key: 'hiv', name: 'HIV 1 & 2 Antibody Screening', unit: 'Qualitative', range: 'Non-Reactive', defaultVal: 'Non-Reactive', type: 'select', options: ['Non-Reactive', 'Reactive (पॉजिटिव)'] },
      { key: 'hbsag', name: 'HBsAg (Hepatitis B Surface Antigen)', unit: 'Qualitative', range: 'Non-Reactive', defaultVal: 'Non-Reactive', type: 'select', options: ['Non-Reactive', 'Reactive (पॉजिटिव)'] },
      { key: 'hcv', name: 'HCV (Hepatitis C Virus Antibody)', unit: 'Qualitative', range: 'Non-Reactive', defaultVal: 'Non-Reactive', type: 'select', options: ['Non-Reactive', 'Reactive (पॉजिटिव)'] },
      { key: 'vdrl', name: 'VDRL / RPR (Syphilis Screening)', unit: 'Qualitative', range: 'Non-Reactive', defaultVal: 'Non-Reactive', type: 'select', options: ['Non-Reactive', 'Reactive (पॉजिटिव)'] }
    ]
  },

  upt: {
    id: 'upt',
    name: 'Urine Pregnancy Test (UPT - गर्भावस्था जांच)',
    category: 'Clinical Pathology',
    isPopular: true,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Early Morning Fresh Midstream Urine (5 ml)',
    method: 'Rapid Immunoassay for hCG Detection',
    parameters: [
      { key: 'hcg_result', name: 'Urine hCG (Pregnancy Card Test)', unit: 'Qualitative', range: 'Negative', defaultVal: 'Positive (गर्भवती)', type: 'select', options: ['Positive (गर्भवती)', 'Negative (गैर-गर्भवती)'] }
    ]
  },

  esr_bt_ct: {
    id: 'esr_bt_ct',
    name: 'ESR, Bleeding Time & Clotting Time (ESR, BT, CT)',
    category: 'Hematology',
    isPopular: false,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Citrated Blood & Fresh Whole Blood',
    method: 'Westergren Method & Duke/Lee-White Method',
    parameters: [
      { key: 'esr', name: 'ESR (Erythrocyte Sedimentation Rate 1st Hr)', unit: 'mm/1st hr', minM: 0, maxM: 15, minF: 0, maxF: 20, defaultVal: '10', type: 'numeric' },
      { key: 'bt', name: 'Bleeding Time (BT)', unit: 'Min : Sec', range: '2 - 7 Minutes', defaultVal: '2 min 40 sec', type: 'text' },
      { key: 'ct', name: 'Clotting Time (CT)', unit: 'Min : Sec', range: '4 - 10 Minutes', defaultVal: '5 min 30 sec', type: 'text' }
    ]
  },

  crp_ra: {
    id: 'crp_ra',
    name: 'CRP & RA Factor (सूजन एवं गठिया जांच)',
    category: 'Serology',
    isPopular: false,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Serum (Plain Vial, 2 ml)',
    method: 'Latex Agglutination & Turbidimetry',
    parameters: [
      { key: 'crp', name: 'C-Reactive Protein (CRP)', unit: 'mg/L', min: 0, max: 6.0, defaultVal: '3.2', type: 'numeric' },
      { key: 'ra_factor', name: 'Rheumatoid Factor (RA / RF)', unit: 'IU/mL', min: 0, max: 20, defaultVal: '10.5', type: 'numeric' }
    ]
  },

  sputum_afb: {
    id: 'sputum_afb',
    name: 'Sputum for AFB (टीबी बलगम जांच - ZN Stain)',
    category: 'Microbiology & Parasitology',
    isPopular: false,
    department: 'Pathology Lab (कमरा नं. 04)',
    specimen: 'Early Morning Deep Mucopurulent Sputum',
    method: 'Ziehl-Neelsen (ZN) Acid Fast Staining & Direct Microscopy',
    parameters: [
      { key: 'sample_quality', name: 'Sample Physical Appearance', unit: 'Physical', range: 'Mucopurulent', defaultVal: 'Mucopurulent', type: 'text' },
      { key: 'afb_smear', name: 'Acid Fast Bacilli (AFB Smear)', unit: 'Microscopy', range: 'Negative / Not Seen', defaultVal: 'Negative (No Acid Fast Bacilli seen under 100 Oil Immersion fields)', type: 'select', options: ['Negative (No AFB Seen)', 'Positive 1+ (10-99 AFB per 100 fields)', 'Positive 2+ (1-10 AFB per field)', 'Positive 3+ (>10 AFB per field)'] }
    ]
  }
};

export default function LabReportGenerator({ initialPatient = null, onClose = null }) {
  const [selectedTestId, setSelectedTestId] = useState('cbc');
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Patient & Clinical Metadata
  const [patient, setPatient] = useState(() => ({
    hospitalName: 'राजकीय सामान्य चिकित्सालय, पोकरण',
    hospitalSub: 'Govt. Sub-District Hospital, Pokaran (Jaisalmer)',
    parchiCode: initialPatient?.parchiCode || '104829',
    tokenNumber: initialPatient?.tokenNumber || 'BLD-104',
    name: initialPatient?.patientName || initialPatient?.name || 'कल्याण सिंह जोधा',
    age: initialPatient?.age || '48',
    gender: initialPatient?.gender || 'M',
    mobile: initialPatient?.mobile || '9829012345',
    refDoctor: initialPatient?.refDoctor || 'Dr. S. K. Sharma (MD Physician)',
    sampleDate: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    sampleTime: initialPatient?.timeStr || '08:45 AM',
    reportDate: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    reportTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    technicianName: 'सुरेश कुमार (वरिष्ठ लैब तकनीशियन)',
    pathologistName: 'डॉ. आर. के. बिश्नोई (MD Pathologist)'
  }));

  // Current Working Test Form Values
  const currentTest = MASTER_LAB_TESTS[selectedTestId];
  const [formValues, setFormValues] = useState(() => {
    const init = {};
    Object.values(MASTER_LAB_TESTS).forEach(t => {
      init[t.id] = {};
      t.parameters.forEach(p => {
        init[t.id][p.key] = p.defaultVal;
      });
    });
    return init;
  });

  // Clinical Remarks
  const [clinicalImpression, setClinicalImpression] = useState(
    'जांच परिणाम सामान्य सीमा में हैं। कृपया चिकित्सक से परामर्श लें।'
  );

  // Helper: Biological Range depending on Gender
  const getReferenceRange = (param) => {
    if (param.range) return param.range;
    if (param.minM !== undefined) {
      if (patient.gender === 'F') {
        return `${param.minF} - ${param.maxF} ${param.unit}`;
      }
      return `${param.minM} - ${param.maxM} ${param.unit}`;
    }
    if (param.min !== undefined && param.max !== undefined) {
      return `${param.min} - ${param.max} ${param.unit}`;
    }
    return 'Standard';
  };

  // Helper: Clinical High/Low Auto Flagging
  const checkAbnormalFlag = (param, val) => {
    if (!val || param.type !== 'numeric') {
      if (param.key === 'pv' || param.key === 'pf') {
        if (val && val.includes('Positive')) return 'HIGH';
      }
      if (param.key === 's_typhi_o' || param.key === 's_typhi_h') {
        if (val && (val.includes('1:160') || val.includes('1:320'))) return 'HIGH';
      }
      if (['dengue_ns1', 'dengue_igm', 'hiv', 'hbsag', 'hcv', 'vdrl'].includes(param.key)) {
        if (val && (val.includes('Positive') || val.includes('Reactive'))) return 'HIGH';
      }
      return 'NORMAL';
    }

    const num = parseFloat(val);
    if (isNaN(num)) return 'NORMAL';

    let min = param.min;
    let max = param.max;

    if (param.minM !== undefined) {
      min = patient.gender === 'F' ? param.minF : param.minM;
      max = patient.gender === 'F' ? param.maxF : param.maxM;
    }

    if (min !== undefined && num < min) return 'LOW';
    if (max !== undefined && num > max) return 'HIGH';
    return 'NORMAL';
  };

  // 1-Click Fill Standard Normal Values
  const handleSetNormalValues = () => {
    const updated = { ...formValues };
    currentTest.parameters.forEach(p => {
      updated[currentTest.id][p.key] = p.defaultVal;
    });
    setFormValues(updated);
    setClinicalImpression('सभी जांच मान सामान्य सीमा में हैं। कोई गंभीर विसंगति नहीं पाई गई।');
  };

  // Value change handler
  const handleParamChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [currentTest.id]: {
        ...prev[currentTest.id],
        [key]: value
      }
    }));
  };

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return Object.values(MASTER_LAB_TESTS).filter(t => 
      t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(testSearchQuery.toLowerCase())
    );
  }, [testSearchQuery]);

  return (
    <div translate="no" className="min-h-screen bg-slate-100 text-slate-900 pb-20 selection:bg-rose-100 w-full overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOP MOBILE-FIRST RESPONSIVE HEADER                          */}
      {/* ============================================================== */}
      <header className="print:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
          
          {/* Top Row: Title + Back Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 active:scale-95 rounded-lg"
                  title="वापस जाएं"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    डिजिटल पैम्फलेट जनरेटर
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-black shrink-0">
                    कमरा 04
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate hidden xs:block">
                  राजकीय चिकित्सालय पोकरण • लैब टर्मिनल
                </p>
              </div>
            </div>

            {/* Desktop Back Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex min-h-[36px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black items-center gap-1.5 transition shrink-0"
              >
                <X className="w-4 h-4" />
                <span>कतार पर वापस जाएं</span>
              </button>
            )}
          </div>

          {/* Action Buttons Row (Grid for Mobile, Clean Flex for Desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:justify-end gap-2 pt-1 border-t border-slate-100 sm:border-0 sm:pt-0">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 border ${
                previewMode 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'एडिट मोड' : 'पैम्फलेट प्रीव्यू'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[38px] px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (PDF)</span>
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN APP CONTENT                                            */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {!previewMode && (
          <div className="print:hidden space-y-4 sm:space-y-6">
            
            {/* Quick Test Selection Grid */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 block">
                    जांच का चयन करें (Select Lab Test)
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    किस जांच का पैम्फलेट तैयार करना है?
                  </h2>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={testSearchQuery}
                    onChange={(e) => setTestSearchQuery(e.target.value)}
                    placeholder="टेस्ट खोजें (CBC, KFT, LFT)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Horizontal Scroll / Adaptive Grid for Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
                {filteredTests.map((t) => {
                  const isSelected = selectedTestId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTestId(t.id)}
                      className={`min-h-[54px] sm:min-h-[64px] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 text-left transition flex flex-col justify-between active:scale-95 ${
                        isSelected 
                          ? 'border-rose-600 bg-rose-50 shadow-sm ring-1 ring-rose-500/20' 
                          : t.isPopular
                          ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 w-full">
                        <span className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight line-clamp-2">
                          {t.name.split('(')[0]}
                        </span>
                        {t.isPopular && (
                          <span className="shrink-0 px-1 py-0.2 bg-amber-100 text-amber-900 text-[8px] font-black rounded border border-amber-300">
                            ★
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block truncate mt-1">
                        {t.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Header Details Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  <span>मरीज विवरण (Patient Details)</span>
                </h3>
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">
                  कमरा नं. 04 पर्ची
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">पर्ची सं. (CR)</label>
                  <input
                    type="text"
                    value={patient.parchiCode}
                    onChange={(e) => setPatient({ ...patient, parchiCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">टोकन सं.</label>
                  <input
                    type="text"
                    value={patient.tokenNumber}
                    onChange={(e) => setPatient({ ...patient, tokenNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-black text-amber-600 focus:bg-white text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">मरीज का नाम</label>
                  <input
                    type="text"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">आयु (वर्ष)</label>
                  <input
                    type="text"
                    value={patient.age}
                    onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">लिंग</label>
                  <select
                    value={patient.gender}
                    onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900 focus:bg-white text-xs"
                  >
                    <option value="M">पुरुष (Male)</option>
                    <option value="F">महिला (Female)</option>
                    <option value="Other">अन्य</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Clinical Entry Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-6 shadow-xs space-y-3.5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">
                    सक्रिय जांच:
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {currentTest.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">
                    सैंपल: {currentTest.specimen}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSetNormalValues}
                  className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>⚡ सामान्य मान भरें (Fill Normal)</span>
                </button>
              </div>

              {/* ========================================================= */}
              {/* MOBILE CARD VIEW: FOR PHONES (< 640px)                    */}
              {/* Zero text clipping, zero horizontal overflow              */}
              {/* ========================================================= */}
              <div className="sm:hidden space-y-2.5">
                {currentTest.parameters.map((param) => {
                  const curVal = formValues[currentTest.id]?.[param.key] || '';
                  const flag = checkAbnormalFlag(param, curVal);

                  return (
                    <div 
                      key={param.key}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      {/* Card Header: Parameter Name + Alert Status */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {param.name}
                        </span>

                        {flag === 'HIGH' && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded font-black text-[9px] shrink-0">
                            HIGH
                          </span>
                        )}
                        {flag === 'LOW' && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-black text-[9px] shrink-0">
                            LOW
                          </span>
                        )}
                        {flag === 'NORMAL' && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[9px] shrink-0">
                            Normal
                          </span>
                        )}
                      </div>

                      {/* Card Body: Input with Unit attached */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          {param.type === 'select' ? (
                            <select
                              value={curVal}
                              onChange={(e) => handleParamChange(param.key, e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus:ring-2 focus:ring-rose-500"
                            >
                              {param.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={curVal}
                              onChange={(e) => handleParamChange(param.key, e.target.value)}
                              placeholder="मान दर्ज करें..."
                              className={`w-full px-3 py-2 rounded-xl font-black text-sm border focus:outline-none transition ${
                                flag === 'HIGH'
                                  ? 'bg-rose-50/70 border-rose-400 text-rose-700'
                                  : flag === 'LOW'
                                  ? 'bg-amber-50/70 border-amber-400 text-amber-800'
                                  : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500'
                              }`}
                            />
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-500 w-16 text-right shrink-0">
                          {param.unit}
                        </span>
                      </div>

                      {/* Card Footer: Standard Range */}
                      <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                        सामान्य सीमा: <strong className="text-slate-700">{getReferenceRange(param)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ========================================================= */}
              {/* DESKTOP TABLE VIEW: FOR LAPTOPS/TABLETS (>= 640px)        */}
              {/* ========================================================= */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-black">जांच का नाम (Investigation)</th>
                      <th className="py-2.5 px-3 font-black w-44">मरीज का मान (Result)</th>
                      <th className="py-2.5 px-3 font-black">इकाई (Unit)</th>
                      <th className="py-2.5 px-3 font-black">जैविक सामान्य सीमा (Range)</th>
                      <th className="py-2.5 px-3 font-black text-center">स्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {currentTest.parameters.map((param) => {
                      const curVal = formValues[currentTest.id]?.[param.key] || '';
                      const flag = checkAbnormalFlag(param, curVal);

                      return (
                        <tr key={param.key} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {param.name}
                          </td>

                          <td className="py-2.5 px-3">
                            {param.type === 'select' ? (
                              <select
                                value={curVal}
                                onChange={(e) => handleParamChange(param.key, e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white text-xs"
                              >
                                {param.options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={curVal}
                                onChange={(e) => handleParamChange(param.key, e.target.value)}
                                className={`w-full px-2.5 py-1.5 rounded-xl font-black text-xs border focus:outline-none transition ${
                                  flag === 'HIGH'
                                    ? 'bg-rose-50 border-rose-400 text-rose-700'
                                    : flag === 'LOW'
                                    ? 'bg-amber-50 border-amber-400 text-amber-800'
                                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                                }`}
                              />
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-slate-500 font-bold">
                            {param.unit}
                          </td>

                          <td className="py-2.5 px-3 text-slate-600 font-semibold">
                            {getReferenceRange(param)}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            {flag === 'HIGH' && (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded font-black text-[10px]">
                                HIGH
                              </span>
                            )}
                            {flag === 'LOW' && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-black text-[10px]">
                                LOW
                              </span>
                            )}
                            {flag === 'NORMAL' && (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Remarks Box */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-700 mb-1">
                  चिकित्सक टिप्पणी (Clinical Notes)
                </label>
                <textarea
                  rows={2}
                  value={clinicalImpression}
                  onChange={(e) => setClinicalImpression(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* 3. A4 PRINTABLE DIAGNOSTIC PAMPHLET (OFFICIAL FORMAT)          */}
        {/* ============================================================== */}
        <div className={`mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-4 sm:p-10 max-w-[850px] print:m-0 print:p-6 print:border-none print:shadow-none print:max-w-none print:w-full print:block ${
          previewMode ? 'block' : 'hidden print:block'
        }`}>

          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-3 sm:pb-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-rose-700 block truncate">
                चिकित्सा एवं स्वास्थ्य विभाग, राजस्थान सरकार
              </span>
              <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {patient.hospitalName}
              </h1>
              <p className="text-[11px] sm:text-xs font-bold text-slate-600 truncate">
                {patient.hospitalSub} • कमरा नं. 04 पैथोलॉजी विंग
              </p>
            </div>

            <div className="border border-slate-300 p-1.5 sm:p-2 rounded-xl text-center bg-slate-50 shrink-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-200 rounded flex items-center justify-center text-[8px] sm:text-[10px] font-mono text-slate-500 border border-dashed border-slate-400">
                [ QR CODE ]
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-800 mt-0.5 block">
                {patient.tokenNumber}
              </span>
            </div>
          </div>

          {/* Demographics Matrix Table */}
          <div className="my-3 py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">मरीज का नाम</span>
              <strong className="text-slate-900 text-xs sm:text-sm font-black truncate block">{patient.name}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">पर्ची सं. (CR Code)</span>
              <strong className="text-slate-900 text-xs sm:text-sm font-black">{patient.parchiCode}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">आयु / लिंग</span>
              <strong className="text-slate-900 text-xs font-black">{patient.age} Yrs / {patient.gender === 'M' ? 'Male' : 'Female'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">परामर्शदाता</span>
              <strong className="text-slate-800 text-xs font-bold truncate block">{patient.refDoctor}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">सैंपल समय</span>
              <span className="text-slate-800 text-[11px] font-semibold">{patient.sampleDate}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">रिपोर्ट समय</span>
              <span className="text-slate-800 text-[11px] font-semibold">{patient.reportTime}</span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">सैंपल प्रकार</span>
              <span className="text-slate-800 text-[11px] font-semibold truncate block">{currentTest.specimen}</span>
            </div>
          </div>

          {/* Test Investigation Title Bar */}
          <div className="bg-slate-800 text-white px-3 py-1 rounded flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-2">
            <span>{currentTest.name}</span>
            <span>कमरा नं. 04</span>
          </div>

          {/* Printed Clinical Results Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-700 text-slate-800">
                <th className="py-1.5 px-2 font-black">जांच पैरामीटर</th>
                <th className="py-1.5 px-2 font-black text-right">प्राप्त मान</th>
                <th className="py-1.5 px-2 font-black">इकाई</th>
                <th className="py-1.5 px-2 font-black">सामान्य सीमा</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentTest.parameters.map((param) => {
                const curVal = formValues[currentTest.id]?.[param.key] || '--';
                const flag = checkAbnormalFlag(param, curVal);

                return (
                  <tr key={param.key} className="py-1">
                    <td className="py-1.5 px-2 font-bold text-slate-900 text-xs">
                      {param.name}
                    </td>

                    <td className={`py-1.5 px-2 text-right font-black text-xs ${
                      flag === 'HIGH' ? 'text-rose-700 underline' : flag === 'LOW' ? 'text-amber-800 underline' : 'text-slate-900'
                    }`}>
                      {curVal} {flag === 'HIGH' && '*H'} {flag === 'LOW' && '*L'}
                    </td>

                    <td className="py-1.5 px-2 text-slate-600 font-semibold text-[11px]">
                      {param.unit}
                    </td>

                    <td className="py-1.5 px-2 text-slate-600 font-semibold text-[11px]">
                      {getReferenceRange(param)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footnotes & Impression */}
          <div className="mt-4 pt-2.5 border-t border-slate-300 space-y-1.5 text-xs">
            <div>
              <strong className="text-slate-800 font-black block text-[11px]">क्लिनिकल टिप्पणी:</strong>
              <p className="text-slate-700 font-medium bg-slate-50 p-2 rounded border border-slate-200 mt-0.5 text-xs">
                {clinicalImpression}
              </p>
            </div>
            <p className="text-[9px] text-slate-400">
              *H = सामान्य से अधिक, *L = सामान्य से कम। यह रिपोर्ट राजकीय सामान्य चिकित्सालय पोकरण के अधिकृत पैथोलॉजी विंग द्वारा जारी की गई है।
            </p>
          </div>

          {/* Signatures Footer */}
          <div className="mt-10 pt-3 border-t border-slate-300 flex items-end justify-between text-xs">
            <div className="text-center">
              <div className="w-28 border-b border-slate-400 pb-0.5 mb-1 text-[10px] text-slate-400 italic">
                Digitally Signed
              </div>
              <strong className="text-slate-900 block font-black text-xs">{patient.technicianName}</strong>
              <span className="text-[9px] text-slate-500">वरिष्ठ लैब तकनीशियन</span>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-400 pb-0.5 mb-1 text-[10px] text-slate-400 italic">
                Approved Online
              </div>
              <strong className="text-slate-900 block font-black text-xs">{patient.pathologistName}</strong>
              <span className="text-[9px] text-slate-500">पैथोलॉजिस्ट / प्रभारी</span>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}