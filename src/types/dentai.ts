export type RoleId = "hq" | "clinic" | "patient" | "camps" | "dpdp" | "pharma";

export type City = "Mumbai" | "Delhi" | "Bengaluru" | "Pune" | "Ahmedabad";

export type IndianState =
  | "Maharashtra"
  | "Delhi NCR"
  | "Karnataka"
  | "Gujarat";

export interface ComplianceCheckItem {
  id: string;
  category: "Clinical SOP" | "Hygiene & Sterilization" | "Statutory License";
  label: string;
  passed: boolean;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  city: City;
  state: IndianState;
  area: string;
  address: string;
  phone: string;
  manager: string;
  leadDentist: string;
  chairs: number;
  monthlyRevenue: number;
  expenses: number;
  netProfit: number;
  monthlyTarget: number;
  patientCount: number;
  emiVolume: number;
  royaltyRate: number;
  rating: number;
  aiAdoptionRate: number;
  complianceScore: number;
  complianceChecklist: ComplianceCheckItem[];
  status: "Active" | "Audited" | "Onboarding";
}

export interface OnboardingChecklistItem {
  id: string;
  step: number;
  title: string;
  category: "Legal & KYC" | "Civil & Interiors" | "Equipment & AI" | "Go-Live";
  completed: boolean;
}

export interface OnboardingFranchisee {
  id: string;
  applicantName: string;
  proposedBranch: string;
  city: City;
  state: IndianState;
  stage:
    | "Agreement"
    | "Fit-Out"
    | "Equipment & Training"
    | "Ready for Go-Live"
    | "Live";
  targetLaunchDate: string;
  investmentCommitted: number;
  checklist: OnboardingChecklistItem[];
}

export interface EquipmentItem {
  id: string;
  branchId: string;
  branchName: string;
  city: City;
  type: "Dental Chair" | "RVG X-Ray" | "Class-B Autoclave" | "CBCT Scanner";
  model: string;
  serialNumber: string;
  installedDate: string;
  warrantyExpiry: string;
  maintenanceStatus: "Operational" | "Due Soon" | "Under Service";
}

export interface PropertyListing {
  id: string;
  title: string;
  address: string;
  city: City;
  state: IndianState;
  carpetAreaSqFt: number;
  monthlyRent: number;
  footfallScore: number;
  nearbyAnchor: string;
  mapPinTag: string;
  photoLabel: string;
  imageUrl: string;
  status:
    | "Under Review"
    | "Shortlisted"
    | "Site Visit Scheduled"
    | "Approved"
    | "Rejected";
  siteVisitDate?: string;
}

export interface MarketingTemplate {
  id: string;
  title: string;
  campaignType:
    | "Root Canal + Crown"
    | "Dental Implants"
    | "Clear Aligners"
    | "Preventive Checkup";
  headline: string;
  subheadline: string;
  offerBadge: string;
  accentTone: "teal" | "navy" | "emerald";
}

export interface RoyaltyTransaction {
  id: string;
  txnRef: string;
  date: string;
  branchId: string;
  branchName: string;
  patientName: string;
  treatment: string;
  paymentMode: "UPI" | "Card" | "0% EMI";
  grossAmount: number;
  gatewayFee: number;
  royaltyPercent: number;
  hqShare: number;
  franchiseeShare: number;
  settlementStatus: "Settled" | "Pending Split" | "In Escrow";
}

export interface DpdpConsent {
  treatment: boolean;
  aiDiagnostics: boolean;
  marketing: boolean;
  financing: boolean;
  updatedAt: string;
}

export type ToothCondition =
  | "Healthy"
  | "Cavity"
  | "Root Canal Needed"
  | "Crown"
  | "Extracted";

export interface TreatmentPlanItem {
  id: string;
  toothNumber?: number;
  procedure: string;
  cost: number;
  status: "Proposed" | "In Progress" | "Completed";
}

export interface PatientVisitHistoryItem {
  id: string;
  date: string;
  branchName: string;
  procedure: string;
  doctor: string;
  amount: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "M" | "F";
  city: City;
  branchId: string;
  branchName: string;
  lastVisit: string;
  segment: "VIP" | "Implant Lead" | "Ortho Follow-up" | "Routine" | "Lapsed";
  dpdpConsent: DpdpConsent;
  activeTreatment: string;
  outstandingBalance: number;
  loyaltyPoints: number;
  allergies: string[];
  medicalHistory: string[];
  toothChart: Record<number, ToothCondition>;
  treatmentPlan: TreatmentPlanItem[];
  visitHistory: PatientVisitHistoryItem[];
}

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  branchId: string;
  doctorName: string;
  date: string;
  time: string;
  chair: string;
  treatment: string;
  estimatedAmount: number;
  status: "Scheduled" | "Checked-In" | "In-Chair" | "AI Scan Ready" | "Completed";
  aiNotes: string;
  xrayFindings: string;
}

export interface SpecialistReferral {
  id: string;
  referralCode: string;
  patientId: string;
  patientName: string;
  fromBranch: string;
  fromDoctor: string;
  specialty: "Endodontist" | "Oral Surgeon" | "Orthodontist";
  targetSpecialist: string;
  targetBranch: string;
  caseNotes: string;
  xrayAttached: boolean;
  estimatedValue: number;
  referralSharePercent: number;
  status: "Referred" | "Accepted" | "Consultation Done" | "Completed";
  createdAt: string;
}

