export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  region: "Northern" | "Western" | "Southern" | "Central" | "Eastern" | "South-Western";
  state: string;
  type: "Engineering & Tech" | "Management" | "Pharmacy" | "Applied Arts";
  establishedYear: number;
}

export type ApplicationStage = 
  | "SUBMITTED"
  | "SCRUTINY"
  | "DEFICIENCY"
  | "EVC_QUEUE"
  | "EVC_SCHEDULED"
  | "SAC_SHC"
  | "APPROVED"
  | "REJECTED";

export interface ApprovalApplication {
  id: string;
  applicationNo: string;
  institutionId: string;
  institutionName: string;
  aicteId: string;
  region: string;
  program: string;
  academicYear: string;
  route: "Only Scrutiny" | "Scrutiny + EVC" | "EVC + SAC/SHC" | "Only EVC";
  currentStage: ApplicationStage;
  submittedDate: string;
  daysPending: number;
  slaDeadlineDays: number;
  isEscalated: boolean;
  escalationLevel: 0 | 1 | 2 | 3; // 0=Normal, 1=Regional Officer, 2=Bureau Officer, 3=Member Secretary
  deficiencyRemarks?: string;
}

export interface PrescribedDocument {
  id: string;
  institutionId: string;
  institutionName: string;
  aicteId: string;
  docType: "Registered Lease Deed (30 Yr)" | "Land Use Certificate (CLU)" | "Master Building Plan" | "FD Receipt (FDR)" | "Fire Safety Certificate";
  validFrom: string;
  validTo: string; // Expiry date
  daysRemaining: number;
  status: "VALID" | "EXPIRING_SOON" | "CRITICAL" | "EXPIRED";
  lastVerifiedBy?: string;
  alertSent: boolean;
}

export interface EVCInspection {
  id: string;
  applicationId: string;
  applicationNo: string;
  institutionName: string;
  aicteId: string;
  region: string;
  scheduledDate?: string;
  committeeChair?: string;
  expertMembers?: string[];
  status: "PENDING_SCHEDULE" | "SCHEDULED" | "COMPLETED" | "DELAYED";
  delayDays?: number;
}

// Initial Mock Seed Data
export const INITIAL_APPLICATIONS: ApprovalApplication[] = [
  {
    id: "app-1",
    applicationNo: "AICTE-2026-N-1082",
    institutionId: "inst-1",
    institutionName: "Delhi Institute of Technology & Science",
    aicteId: "1-10928371",
    region: "Northern",
    program: "B.Tech Computer Science & AI (New Course)",
    academicYear: "2026-2027",
    route: "Scrutiny + EVC",
    currentStage: "SCRUTINY",
    submittedDate: "2026-10-18",
    daysPending: 9,
    slaDeadlineDays: 7,
    isEscalated: true,
    escalationLevel: 1,
  },
  {
    id: "app-2",
    applicationNo: "AICTE-2026-W-2041",
    institutionId: "inst-2",
    institutionName: "Pune College of Engineering & Research",
    aicteId: "1-20938462",
    region: "Western",
    program: "Extension of Approval (EoA)",
    academicYear: "2026-2027",
    route: "Only Scrutiny",
    currentStage: "SCRUTINY",
    submittedDate: "2026-10-23",
    daysPending: 4,
    slaDeadlineDays: 7,
    isEscalated: false,
    escalationLevel: 0,
  },
  {
    id: "app-3",
    applicationNo: "AICTE-2026-S-3099",
    institutionId: "inst-3",
    institutionName: "Chennai Institute of Advanced Technology",
    aicteId: "1-30948573",
    region: "Southern",
    program: "New Technical Institution (Establishment)",
    academicYear: "2026-2027",
    route: "Scrutiny + EVC",
    currentStage: "EVC_QUEUE",
    submittedDate: "2026-10-10",
    daysPending: 17,
    slaDeadlineDays: 14,
    isEscalated: true,
    escalationLevel: 2,
  },
  {
    id: "app-4",
    applicationNo: "AICTE-2026-C-4015",
    institutionId: "inst-4",
    institutionName: "Bhopal Academy of Management Studies",
    aicteId: "1-40958684",
    region: "Central",
    program: "MBA Innovation & Entrepreneurship",
    academicYear: "2026-2027",
    route: "Only Scrutiny",
    currentStage: "DEFICIENCY",
    submittedDate: "2026-10-14",
    daysPending: 13,
    slaDeadlineDays: 10,
    isEscalated: false,
    escalationLevel: 0,
    deficiencyRemarks: "Clause 4.3 non-compliance: Faculty Cadre Ratio deficit in Associate Professor grade. Lease deed copy unnotarized.",
  },
  {
    id: "app-5",
    applicationNo: "AICTE-2026-SW-5022",
    institutionId: "inst-5",
    institutionName: "Bengaluru Institute of Pharmacy & Health",
    aicteId: "1-50968795",
    region: "South-Western",
    program: "B.Pharm & M.Pharm Expansion",
    academicYear: "2026-2027",
    route: "Scrutiny + EVC",
    currentStage: "EVC_SCHEDULED",
    submittedDate: "2026-10-08",
    daysPending: 19,
    slaDeadlineDays: 20,
    isEscalated: false,
    escalationLevel: 0,
  },
  {
    id: "app-6",
    applicationNo: "AICTE-2026-E-6011",
    institutionId: "inst-6",
    institutionName: "Kolkata Technical University Foundation",
    aicteId: "1-60978806",
    region: "Eastern",
    program: "Extension of Approval (EoA)",
    academicYear: "2026-2027",
    route: "Only Scrutiny",
    currentStage: "APPROVED",
    submittedDate: "2026-10-01",
    daysPending: 26,
    slaDeadlineDays: 25,
    isEscalated: false,
    escalationLevel: 0,
  },
];

export const INITIAL_DOCUMENTS: PrescribedDocument[] = [
  {
    id: "doc-1",
    institutionId: "inst-1",
    institutionName: "Delhi Institute of Technology & Science",
    aicteId: "1-10928371",
    docType: "Registered Lease Deed (30 Yr)",
    validFrom: "1996-11-15",
    validTo: "2026-11-14", // Expiring in ~18 days!
    daysRemaining: 18,
    status: "CRITICAL",
    alertSent: true,
  },
  {
    id: "doc-2",
    institutionId: "inst-4",
    institutionName: "Bhopal Academy of Management Studies",
    aicteId: "1-40958684",
    docType: "Fire Safety Certificate",
    validFrom: "2023-10-25",
    validTo: "2026-10-24", // Expired 3 days ago!
    daysRemaining: -3,
    status: "EXPIRED",
    alertSent: true,
  },
  {
    id: "doc-3",
    institutionId: "inst-2",
    institutionName: "Pune College of Engineering & Research",
    aicteId: "1-20938462",
    docType: "Registered Lease Deed (30 Yr)",
    validFrom: "1997-01-10",
    validTo: "2027-01-09", // ~73 days left
    daysRemaining: 73,
    status: "EXPIRING_SOON",
    alertSent: true,
  },
  {
    id: "doc-4",
    institutionId: "inst-3",
    institutionName: "Chennai Institute of Advanced Technology",
    aicteId: "1-30948573",
    docType: "FD Receipt (FDR)",
    validFrom: "2024-04-01",
    validTo: "2029-03-31",
    daysRemaining: 885,
    status: "VALID",
    alertSent: false,
  },
  {
    id: "doc-5",
    institutionId: "inst-5",
    institutionName: "Bengaluru Institute of Pharmacy & Health",
    aicteId: "1-50968795",
    docType: "Land Use Certificate (CLU)",
    validFrom: "2015-08-12",
    validTo: "2035-08-11",
    daysRemaining: 3210,
    status: "VALID",
    alertSent: false,
  },
  {
    id: "doc-6",
    institutionId: "inst-6",
    institutionName: "Kolkata Technical University Foundation",
    aicteId: "1-60978806",
    docType: "Master Building Plan",
    validFrom: "2020-05-18",
    validTo: "2030-05-17",
    daysRemaining: 1297,
    status: "VALID",
    alertSent: false,
  },
];

export const INITIAL_EVC_INSPECTIONS: EVCInspection[] = [
  {
    id: "evc-1",
    applicationId: "app-3",
    applicationNo: "AICTE-2026-S-3099",
    institutionName: "Chennai Institute of Advanced Technology",
    aicteId: "1-30948573",
    region: "Southern",
    status: "PENDING_SCHEDULE",
    delayDays: 3,
  },
  {
    id: "evc-2",
    applicationId: "app-5",
    applicationNo: "AICTE-2026-SW-5022",
    institutionName: "Bengaluru Institute of Pharmacy & Health",
    aicteId: "1-50968795",
    region: "South-Western",
    scheduledDate: "2026-11-04",
    committeeChair: "Prof. S. Ranganathan (IIT Madras)",
    expertMembers: ["Dr. K. V. Suresh (NIT Surathkal)", "Prof. Ananya Sen (NIPER)"],
    status: "SCHEDULED",
  },
];