export interface PrescriptionRecord {
  id: string;
  patientId: string;
  medicines: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  d2cSelfCareKit: string[];
  advice: string;
  generatedAt: string;
}

export interface DeliveryLogEvent {
  id: string;
  patientId: string;
  patientName: string;
  channels: Array<"WhatsApp" | "Email" | "PWA Vault">;
  timestamp: string;
  invoiceAmount: number;
}

export interface InsurancePlan {
  id: string;
  insurer: string;
  planName: string;
  coverageAmount: number;
  annualPremium: number;
  waitingPeriod: string;
  highlights: string[];
}

export interface PurchasedPolicy {
  id: string;
  policyNumber: string;
  planName: string;
  insurer: string;
  coverageAmount: number;
  annualPremium: number;
  validUntil: string;
  status: "Active";
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  invoiceRef: string;
  procedure: string;
  claimAmount: number;
  attachments: string[];
  status: "Submitted" | "Under Review" | "Approved/Settled";
  submittedAt: string;
}

export interface D2CProduct {
  id: string;
  name: string;
  category: "Toothpaste" | "Cleaning Kit" | "Caring Kit" | "Prescribed Pharma";
  price: number;
  mrp: number;
  tag?: string;
  isPrescribedKit?: boolean;
  description: string;
}

export interface D2COrder {
  id: string;
  orderNumber: string;
  items: Array<{ product: D2CProduct; qty: number }>;
  totalAmount: number;
  address: string;
  paymentMethod: "UPI";
  status: "Confirmed" | "Packed" | "Out for Delivery" | "Delivered";
  placedAt: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  roleBadge: string;
  verifiedDoctor: boolean;
  title: string;
  body: string;
  likes: number;
  likedByUser?: boolean;
  comments: Array<{ id: string; author: string; text: string; time: string }>;
  timestamp: string;
}

export type TreatmentSegmentCategory =
  | "Root Canal"
  | "Implants"
  | "Braces"
  | "Scaling";

export interface AutomationLog {
  id: string;
  ruleName:
    | "Booking Confirmation"
    | "24h Reminder"
    | "No-Show Recovery"
    | "Post-Visit Auto-PDF Delivery"
    | "Segment Care Drip";
  channel: "WhatsApp" | "SMS" | "Email";
  recipient: string;
  summary: string;
  timestamp: string;
  status: "Delivered" | "Read" | "Suppressed (DPDP)";
}

export interface CampLead {
  id: string;
  campId: string;
  campTitle: string;
  partnerPharma: string;
  name: string;
  phone: string;
  dentalIssue: string;
  assignedBranch: string;
  dpdpConsentGranted: boolean;
  voucherCode: string;
  status: "Voucher Sent" | "Visit Booked" | "Converted";
  registeredAt: string;
}

export interface SecurityAccessLog {
  id: string;
  timestamp: string;
  user: string;
  rbacRole:
    | "Branch Dentist"
    | "Franchisor Admin"
    | "DPO Officer"
    | "NBFC Fintech API";
  action: "Viewed EDR" | "Edited Tooth Chart" | "Exported Audit CSV" | "Pulled KYC";
  patientRecord: string;
  encryption: "AES-256-GCM";
}

export interface DpdpTicket {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  type: "Data Correction" | "Account Erasure" | "DPO Grievance";
  details: string;
  status: "Open" | "In Review" | "Resolved";
  createdAt: string;
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  brandLine: "Dr. Bajaj Proprietary" | "Partner Certified";
  category:
    | "Endodontics"
    | "Restorative"
    | "Implantology"
    | "Sterilization"
    | "Disposables";
  wholesalePrice: number;
  mrp: number;
  packSize: string;
  hqStock: number;
  stockBadge: "In Stock" | "Low HQ Stock" | "High Demand";
}

export interface ConsumableItem {
  id: string;
  branchId: string;
  sku: string;
  name: string;
  category:
    | "Endodontics"
    | "Implantology"
    | "Prosthodontics"
    | "Sterilization"
    | "Disposables"
    | "Restorative";
  stock: number;
  reorderLevel: number;
  moq: number;
  batchNumber: string;
  expiryDate: string;
  unit: string;
  unitPrice: number;
  supplier: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  branchId: string;
  branchName: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  status: "Ordered" | "Packed" | "Shipped" | "Delivered";
  createdAt: string;
  requestedBy: string;
  itemsSummary?: Array<{
    sku: string;
    name: string;
    qty: number;
    unitPrice: number;
  }>;
}

export interface EmiApplication {
  id: string;
  patientId: string;
  patientName: string;
  branchName: string;
  treatment: string;
  amount: number;
  tenureMonths: number;
  monthlyEmi: number;
  lender: "Bajaj Finserv Health" | "HDFC Ergo Care" | "SaveIN Dental";
  creditScore: number;
  status: "Pending" | "Approved" | "Disbursed" | "Declined";
  appliedAt: string;
}

export interface CampCampaign {
  id: string;
  title: string;
  partnerPharma: string;
  city: City;
  date: string;
  registrations: number;
  screened: number;
  conversions: number;
  channel: "WhatsApp" | "SMS" | "Email";
  status: "Active" | "Scheduled" | "Completed";
}

export interface DpdpAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  subject: string;
  purpose: string;
  status: "Compliant" | "Consent Revoked" | "Flagged" | "Verified";
  branchName: string;
}

export interface RoleMeta {
  id: RoleId;
  label: string;
  shortLabel: string;
  persona: string;
  href: string;
  description: string;
}
