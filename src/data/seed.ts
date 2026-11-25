import type {
  AutomationLog,
  Branch,
  CampCampaign,
  CampLead,
  CatalogProduct,
  City,
  CommunityPost,
  ComplianceCheckItem,
  ConsumableItem,
  D2CProduct,
  DpdpAuditLog,
  DpdpTicket,
  EmiApplication,
  EquipmentItem,
  IndianState,
  InsuranceClaim,
  InsurancePlan,
  MarketingTemplate,
  OnboardingChecklistItem,
  OnboardingFranchisee,
  Patient,
  PrescriptionRecord,
  PropertyListing,
  PurchaseOrder,
  PurchasedPolicy,
  RoleMeta,
  RoyaltyTransaction,
  SecurityAccessLog,
  SpecialistReferral,
  ToothCondition,
  Visit,
} from "@/types/dentai";

export const ROLES: RoleMeta[] = [
  {
    id: "hq",
    label: "HQ Command Center",
    shortLabel: "HQ Command",
    persona: "Dr. Ajay Bajaj (CMD & Franchisor)",
    href: "/hq",
    description: "Sales, clinic setup, locations, audits & royalties",
  },
  {
    id: "clinic",
    label: "Clinic & AI Doctor",
    shortLabel: "Clinic ERP",
    persona: "Dr. Meera Deshmukh (Bandra West)",
    href: "/clinic",
    description: "Appointments, tooth chart, AI X-ray & referrals",
  },
  {
    id: "camps",
    label: "AI Reception & Camps",
    shortLabel: "AI Camps",
    persona: "Riya AI (Patient Growth)",
    href: "/camps",
    description: "WhatsApp bot, patient segments & pharma camps",
  },
  {
    id: "dpdp",
    label: "DPDP Privacy & Audit",
    shortLabel: "DPDP Audit",
    persona: "Vikram Kulkarni (Data Protection Officer)",
    href: "/dpdp",
    description: "Consent ledger, minor <18 & breach readiness",
  },
  {
    id: "pharma",
    label: "Pharma B2B Network",
    shortLabel: "Pharma B2B",
    persona: "Sunil Verma (Pharma B2B Head)",
    href: "/pharma-b2b",
    description: "Doctor microsites, 5-tier hierarchy & AI posters",
  },
  {
    id: "patient",
    label: "Patient Mobile App",
    shortLabel: "Patient App",
    persona: "Aarav Sharma (Patient)",
    href: "/patient",
    description: "0% EMI, D2C store, vault & privacy controls",
  },
];

const CITY_STATE_MAP: Record<City, IndianState> = {
  Mumbai: "Maharashtra",
  Pune: "Maharashtra",
  Delhi: "Delhi NCR",
  Bengaluru: "Karnataka",
  Ahmedabad: "Gujarat",
};

const CITY_AREAS: Record<City, string[]> = {
  Mumbai: [
    "Bandra West",
    "Kurla West",
    "Andheri Lokhandwala",
    "Powai",
    "Juhu",
    "Lower Parel",
    "Dadar East",
    "Borivali West",
    "Thane Ghodbunder",
    "Vashi",
    "Chembur",
    "Malad West",
    "Colaba",
    "Ghatkopar",
    "Kandivali",
    "Mulund",
    "Worli",
    "Santacruz",
    "Goregaon",
    "Matunga",
    "Khar",
    "BKC",
    "Mira Road",
    "Panvel",
  ],
  Delhi: [
    "Connaught Place",
    "South Extension",
    "Vasant Vihar",
    "Saket",
    "Dwarka Sec 12",
    "Rohini Sec 7",
    "Greater Kailash I",
    "Lajpat Nagar",
    "Pitampura",
    "Janakpuri",
    "Hauz Khas",
    "Noida Sec 18",
    "Gurugram DLF Ph 4",
    "Rajouri Garden",
    "Preet Vihar",
    "Punjabi Bagh",
    "Mayur Vihar",
    "Karol Bagh",
    "Defence Colony",
    "Green Park",
    "Kalkaji",
    "Noida Sec 62",
  ],
  Bengaluru: [
    "Indiranagar",
    "Koramangala 4th Block",
    "Whitefield",
    "Jayanagar",
    "HSR Layout",
    "Sadashivanagar",
    "MG Road",
    "Malleshwaram",
    "JP Nagar",
    "Electronic City",
    "Marathahalli",
    "Hebbal",
    "Banashankari",
    "Yelahanka",
    "Bellandur",
    "RT Nagar",
    "Basavanagudi",
    "Sarjapur Road",
    "BTM Layout",
    "Frazer Town",
  ],
  Pune: [
    "Koregaon Park",
    "Kothrud",
    "Baner",
    "Viman Nagar",
    "Aundh",
    "Shivajinagar",
    "Hinjewadi",
    "Wakad",
    "Hadapsar",
    "Camp",
    "Deccan Gymkhana",
    "Pimpri",
    "Kharadi",
    "Bavdhan",
    "Magarpatta",
    "Karve Nagar",
    "Kondhwa",
    "Sinhagad Road",
    "Pashan",
  ],
  Ahmedabad: [
    "Satellite",
    "Prahlad Nagar",
    "Bodakdev",
    "Navrangpura",
    "SG Highway",
    "Vastrapur",
    "Maninagar",
    "Bopal",
    "Thaltej",
    "CG Road",
    "Sindhu Bhavan",
    "Gota",
    "Naranpura",
    "Paldi",
    "Chandkheda",
    "Ambawadi",
    "Memnagar",
    "Nikol",
    "Science City",
  ],
};

const DENTIST_NAMES = [
  "Dr. Meera Deshmukh",
  "Dr. Rohan Kapoor",
  "Dr. Ananya Iyer",
  "Dr. Siddharth Nair",
  "Dr. Priya Patel",
  "Dr. Kabir Malhotra",
  "Dr. Sneha Joshi",
  "Dr. Arjun Rao",
  "Dr. Kavita Kulkarni",
  "Dr. Vikramaditya Sen",
];

const MANAGER_NAMES = [
  "Rakesh Verma",
  "Neha Sharma",
  "Amitabh Desai",
  "Pooja Nair",
  "Sandeep Menon",
  "Divya Krishnan",
  "Harish Mehta",
  "Shruti Gupta",
];

const BASE_COMPLIANCE_ITEMS: Array<{
  category: ComplianceCheckItem["category"];
  label: string;
}> = [
  {
    category: "Clinical SOP",
    label: "Rotary RCT & Rubber Dam Isolation Protocol Verified",
  },
  {
    category: "Clinical SOP",
    label: "DentAI Vision Radiograph Pre-Treatment Sign-off Active",
  },
  {
    category: "Clinical SOP",
    label: "Informed Digital Consent Captured Before Procedure",
  },
  {
    category: "Hygiene & Sterilization",
    label: "Class-B Autoclave Spore Test Log (Weekly Biological Indicator)",
  },
  {
    category: "Hygiene & Sterilization",
    label: "4-Step Ultrasonic + Pouch Packaging Sterilization Audit",
  },
  {
    category: "Hygiene & Sterilization",
    label: "Biomedical Waste Segregation & Colour-Coded Bins Compliant",
  },
  {
    category: "Statutory License",
    label: "AERB Radiation Safety Certificate for RVG/CBCT Valid",
  },
  {
    category: "Statutory License",
    label: "State Dental Council Registration & Clinical Establishment Display",
  },
];

function buildComplianceChecklist(seedNum: number): {
  checklist: ComplianceCheckItem[];
  score: number;
} {
  const checklist: ComplianceCheckItem[] = BASE_COMPLIANCE_ITEMS.map(
    (item, idx) => {
      // Flagship clinics pass 100%, others occasionally miss 1 or 2 items
      const failed =
        seedNum > 5 &&
        ((seedNum % 7 === 0 && idx === 3) ||
          (seedNum % 11 === 0 && idx === 6) ||
          (seedNum % 13 === 0 && idx === 1));
      return {
        id: `chk-${seedNum}-${idx}`,
        category: item.category,
        label: item.label,
        passed: !failed,
      };
    }
  );
  const passedCount = checklist.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checklist.length) * 100);
  return { checklist, score };
}

function distributeToTarget(weights: number[], targetSum: number): number[] {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const scaled = weights.map((w) => Math.floor((w / totalWeight) * targetSum));
  const currentSum = scaled.reduce((a, b) => a + b, 0);
  scaled[0] += targetSum - currentSum;
  return scaled;
}

export function generateBranches(): Branch[] {
  const rawList: Array<{
    idx: number;
    city: City;
    state: IndianState;
    area: string;
    revWeight: number;
    expRatio: number;
    footfallWeight: number;
    emiWeight: number;
  }> = [];

  let idx = 1;
  (Object.keys(CITY_AREAS) as City[]).forEach((city) => {
    const areas = CITY_AREAS[city];
    areas.forEach((area, areaIdx) => {
      const isFlagship = areaIdx < 2;
      const revWeight =
        (isFlagship ? 1.55 : 0.85) + ((idx * 17) % 45) / 100;
      const expRatio = 0.62 + ((idx % 7) * 0.012);
      const footfallWeight =
        (isFlagship ? 1.45 : 0.82) + ((idx * 13) % 40) / 100;
      const emiWeight =
        (isFlagship ? 1.65 : 0.8) + ((idx * 19) % 50) / 100;

      rawList.push({
        idx,
        city,
        state: CITY_STATE_MAP[city],
        area,
        revWeight,
        expRatio,
        footfallWeight,
        emiWeight,
      });
      idx += 1;
    });
  });

  // Exact pan-India totals matching executive KPIs across 104 branches:
  // Monthly Gross Sales: ₹4.82 Cr (48,200,000)
  // Operational Expenses: ₹3.18 Cr (31,800,000)
  // Net Profit: ₹1.64 Cr (16,400,000)
  // Total Patient Footfall: 18,450
  // EMI-Financed Volume: ₹1.12 Cr (11,200,000)
  const revenues = distributeToTarget(
    rawList.map((r) => r.revWeight),
    48_200_000
  );
  const rawExpWeights = rawList.map((r, i) => revenues[i] * r.expRatio);
  const expensesList = distributeToTarget(rawExpWeights, 31_800_000);
  const footfalls = distributeToTarget(
    rawList.map((r) => r.footfallWeight),
    18_450
  );
  const emiVolumes = distributeToTarget(
    rawList.map((r) => r.emiWeight),
    11_200_000
  );

  return rawList.map((item, i) => {
    const num = String(item.idx).padStart(3, "0");
    const monthlyRevenue = revenues[i];
    const expenses = expensesList[i];
    const netProfit = monthlyRevenue - expenses;
    const status: Branch["status"] =
      item.idx % 19 === 0
        ? "Onboarding"
        : item.idx % 7 === 0
        ? "Audited"
        : "Active";
    const { checklist, score } = buildComplianceChecklist(item.idx);
    const stdPrefix =
      item.city === "Mumbai"
        ? "022"
        : item.city === "Delhi"
        ? "011"
        : item.city === "Bengaluru"
        ? "080"
        : item.city === "Pune"
        ? "020"
        : "079";

    return {
      id: `br-${num}`,
      code: `DBN-${item.city.slice(0, 3).toUpperCase()}-${num}`,
      name: `DentAI Pro — ${item.area}`,
      city: item.city,
      state: item.state,
      area: item.area,
      address: `Shop ${10 + (item.idx % 40)}, Ground Floor, ${item.area} Main High Street, ${item.city}`,
      phone: `+91 ${stdPrefix} 48${String(10 + (item.idx % 89))} ${String(
        2100 + item.idx * 17
      )}`,
      manager: MANAGER_NAMES[(item.idx + i) % MANAGER_NAMES.length],
      leadDentist: DENTIST_NAMES[(item.idx + i) % DENTIST_NAMES.length],
      chairs: 3 + (item.idx % 5),
      monthlyRevenue,
      expenses,
      netProfit,
      monthlyTarget: Math.round(monthlyRevenue * 0.94),
      patientCount: footfalls[i],
      emiVolume: emiVolumes[i],
      royaltyRate: item.idx <= 10 ? 10 : 12,
      rating: Number((4.5 + ((item.idx % 5) * 0.1)).toFixed(1)),
      aiAdoptionRate: 76 + ((item.idx * 7) % 23),
      complianceScore: score,
      complianceChecklist: checklist,
      status,
    };
  });
}

export const INITIAL_BRANCHES: Branch[] = generateBranches(); // 104 branches

export const HQ_MONTHLY_BI_SERIES = [
  { month: "Jun", sales: 3.92, expenses: 2.68, profit: 1.24 },
  { month: "Jul", sales: 4.15, expenses: 2.81, profit: 1.34 },
  { month: "Aug", sales: 4.31, expenses: 2.9, profit: 1.41 },
  { month: "Sep", sales: 4.48, expenses: 2.98, profit: 1.5 },
  { month: "Oct", sales: 4.65, expenses: 3.09, profit: 1.56 },
  { month: "Nov", sales: 4.82, expenses: 3.18, profit: 1.64 },
];

export const TREATMENT_REVENUE_BREAKDOWN = [
  { name: "Root Canal + Crown", value: 1.88, margin: "42%", color: "#2563EB" },
  { name: "Dental Implants", value: 1.35, margin: "48%", color: "#4F46E5" },
  { name: "Clear Aligners", value: 0.92, margin: "36%", color: "#10B981" },
  { name: "General & Preventive", value: 0.67, margin: "28%", color: "#94A3B8" },
];

function createTenStepChecklist(completedUpTo: number): OnboardingChecklistItem[] {
  const steps: Array<{
    title: string;
    category: OnboardingChecklistItem["category"];
  }> = [
    { title: "Franchise Agreement Signed & Fee Cleared", category: "Legal & KYC" },
    { title: "Dentist KYC, PAN & Dental Council Verification", category: "Legal & KYC" },
    { title: "Commercial Lease & Floorplan Approved", category: "Legal & KYC" },
    { title: "Clinic Interiors & Chair Plumbing Complete", category: "Civil & Interiors" },
    { title: "Lead-Lined Electrical & Radiation Shielding", category: "Civil & Interiors" },
    { title: "Dental Chairs, RVG & Class-B Autoclave Installed", category: "Equipment & AI" },
    { title: "DentAI ERP & Vision X-Ray AI Provisioned", category: "Equipment & AI" },
    { title: "Front-Desk & Dental Assistant SOP Trained", category: "Equipment & AI" },
    { title: "AERB & Biomedical Waste Statutory Approvals", category: "Go-Live" },
    { title: "Local Launch Campaign & Clinical Go-Live", category: "Go-Live" },
  ];

  return steps.map((s, idx) => ({
    id: `step-${idx + 1}`,
    step: idx + 1,
    title: s.title,
    category: s.category,
    completed: idx < completedUpTo,
  }));
}

export const INITIAL_ONBOARDING_PIPELINE: OnboardingFranchisee[] = [
  {
    id: "onb-01",
    applicantName: "Dr. Siddharth Deshpande",
    proposedBranch: "DentAI Pro — Thane West",
    city: "Mumbai",
    state: "Maharashtra",
    stage: "Ready for Go-Live",
    targetLaunchDate: "2026-12-02",
    investmentCommitted: 4500000,
    checklist: createTenStepChecklist(9),
  },
  {
    id: "onb-02",
    applicantName: "Dr. Niharika Sharma",
    proposedBranch: "DentAI Pro — Gurugram CyberHub",
    city: "Delhi",
    state: "Delhi NCR",
    stage: "Equipment & Training",
    targetLaunchDate: "2026-12-14",
    investmentCommitted: 5200000,
    checklist: createTenStepChecklist(7),
  },
  {
    id: "onb-03",
    applicantName: "Dr. Karthik Gowda",
    proposedBranch: "DentAI Pro — Koramangala 80ft Rd",
    city: "Bengaluru",
    state: "Karnataka",
    stage: "Fit-Out",
    targetLaunchDate: "2027-01-05",
    investmentCommitted: 4800000,
    checklist: createTenStepChecklist(4),
  },
  {
    id: "onb-04",
    applicantName: "Dr. Aarti Parekh",
    proposedBranch: "DentAI Pro — Sindhu Bhavan Ext",
    city: "Ahmedabad",
    state: "Gujarat",
    stage: "Agreement",
    targetLaunchDate: "2027-01-22",
    investmentCommitted: 4200000,
    checklist: createTenStepChecklist(2),
  },
  {
    id: "onb-05",
    applicantName: "Dr. Pranav Kulkarni",
    proposedBranch: "DentAI Pro — Balewadi High Street",
    city: "Pune",
    state: "Maharashtra",
    stage: "Equipment & Training",
    targetLaunchDate: "2026-12-19",
    investmentCommitted: 4600000,
    checklist: createTenStepChecklist(6),
  },
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: "eq-01",
    branchId: "br-001",
    branchName: "DentAI Pro — Bandra West",
    city: "Mumbai",
    type: "Dental Chair",
    model: "Planmeca Sovereign Classic",
    serialNumber: "PLM-MUM-99412",
    installedDate: "2025-03-14",
    warrantyExpiry: "2028-03-14",
    maintenanceStatus: "Operational",
  },
  {
    id: "eq-02",
    branchId: "br-001",
    branchName: "DentAI Pro — Bandra West",
    city: "Mumbai",
    type: "RVG X-Ray",
    model: "Carestream RVG 6200 HD",
    serialNumber: "CS-RVG-44109",
    installedDate: "2025-03-18",
    warrantyExpiry: "2027-03-18",
    maintenanceStatus: "Operational",
  },
  {
    id: "eq-03",
    branchId: "br-025",
    branchName: "DentAI Pro — Connaught Place",
    city: "Delhi",
    type: "Class-B Autoclave",
    model: "W&H Lisa 22L Vacuum",
    serialNumber: "WH-DEL-78214",
    installedDate: "2024-11-05",
    warrantyExpiry: "2026-12-20",
    maintenanceStatus: "Due Soon",
  },
  {
    id: "eq-04",
    branchId: "br-047",
    branchName: "DentAI Pro — Indiranagar",
    city: "Bengaluru",
    type: "CBCT Scanner",
    model: "Vatech Pax-i3D Smart",
    serialNumber: "VT-BLR-31902",
    installedDate: "2025-06-21",
    warrantyExpiry: "2028-06-21",
    maintenanceStatus: "Operational",
  },
  {
    id: "eq-05",
    branchId: "br-067",
    branchName: "DentAI Pro — Koregaon Park",
    city: "Pune",
    type: "Dental Chair",
    model: "Sirona Intego Pro",
    serialNumber: "SRN-PUN-60211",
    installedDate: "2024-08-12",
    warrantyExpiry: "2027-08-12",
    maintenanceStatus: "Under Service",
  },
  {
    id: "eq-06",
    branchId: "br-086",
    branchName: "DentAI Pro — Satellite",
    city: "Ahmedabad",
    type: "Class-B Autoclave",
    model: "Euronda E10 24L",
    serialNumber: "EUR-AMD-51084",
    installedDate: "2025-09-02",
    warrantyExpiry: "2028-09-02",
    maintenanceStatus: "Operational",
  },
];

export const INITIAL_PROPERTIES: PropertyListing[] = [
  {
    id: "prop-01",
    title: "Pali Hill Corner Retail — Ground Floor",
    address: "Plot 18, Pali Naka Junction, Bandra West, Mumbai 400050",
    city: "Mumbai",
    state: "Maharashtra",
    carpetAreaSqFt: 1650,
    monthlyRent: 285000,
    footfallScore: 95,
    nearbyAnchor: "120m from Linking Rd • High HNI Residential",
    mapPinTag: "19.0607° N, 72.8362° E • Corner High-Street",
    photoLabel: "Glass Facade • 45ft Frontage",
    imageUrl: "/images/properties/prop-01.png",
    status: "Shortlisted",
  },
  {
    id: "prop-02",
    title: "100ft Road Commercial Plaza Unit 2",
    address: "412, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    city: "Bengaluru",
    state: "Karnataka",
    carpetAreaSqFt: 1850,
    monthlyRent: 240000,
    footfallScore: 93,
    nearbyAnchor: "250m from Indiranagar Metro • Tech Crowd",
    mapPinTag: "12.9784° N, 77.6408° E • Metro Corridor",
    photoLabel: "Dual Entry • Dedicated Parking",
    imageUrl: "/images/properties/prop-02.png",
    status: "Site Visit Scheduled",
    siteVisitDate: "2026-11-29",
  },
  {
    id: "prop-03",
    title: "Greater Kailash M-Block Avenue",
    address: "M-24, Ground & Mezzanine, GK-1 Market, New Delhi 110048",
    city: "Delhi",
    state: "Delhi NCR",
    carpetAreaSqFt: 1480,
    monthlyRent: 310000,
    footfallScore: 91,
    nearbyAnchor: "Opposite M-Block Central Plaza",
    mapPinTag: "28.5503° N, 77.2345° E • Premium Market",
    photoLabel: "Ready HVAC • 3-Phase Power",
    imageUrl: "/images/properties/prop-03.png",
    status: "Under Review",
  },
  {
    id: "prop-04",
    title: "Baner Balewadi High Street Arcade",
    address: "Unit G-07, Cummins Complex, Baner, Pune 411045",
    city: "Pune",
    state: "Maharashtra",
    carpetAreaSqFt: 1720,
    monthlyRent: 155000,
    footfallScore: 88,
    nearbyAnchor: "Adjacent to IT Parks & Corporate Towers",
    mapPinTag: "18.5642° N, 73.7769° E • Corporate Hub",
    photoLabel: "Wheelchair Ramp • Ground Floor",
    imageUrl: "/images/properties/prop-04.png",
    status: "Approved",
  },
  {
    id: "prop-05",
    title: "Sindhu Bhavan Road Signature Bay",
    address: "S-12, Mondeal Retail Park, Bodakdev, Ahmedabad 380054",
    city: "Ahmedabad",
    state: "Gujarat",
    carpetAreaSqFt: 1950,
    monthlyRent: 135000,
    footfallScore: 86,
    nearbyAnchor: "SBR Dining & Luxury Retail Belt",
    mapPinTag: "23.0419° N, 72.5071° E • SBR Boulevard",
    photoLabel: "Bare Shell • 5-Chair Capacity",
    imageUrl: "/images/properties/prop-05.png",
    status: "Under Review",
  },
];

export const INITIAL_MARKETING_TEMPLATES: MarketingTemplate[] = [
  {
    id: "mkt-01",
    title: "Single-Sitting Painless RCT + Crown",
    campaignType: "Root Canal + Crown",
    headline: "Pain-Free Single-Sitting Root Canal & Zirconia Crown",
    subheadline:
      "AI-verified precision endodontics with 0% No-Cost EMI starting ₹8,333/mo",
    offerBadge: "FREE AI RVG SCAN WORTH ₹1,500",
    accentTone: "teal",
  },
  {
    id: "mkt-02",
    title: "Swiss Titanium Implant Fest",
    campaignType: "Dental Implants",
    headline: "Permanent Teeth in 72 Hours — Swiss Straumann Implants",
    subheadline:
      "3D CBCT guided placement by MDS Implantologists. Lifetime warranty included.",
    offerBadge: "0% EMI UP TO 18 MONTHS",
    accentTone: "navy",
  },
  {
    id: "mkt-03",
    title: "Invisible Clear Aligner Smile",
    campaignType: "Clear Aligners",
    headline: "Design Your Confident Smile with 3D AI Aligner Simulation",
    subheadline:
      "Preview your final smile in 60 seconds before starting treatment.",
    offerBadge: "FLAT ₹15,000 OFF THIS MONTH",
    accentTone: "emerald",
  },
];

export const INITIAL_ROYALTY_TRANSACTIONS: RoyaltyTransaction[] = [
  {
    id: "roy-01",
    txnRef: "TXN-UPI-994021",
    date: "2026-11-25 14:20 IST",
    branchId: "br-001",
    branchName: "DentAI Pro — Bandra West",
    patientName: "Aarav Sharma",
    treatment: "Root Canal + Zirconia Crown",
    paymentMode: "0% EMI",
    grossAmount: 100000,
    gatewayFee: 1200,
    royaltyPercent: 10,
    hqShare: 10000,
    franchiseeShare: 88800,
    settlementStatus: "Pending Split",
  },
  {
    id: "roy-02",
    txnRef: "TXN-CRD-994018",
    date: "2026-11-25 12:05 IST",
    branchId: "br-025",
    branchName: "DentAI Pro — Connaught Place",
    patientName: "Priya Nair",
    treatment: "Straumann Titanium Implant",
    paymentMode: "Card",
    grossAmount: 145000,
    gatewayFee: 2175,
    royaltyPercent: 12,
    hqShare: 17400,
    franchiseeShare: 125425,
    settlementStatus: "Settled",
  },
  {
    id: "roy-03",
    txnRef: "TXN-UPI-994012",
    date: "2026-11-25 10:45 IST",
    branchId: "br-047",
    branchName: "DentAI Pro — Indiranagar",
    patientName: "Ananya Krishnan",
    treatment: "Laser Whitening & Prophylaxis",
    paymentMode: "UPI",
    grossAmount: 18500,
    gatewayFee: 0,
    royaltyPercent: 12,
    hqShare: 2220,
    franchiseeShare: 16280,
    settlementStatus: "Settled",
  },
  {
    id: "roy-04",
    txnRef: "TXN-EMI-994004",
    date: "2026-11-24 18:10 IST",
    branchId: "br-067",
    branchName: "DentAI Pro — Koregaon Park",
    patientName: "Rohan Deshpande",
    treatment: "Invisalign Clear Aligner",
    paymentMode: "0% EMI",
    grossAmount: 65000,
    gatewayFee: 780,
    royaltyPercent: 12,
    hqShare: 7800,
    franchiseeShare: 56420,
    settlementStatus: "In Escrow",
  },
  {
    id: "roy-05",
    txnRef: "TXN-UPI-993998",
    date: "2026-11-24 16:35 IST",
    branchId: "br-002",
    branchName: "DentAI Pro — Kurla West",
    patientName: "Snehalata Kulkarni",
    treatment: "Root Canal + E-Max Crown",
    paymentMode: "UPI",
    grossAmount: 100000,
    gatewayFee: 0,
    royaltyPercent: 10,
    hqShare: 10000,
    franchiseeShare: 90000,
    settlementStatus: "Pending Split",
  },
];

const ALL_FDI_TEETH = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41,
  31, 32, 33, 34, 35, 36, 37, 38,
];

function buildToothChart(
  overrides: Partial<Record<number, ToothCondition>>
): Record<number, ToothCondition> {
  const chart: Record<number, ToothCondition> = {};
  ALL_FDI_TEETH.forEach((t) => {
    chart[t] = overrides[t] ?? "Healthy";
  });
  return chart;
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-101",
    name: "Aarav Sharma",
    phone: "+91 98204 51120",
    email: "aarav.sharma@gmail.com",
    age: 34,
    gender: "M",
    city: "Mumbai",
    branchId: "br-001",
    branchName: "DentAI Pro — Bandra West",
    lastVisit: "2026-11-22",
    segment: "VIP",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: true,
      marketing: true,
      financing: true,
      updatedAt: "2026-11-22 10:15 IST",
    },
    activeTreatment: "Root Canal + Zirconia Crown (Tooth #36)",
    outstandingBalance: 100000,
    loyaltyPoints: 2450,
    allergies: ["Penicillin (Rash)", "Sulfonamides"],
    medicalHistory: ["Mild Hypertension (Amlodipine 5mg)", "No Bleeding Disorder"],
    toothChart: buildToothChart({ 36: "Root Canal Needed", 14: "Cavity", 46: "Crown" }),
    treatmentPlan: [
      {
        id: "tp-101-1",
        toothNumber: 36,
        procedure: "Single-Sitting Rotary Root Canal + Zirconia Crown",
        cost: 100000,
        status: "In Progress",
      },
      {
        id: "tp-101-2",
        toothNumber: 14,
        procedure: "BajajDent Nano-Hybrid Composite Filling",
        cost: 4500,
        status: "Proposed",
      },
    ],
    visitHistory: [
      {
        id: "vh-1",
        date: "2026-11-22",
        branchName: "DentAI Pro — Bandra West",
        procedure: "CBCT + AI RVG Screening (#36)",
        doctor: "Dr. Meera Deshmukh",
        amount: 2500,
      },
      {
        id: "vh-2",
        date: "2026-05-14",
        branchName: "DentAI Pro — Bandra West",
        procedure: "Ultrasonic Scaling & Polishing",
        doctor: "Dr. Meera Deshmukh",
        amount: 2200,
      },
      {
        id: "vh-3",
        date: "2025-11-08",
        branchName: "DentAI Pro — Bandra West",
        procedure: "Zirconia Crown Cementation (#46)",
        doctor: "Dr. Rohan Kapoor",
        amount: 35000,
      },
    ],
  },
  {
    id: "pat-102",
    name: "Priya Nair",
    phone: "+91 98112 78431",
    email: "priya.nair@outlook.com",
    age: 41,
    gender: "F",
    city: "Delhi",
    branchId: "br-025",
    branchName: "DentAI Pro — Connaught Place",
    lastVisit: "2026-11-20",
    segment: "Implant Lead",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: true,
      marketing: false,
      financing: true,
      updatedAt: "2026-11-20 14:40 IST",
    },
    activeTreatment: "Straumann Titanium Implant + Sinus Lift",
    outstandingBalance: 145000,
    loyaltyPoints: 1800,
    allergies: ["Latex (Contact Sensitivity)"],
    medicalHistory: ["Type 2 Diabetes (HbA1c 6.4% Controlled)", "Thyroid (Thyronorm 50mcg)"],
    toothChart: buildToothChart({ 46: "Extracted", 26: "Crown" }),
    treatmentPlan: [
      {
        id: "tp-102-1",
        toothNumber: 46,
        procedure: "Straumann Titanium Implant + Sinus Lift",
        cost: 145000,
        status: "In Progress",
      },
    ],
    visitHistory: [
      {
        id: "vh-4",
        date: "2026-11-20",
        branchName: "DentAI Pro — Connaught Place",
        procedure: "3D CBCT Surgical Stent Planning",
        doctor: "Dr. Kabir Malhotra",
        amount: 4500,
      },
    ],
  },
  {
    id: "pat-103",
    name: "Rohan Deshpande",
    phone: "+91 97654 22109",
    email: "rohan.d@yahoo.co.in",
    age: 27,
    gender: "M",
    city: "Pune",
    branchId: "br-067",
    branchName: "DentAI Pro — Koregaon Park",
    lastVisit: "2026-11-18",
    segment: "Ortho Follow-up",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: true,
      marketing: true,
      financing: false,
      updatedAt: "2026-11-18 11:05 IST",
    },
    activeTreatment: "Invisalign Clear Aligner (Stage 14/24)",
    outstandingBalance: 65000,
    loyaltyPoints: 3120,
    allergies: ["None Known"],
    medicalHistory: ["No Systemic Conditions"],
    toothChart: buildToothChart({ 18: "Extracted", 28: "Extracted" }),
    treatmentPlan: [
      {
        id: "tp-103-1",
        procedure: "Invisalign Clear Aligner (Stage 14/24)",
        cost: 65000,
        status: "In Progress",
      },
    ],
    visitHistory: [
      {
        id: "vh-5",
        date: "2026-11-18",
        branchName: "DentAI Pro — Koregaon Park",
        procedure: "Intraoral 3D Scan Aligner Check",
        doctor: "Dr. Sneha Joshi",
        amount: 0,
      },
    ],
  },
  {
    id: "pat-104",
    name: "Ananya Krishnan",
    phone: "+91 99001 44589",
    email: "ananya.k@gmail.com",
    age: 29,
    gender: "F",
    city: "Bengaluru",
    branchId: "br-047",
    branchName: "DentAI Pro — Indiranagar",
    lastVisit: "2026-11-24",
    segment: "Routine",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: true,
      marketing: true,
      financing: true,
      updatedAt: "2026-11-24 16:20 IST",
    },
    activeTreatment: "Ultrasonic Scaling + Laser Whitening",
    outstandingBalance: 18500,
    loyaltyPoints: 940,
    allergies: ["Lidocaine Preservative Free Required"],
    medicalHistory: ["Mild Asthma (Inhaler SOS)"],
    toothChart: buildToothChart({ 11: "Healthy", 21: "Healthy" }),
    treatmentPlan: [
      {
        id: "tp-104-1",
        procedure: "Laser Whitening & Prophylaxis Package",
        cost: 18500,
        status: "Proposed",
      },
    ],
    visitHistory: [
      {
        id: "vh-6",
        date: "2026-11-24",
        branchName: "DentAI Pro — Indiranagar",
        procedure: "Shade A3 Digital Smile Consultation",
        doctor: "Dr. Ananya Iyer",
        amount: 800,
      },
    ],
  },
  {
    id: "pat-105",
    name: "Karanveer Mehta",
    phone: "+91 98250 91234",
    email: "karan.mehta@gmail.com",
    age: 52,
    gender: "M",
    city: "Ahmedabad",
    branchId: "br-086",
    branchName: "DentAI Pro — Satellite",
    lastVisit: "2026-06-14",
    segment: "Lapsed",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: false,
      marketing: false,
      financing: false,
      updatedAt: "2026-06-14 09:30 IST",
    },
    activeTreatment: "Full Mouth Rehabilitation Consult",
    outstandingBalance: 0,
    loyaltyPoints: 620,
    allergies: ["Aspirin / NSAID Sensitivity"],
    medicalHistory: ["Coronary Stent (2022) — On Clopidogrel"],
    toothChart: buildToothChart({ 16: "Extracted", 36: "Extracted", 25: "Root Canal Needed" }),
    treatmentPlan: [
      {
        id: "tp-105-1",
        toothNumber: 25,
        procedure: "Root Canal + Crown (#25)",
        cost: 42000,
        status: "Proposed",
      },
    ],
    visitHistory: [
      {
        id: "vh-7",
        date: "2026-06-14",
        branchName: "DentAI Pro — Satellite",
        procedure: "OPG Full Mouth Evaluation",
        doctor: "Dr. Priya Patel",
        amount: 1500,
      },
    ],
  },
  {
    id: "pat-106",
    name: "Snehalata Kulkarni",
    phone: "+91 98201 33490",
    email: "snehalata.k@gmail.com",
    age: 38,
    gender: "F",
    city: "Mumbai",
    branchId: "br-002",
    branchName: "DentAI Pro — Kurla West",
    lastVisit: "2026-11-25",
    segment: "VIP",
    dpdpConsent: {
      treatment: true,
      aiDiagnostics: true,
      marketing: true,
      financing: true,
      updatedAt: "2026-11-25 11:10 IST",
    },
    activeTreatment: "Root Canal + E-Max Crown (Tooth #14)",
    outstandingBalance: 100000,
    loyaltyPoints: 4100,
    allergies: ["None Known"],
    medicalHistory: ["Gestational Diabetes History (Resolved)"],
    toothChart: buildToothChart({ 14: "Root Canal Needed", 37: "Crown" }),
    treatmentPlan: [
      {
        id: "tp-106-1",
        toothNumber: 14,
        procedure: "Root Canal + E-Max All-Ceramic Crown",
        cost: 100000,
        status: "In Progress",
      },
    ],
    visitHistory: [
      {
        id: "vh-8",
        date: "2026-11-25",
        branchName: "DentAI Pro — Kurla West",
        procedure: "Apex Locator Working Length & BMP",
        doctor: "Dr. Rohan Kapoor",
        amount: 15000,
      },
    ],
  },
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: "vis-01",
    patientId: "pat-101",
    patientName: "Aarav Sharma",
    branchId: "br-001",
    doctorName: "Dr. Meera Deshmukh",
    date: "2026-11-25",
    time: "10:30 AM",
    chair: "Chair 1",
    treatment: "Root Canal + Zirconia Crown",
    estimatedAmount: 100000,
    status: "AI Scan Ready",
    aiNotes:
      "CBCT + RVG AI detected periapical radiolucency (3.2mm) at distal root of #36. Recommend single-sitting rotary RCT + monolithic Zirconia crown.",
    xrayFindings: "Periapical lesion #36 | 97.4% AI confidence",
  },
  {
    id: "vis-02",
    patientId: "pat-106",
    patientName: "Snehalata Kulkarni",
    branchId: "br-002",
    doctorName: "Dr. Rohan Kapoor",
    date: "2026-11-25",
    time: "11:15 AM",
    chair: "Chair 2",
    treatment: "Root Canal + E-Max Crown",
    estimatedAmount: 100000,
    status: "In-Chair",
    aiNotes:
      "Mesial caries proximity to pulp horn on #14. Apex locator calibrated; obturation ready.",
    xrayFindings: "Deep occlusal caries #14 | 94.8% AI confidence",
  },
  {
    id: "vis-03",
    patientId: "pat-104",
    patientName: "Ananya Krishnan",
    branchId: "br-047",
    doctorName: "Dr. Ananya Iyer",
    date: "2026-11-25",
    time: "12:00 PM",
    chair: "Chair 1",
    treatment: "Laser Whitening & Prophylaxis",
    estimatedAmount: 18500,
    status: "Checked-In",
    aiNotes:
      "Shade A3 baseline recorded via intraoral camera. No active carious lesions detected.",
    xrayFindings: "Healthy bone crest | 99.1% AI confidence",
  },
  {
    id: "vis-04",
    patientId: "pat-102",
    patientName: "Priya Nair",
    branchId: "br-025",
    doctorName: "Dr. Kabir Malhotra",
    date: "2026-11-25",
    time: "02:30 PM",
    chair: "Chair 3",
    treatment: "Straumann Implant Placement",
    estimatedAmount: 145000,
    status: "Scheduled",
    aiNotes:
      "3D CBCT bone density D2 (720 HU) in #46 region. Surgical stent printed.",
    xrayFindings: "11.4mm vertical bone height | 98.2% AI confidence",
  },
  {
    id: "vis-05",
    patientId: "pat-103",
    patientName: "Rohan Deshpande",
    branchId: "br-001",
    doctorName: "Dr. Meera Deshmukh",
    date: "2026-11-25",
    time: "09:30 AM",
    chair: "Chair 1",
    treatment: "Aligner Attachment Check",
    estimatedAmount: 6500,
    status: "Completed",
    aiNotes: "Aligner tracking 98% accurate on upper arch.",
    xrayFindings: "Normal periodontal ligament space",
  },
  {
    id: "vis-06",
    patientId: "pat-105",
    patientName: "Karanveer Mehta",
    branchId: "br-001",
    doctorName: "Dr. Meera Deshmukh",
    date: "2026-11-26",
    time: "11:15 AM",
    chair: "Chair 2",
    treatment: "Full Mouth Rehab Consult",
    estimatedAmount: 42000,
    status: "Scheduled",
    aiNotes: "Cardiology clearance verified for Clopidogrel protocol.",
    xrayFindings: "Secondary caries #25 | 95.1% AI confidence",
  },
];

export const INITIAL_REFERRALS: SpecialistReferral[] = [
  {
    id: "ref-01",
    referralCode: "REF-2026-409",
    patientId: "pat-102",
    patientName: "Priya Nair",
    fromBranch: "DentAI Pro — Bandra West",
    fromDoctor: "Dr. Meera Deshmukh",
    specialty: "Oral Surgeon",
    targetSpecialist: "Dr. Vikramaditya Sen (MDS OMFS)",
    targetBranch: "DentAI Pro — Lower Parel Surgical Hub",
    caseNotes:
      "Sinus lift + Straumann 4.1x10mm implant placement #46. 3D CBCT & surgical stent attached.",
    xrayAttached: true,
    estimatedValue: 145000,
    referralSharePercent: 15,
    status: "Accepted",
    createdAt: "2026-11-24 16:20 IST",
  },
  {
    id: "ref-02",
    referralCode: "REF-2026-405",
    patientId: "pat-103",
    patientName: "Rohan Deshpande",
    fromBranch: "DentAI Pro — Kurla West",
    fromDoctor: "Dr. Rohan Kapoor",
    specialty: "Orthodontist",
    targetSpecialist: "Dr. Sneha Joshi (MDS Ortho)",
    targetBranch: "DentAI Pro — Koregaon Park",
    caseNotes:
      "Complex Class II deep bite correction requiring Invisalign IPR & mid-course refinement.",
    xrayAttached: true,
    estimatedValue: 65000,
    referralSharePercent: 12,
    status: "Consultation Done",
    createdAt: "2026-11-22 11:00 IST",
  },
  {
    id: "ref-03",
    referralCode: "REF-2026-398",
    patientId: "pat-106",
    patientName: "Snehalata Kulkarni",
    fromBranch: "DentAI Pro — Powai",
    fromDoctor: "Dr. Arjun Rao",
    specialty: "Endodontist",
    targetSpecialist: "Dr. Meera Deshmukh (MDS Endo)",
    targetBranch: "DentAI Pro — Bandra West",
    caseNotes:
      "Calcified MB2 canal retreatment under microscope + monolithic crown.",
    xrayAttached: true,
    estimatedValue: 100000,
    referralSharePercent: 15,
    status: "Completed",
    createdAt: "2026-11-18 14:15 IST",
  },
];

export const INITIAL_PRESCRIPTIONS: Record<string, PrescriptionRecord> = {
  "pat-101": {
    id: "rx-101",
    patientId: "pat-101",
    medicines: [
      {
        name: "Tab. Clindamycin 300mg (Penicillin-Safe)",
        dosage: "1-0-1 After Food",
        duration: "5 Days",
      },
      {
        name: "Tab. Aceclofenac 100mg + Paracetamol 325mg",
        dosage: "1-0-1 SOS Pain",
        duration: "3 Days",
      },
      {
        name: "Cap. Pantoprazole 40mg",
        dosage: "1-0-0 Before Breakfast",
        duration: "5 Days",
      },
    ],
    d2cSelfCareKit: [
      "BajajDent Nano-Hydroxyapatite Sensitivity Toothpaste",
      "BajajSteril Chlorhexidine 0.2% Alcohol-Free Mouthwash",
      "Ultra-Soft Post-RCT Bamboo Recovery Brush",
    ],
    advice:
      "Avoid chewing hard foods on lower left (#36) until permanent Zirconia crown cementation.",
    generatedAt: "2026-11-25 10:40 IST",
  },
};

export const INITIAL_INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: "ins-01",
    insurer: "Bajaj Allianz Health",
    planName: "Smile Shield Essential",
    coverageAmount: 75000,
    annualPremium: 2499,
    waitingPeriod: "Zero Waiting (Preventive)",
    highlights: [
      "Covers 2x Scaling + AI X-Rays/yr",
      "Up to ₹35,000 Root Canal Cover",
      "Cashless across 104 DentAI Clinics",
    ],
  },
  {
    id: "ins-02",
    insurer: "HDFC Ergo Care",
    planName: "Dental Care Pro Plus",
    coverageAmount: 150000,
    annualPremium: 4899,
    waitingPeriod: "30 Days Major Dental",
    highlights: [
      "Covers RCT + Zirconia Crown up to ₹1L",
      "50% Implant & Aligner Co-Pay",
      "Instant Digital Claim via PWA Vault",
    ],
  },
  {
    id: "ins-03",
    insurer: "Care Health",
    planName: "ToothGuard Family Floater",
    coverageAmount: 250000,
    annualPremium: 7200,
    waitingPeriod: "Zero Waiting Accident",
    highlights: [
      "Covers 4 Family Members",
      "Unlimited Emergency Consults",
      "100% Cashless Endodontics",
    ],
  },
];

export const INITIAL_PURCHASED_POLICIES: PurchasedPolicy[] = [
  {
    id: "pol-01",
    policyNumber: "DBN-INS-88412",
    planName: "Smile Shield Essential",
    insurer: "Bajaj Allianz Health",
    coverageAmount: 75000,
    annualPremium: 2499,
    validUntil: "2027-11-24",
    status: "Active",
  },
];

export const INITIAL_INSURANCE_CLAIMS: InsuranceClaim[] = [
  {
    id: "clm-01",
    claimNumber: "CLM-2026-309",
    policyNumber: "DBN-INS-88412",
    invoiceRef: "INV-2025-1108",
    procedure: "Zirconia Crown Cementation (#46)",
    claimAmount: 35000,
    attachments: ["Tax_Invoice_1108.pdf", "OPG_XRay_46.dcm"],
    status: "Under Review",
    submittedAt: "2026-11-21 15:10 IST",
  },
];

export const INITIAL_D2C_PRODUCTS: D2CProduct[] = [
  {
    id: "d2c-01",
    name: "BajajDent Nano-Hydroxyapatite Sensitivity Paste",
    category: "Toothpaste",
    price: 399,
    mrp: 549,
    tag: "Rx Prescribed",
    isPrescribedKit: true,
    description: "Enamel-rebuilding toothpaste formulated for post-RCT care.",
  },
  {
    id: "d2c-02",
    name: "BajajSteril Chlorhexidine 0.2% Mouthwash",
    category: "Prescribed Pharma",
    price: 249,
    mrp: 320,
    tag: "Rx Prescribed",
    isPrescribedKit: true,
    description: "Alcohol-free antimicrobial rinse for gum & root canal healing.",
  },
  {
    id: "d2c-03",
    name: "Post-RCT Ultra-Soft Bamboo Recovery Kit",
    category: "Caring Kit",
    price: 599,
    mrp: 850,
    tag: "Rx Prescribed",
    isPrescribedKit: true,
    description: "Ultra-soft surgical brush + interdental picks + travel case.",
  },
  {
    id: "d2c-04",
    name: "SonicPulse Cordless Water Flosser Pro",
    category: "Cleaning Kit",
    price: 2499,
    mrp: 3499,
    tag: "Bestseller",
    description: "300ml IPX7 water flosser ideal for crowns, implants & aligners.",
  },
  {
    id: "d2c-05",
    name: "DentAI Pro Aligner & Retainer Cleaning Foam",
    category: "Cleaning Kit",
    price: 499,
    mrp: 699,
    description: "Kills 99.9% odor bacteria on clear aligners without scrubbing.",
  },
  {
    id: "d2c-06",
    name: "Oradent Xylitol Gum & Enamel Care Pack",
    category: "Prescribed Pharma",
    price: 349,
    mrp: 450,
    description: "pH-balancing sugar-free xylitol care recommended after meals.",
  },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-01",
    author: "Dr. Ajay Bajaj",
    roleBadge: "CMD & Chief Endodontist",
    verifiedDoctor: true,
    title: "Why Single-Sitting Rotary RCT + Zirconia Crown Lasts 15+ Years",
    body: "With AI-guided apex localization and 3D CAD/CAM Zirconia crowns, modern root canal therapy is painless and completed in one 45-minute visit.",
    likes: 142,
    comments: [
      {
        id: "cmt-1",
        author: "Aarav Sharma",
        text: "Had my #36 scan done at Bandra West — seeing the AI X-ray made it super clear!",
        time: "2h ago",
      },
    ],
    timestamp: "3 hours ago",
  },
  {
    id: "post-02",
    author: "Dr. Meera Deshmukh",
    roleBadge: "MDS Endodontist • Bandra West",
    verifiedDoctor: true,
    title: "5 Post-RCT Recovery Rules for the First 72 Hours",
    body: "Avoid biting hard nuts on the treated side until your permanent crown is placed, use lukewarm saltwater rinses, and finish your prescribed course.",
    likes: 89,
    comments: [],
    timestamp: "1 day ago",
  },
];

export const INITIAL_AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: "aut-01",
    ruleName: "Post-Visit Auto-PDF Delivery",
    channel: "WhatsApp",
    recipient: "Aarav Sharma (+91 98204 51120)",
    summary: "Sent Tax Invoice ₹1,00,000 + Digital Rx + Care Guide",
    timestamp: "2026-11-25 10:45 IST",
    status: "Read",
  },
  {
    id: "aut-02",
    ruleName: "24h Reminder",
    channel: "SMS",
    recipient: "Karanveer Mehta (+91 98250 91234)",
    summary: "Opted out of promotional reminders — clinical alert only",
    timestamp: "2026-11-25 09:30 IST",
    status: "Suppressed (DPDP)",
  },
  {
    id: "aut-03",
    ruleName: "Booking Confirmation",
    channel: "WhatsApp",
    recipient: "Priya Nair (+91 98112 78431)",
    summary: "Confirmed 02:30 PM Implant OT at Connaught Place",
    timestamp: "2026-11-25 08:15 IST",
    status: "Delivered",
  },
  {
    id: "aut-04",
    ruleName: "No-Show Recovery",
    channel: "Email",
    recipient: "Rohan Deshpande (rohan.d@yahoo.co.in)",
    summary: "1-click self-reschedule link for Aligner Stage 14 check",
    timestamp: "2026-11-24 18:40 IST",
    status: "Read",
  },
];

export const INITIAL_CAMP_LEADS: CampLead[] = [
  {
    id: "lead-01",
    campId: "camp-01",
    campTitle: "Cipla Corporate Oral Screening Drive",
    partnerPharma: "Cipla Health",
    name: "Siddharth Rao",
    phone: "+91 98209 44112",
    dentalIssue: "Molar Toothache / RCT Eval",
    assignedBranch: "DentAI Pro — Bandra West",
    dpdpConsentGranted: true,
    voucherCode: "CIPLA-RVG-901",
    status: "Visit Booked",
    registeredAt: "2026-11-25 11:20 IST",
  },
  {
    id: "lead-02",
    campId: "camp-01",
    campTitle: "Cipla Corporate Oral Screening Drive",
    partnerPharma: "Cipla Health",
    name: "Nandini Deshmukh",
    phone: "+91 98192 66701",
    dentalIssue: "Scaling & Gum Bleeding",
    assignedBranch: "DentAI Pro — Kurla West",
    dpdpConsentGranted: true,
    voucherCode: "CIPLA-RVG-884",
    status: "Converted",
    registeredAt: "2026-11-25 10:05 IST",
  },
  {
    id: "lead-03",
    campId: "camp-03",
    campTitle: "Infosys Tech Park Preventive Smile Camp",
    partnerPharma: "Dr. Reddy's Oral",
    name: "Vikram Hegde",
    phone: "+91 99002 11845",
    dentalIssue: "Clear Aligner Consultation",
    assignedBranch: "DentAI Pro — Indiranagar",
    dpdpConsentGranted: true,
    voucherCode: "REDDY-SCAN-412",
    status: "Voucher Sent",
    registeredAt: "2026-11-24 17:45 IST",
  },
];

export const INITIAL_SECURITY_LOGS: SecurityAccessLog[] = [
  {
    id: "sec-01",
    timestamp: "2026-11-25 14:15 IST",
    user: "Dr. Meera Deshmukh",
    rbacRole: "Branch Dentist",
    action: "Edited Tooth Chart",
    patientRecord: "Aarav Sharma (pat-101)",
    encryption: "AES-256-GCM",
  },
  {
    id: "sec-02",
    timestamp: "2026-11-25 11:30 IST",
    user: "Bajaj Finserv Health",
    rbacRole: "NBFC Fintech API",
    action: "Pulled KYC",
    patientRecord: "Aarav Sharma (pat-101)",
    encryption: "AES-256-GCM",
  },
  {
    id: "sec-03",
    timestamp: "2026-11-25 10:05 IST",
    user: "Vikram Kulkarni",
    rbacRole: "DPO Officer",
    action: "Exported Audit CSV",
    patientRecord: "Network Consent Ledger",
    encryption: "AES-256-GCM",
  },
  {
    id: "sec-04",
    timestamp: "2026-11-24 18:22 IST",
    user: "Dr. Ajay Bajaj",
    rbacRole: "Franchisor Admin",
    action: "Viewed EDR",
    patientRecord: "Priya Nair (pat-102)",
    encryption: "AES-256-GCM",
  },
];

export const INITIAL_DPDP_TICKETS: DpdpTicket[] = [
  {
    id: "tkt-01",
    ticketNumber: "DPDP-GRV-204",
    patientId: "pat-102",
    patientName: "Priya Nair",
    type: "DPO Grievance",
    details: "Verify promotional SMS opt-out synced across Delhi NCR branches.",
    status: "Resolved",
    createdAt: "2026-11-24 19:20 IST",
  },
  {
    id: "tkt-02",
    ticketNumber: "DPDP-COR-209",
    patientId: "pat-103",
    patientName: "Rohan Deshpande",
    type: "Data Correction",
    details: "Update secondary emergency contact email in Koregaon Park EDR.",
    status: "Open",
    createdAt: "2026-11-25 09:50 IST",
  },
];

export const INITIAL_B2B_CATALOG: CatalogProduct[] = [
  {
    id: "cat-01",
    sku: "DBP-CMP-101",
    name: "BajajDent Nano-Hybrid Composite Syringe Kit (A1/A2/A3)",
    brandLine: "Dr. Bajaj Proprietary",
    category: "Restorative",
    wholesalePrice: 3450,
    mrp: 4800,
    packSize: "4 x 4g Syringes",
    hqStock: 420,
    stockBadge: "High Demand",
  },
  {
    id: "cat-02",
    sku: "DBP-END-204",
    name: "Dr. Bajaj ProEndo Gold Rotary NiTi Files",
    brandLine: "Dr. Bajaj Proprietary",
    category: "Endodontics",
    wholesalePrice: 4200,
    mrp: 5600,
    packSize: "Pack of 6 Files",
    hqStock: 310,
    stockBadge: "In Stock",
  },
  {
    id: "cat-03",
    sku: "DBP-STR-309",
    name: "BajajSteril Enzymatic Autoclave & Ultrasonic Solution",
    brandLine: "Dr. Bajaj Proprietary",
    category: "Sterilization",
    wholesalePrice: 1250,
    mrp: 1800,
    packSize: "5 Litre Canister",
    hqStock: 185,
    stockBadge: "In Stock",
  },
  {
    id: "cat-04",
    sku: "DBP-RST-412",
    name: "BajajBond Universal 8th-Gen Dental Adhesive & Thinner",
    brandLine: "Dr. Bajaj Proprietary",
    category: "Restorative",
    wholesalePrice: 2150,
    mrp: 2950,
    packSize: "5ml Bottle + Applicators",
    hqStock: 64,
    stockBadge: "Low HQ Stock",
  },
  {
    id: "cat-05",
    sku: "PRT-DSP-501",
    name: "Sterile Absorbent Dental Cotton Rolls (100% Pure)",
    brandLine: "Partner Certified",
    category: "Disposables",
    wholesalePrice: 480,
    mrp: 720,
    packSize: "Box of 1,000 Rolls",
    hqStock: 920,
    stockBadge: "In Stock",
  },
  {
    id: "cat-06",
    sku: "PRT-DSP-508",
    name: "Powder-Free Nitrile Examination Gloves (Cobalt Blue)",
    brandLine: "Partner Certified",
    category: "Disposables",
    wholesalePrice: 420,
    mrp: 650,
    packSize: "Box of 100 Gloves",
    hqStock: 1450,
    stockBadge: "High Demand",
  },
  {
    id: "cat-07",
    sku: "PRT-DSP-515",
    name: "2ml Luer-Lock Disposable Dental Syringes & 30G Needles",
    brandLine: "Partner Certified",
    category: "Disposables",
    wholesalePrice: 690,
    mrp: 980,
    packSize: "Box of 100 Sets",
    hqStock: 680,
    stockBadge: "In Stock",
  },
  {
    id: "cat-08",
    sku: "PRT-IMP-602",
    name: "Straumann BLX Titanium Implant Fixture 4.1x10mm",
    brandLine: "Partner Certified",
    category: "Implantology",
    wholesalePrice: 22500,
    mrp: 28000,
    packSize: "Single Sterile Vial",
    hqStock: 48,
    stockBadge: "Low HQ Stock",
  },
];

export const INITIAL_CONSUMABLES: ConsumableItem[] = [
  {
    id: "con-01",
    branchId: "br-001",
    sku: "PRT-DSP-501",
    name: "Sterile Absorbent Cotton Rolls (1000s)",
    category: "Disposables",
    stock: 7,
    reorderLevel: 12,
    moq: 15,
    batchNumber: "BCH-CTN-26A",
    expiryDate: "2027-08-15",
    unit: "Boxes",
    unitPrice: 480,
    supplier: "Dr. Bajaj Central Depot",
  },
  {
    id: "con-02",
    branchId: "br-001",
    sku: "DBP-RST-412",
    name: "BajajBond Dental Thinner & Etchant Gel",
    category: "Restorative",
    stock: 9,
    reorderLevel: 6,
    moq: 6,
    batchNumber: "BCH-THN-25K",
    expiryDate: "2026-12-12",
    unit: "Kits",
    unitPrice: 2150,
    supplier: "Dr. Bajaj Proprietary Labs",
  },
  {
    id: "con-03",
    branchId: "br-001",
    sku: "DBP-CMP-101",
    name: "BajajDent Nano-Hybrid Composite Fillers",
    category: "Restorative",
    stock: 4,
    reorderLevel: 8,
    moq: 10,
    batchNumber: "BCH-CMP-26C",
    expiryDate: "2026-12-19",
    unit: "Kits",
    unitPrice: 3450,
    supplier: "Dr. Bajaj Proprietary Labs",
  },
  {
    id: "con-04",
    branchId: "br-001",
    sku: "PRT-DSP-508",
    name: "Powder-Free Nitrile Exam Gloves (100s)",
    category: "Disposables",
    stock: 11,
    reorderLevel: 20,
    moq: 25,
    batchNumber: "BCH-GLV-26E",
    expiryDate: "2028-03-30",
    unit: "Boxes",
    unitPrice: 420,
    supplier: "MedSafe Surgicals",
  },
  {
    id: "con-05",
    branchId: "br-001",
    sku: "PRT-DSP-515",
    name: "2ml Disposable Dental Syringes & 30G Needles",
    category: "Disposables",
    stock: 18,
    reorderLevel: 12,
    moq: 12,
    batchNumber: "BCH-SYR-25M",
    expiryDate: "2026-12-08",
    unit: "Boxes",
    unitPrice: 690,
    supplier: "MedSafe Surgicals",
  },
  {
    id: "con-06",
    branchId: "br-001",
    sku: "DBP-END-204",
    name: "Dr. Bajaj ProEndo Gold Rotary Files (Pack of 6)",
    category: "Endodontics",
    stock: 14,
    reorderLevel: 15,
    moq: 15,
    batchNumber: "BCH-END-26F",
    expiryDate: "2028-09-01",
    unit: "Packs",
    unitPrice: 4200,
    supplier: "Dr. Bajaj Proprietary Labs",
  },
  {
    id: "con-07",
    branchId: "br-001",
    sku: "STER-AUT-500",
    name: "Class-B Autoclave Sterilization Pouches (500s)",
    category: "Sterilization",
    stock: 22,
    reorderLevel: 10,
    moq: 10,
    batchNumber: "BCH-STR-26H",
    expiryDate: "2027-11-20",
    unit: "Boxes",
    unitPrice: 1650,
    supplier: "Dr. Bajaj Central Depot",
  },
  {
    id: "con-08",
    branchId: "br-001",
    sku: "PRT-IMP-602",
    name: "Straumann BLX Titanium Implant 4.1x10mm",
    category: "Implantology",
    stock: 9,
    reorderLevel: 6,
    moq: 6,
    batchNumber: "BCH-IMP-26J",
    expiryDate: "2029-01-15",
    unit: "Units",
    unitPrice: 22500,
    supplier: "Straumann India",
  },
];

export const INITIAL_POS: PurchaseOrder[] = [
  {
    id: "po-01",
    poNumber: "PO-2026-8841",
    branchId: "br-001",
    branchName: "DentAI Pro — Bandra West",
    itemName: "Dr. Bajaj ProEndo Gold Rotary Files (20 Packs)",
    quantity: 20,
    totalAmount: 84000,
    status: "Ordered",
    createdAt: "2026-11-25 09:45 IST",
    requestedBy: "Dr. Meera Deshmukh",
  },
  {
    id: "po-02",
    poNumber: "PO-2026-8840",
    branchId: "br-047",
    branchName: "DentAI Pro — Indiranagar",
    itemName: "BajajDent Nano-Hybrid Composite Kit (15 Kits)",
    quantity: 15,
    totalAmount: 51750,
    status: "Packed",
    createdAt: "2026-11-25 08:30 IST",
    requestedBy: "Dr. Ananya Iyer",
  },
  {
    id: "po-03",
    poNumber: "PO-2026-8835",
    branchId: "br-025",
    branchName: "DentAI Pro — Connaught Place",
    itemName: "Straumann BLX Titanium Implants (12 Units)",
    quantity: 12,
    totalAmount: 270000,
    status: "Shipped",
    createdAt: "2026-11-24 17:15 IST",
    requestedBy: "Dr. Kabir Malhotra",
  },
  {
    id: "po-04",
    poNumber: "PO-2026-8829",
    branchId: "br-067",
    branchName: "DentAI Pro — Koregaon Park",
    itemName: "Powder-Free Nitrile Exam Gloves (40 Boxes)",
    quantity: 40,
    totalAmount: 16800,
    status: "Delivered",
    createdAt: "2026-11-23 11:20 IST",
    requestedBy: "Dr. Rohan Kapoor",
  },
];

export const INITIAL_EMI_APPLICATIONS: EmiApplication[] = [
  {
    id: "emi-01",
    patientId: "pat-101",
    patientName: "Aarav Sharma",
    branchName: "DentAI Pro — Bandra West",
    treatment: "Root Canal + Zirconia Crown",
    amount: 100000,
    tenureMonths: 12,
    monthlyEmi: 8333,
    lender: "Bajaj Finserv Health",
    creditScore: 782,
    status: "Pending",
    appliedAt: "2026-11-25 10:42 IST",
  },
  {
    id: "emi-02",
    patientId: "pat-102",
    patientName: "Priya Nair",
    branchName: "DentAI Pro — Connaught Place",
    treatment: "Straumann Titanium Implant + Sinus Lift",
    amount: 145000,
    tenureMonths: 18,
    monthlyEmi: 8056,
    lender: "HDFC Ergo Care",
    creditScore: 810,
    status: "Pending",
    appliedAt: "2026-11-25 09:15 IST",
  },
  {
    id: "emi-03",
    patientId: "pat-103",
    patientName: "Rohan Deshpande",
    branchName: "DentAI Pro — Koregaon Park",
    treatment: "Invisalign Clear Aligner",
    amount: 65000,
    tenureMonths: 6,
    monthlyEmi: 10833,
    lender: "SaveIN Dental",
    creditScore: 745,
    status: "Approved",
    appliedAt: "2026-11-23 15:20 IST",
  },
];

export const INITIAL_CAMPS: CampCampaign[] = [
  {
    id: "camp-01",
    title: "Cipla Corporate Oral Screening Drive",
    partnerPharma: "Cipla Health",
    city: "Mumbai",
    date: "2026-11-28",
    registrations: 420,
    screened: 365,
    conversions: 84,
    channel: "WhatsApp",
    status: "Active",
  },
  {
    id: "camp-02",
    title: "Sun Pharma Senior Citizen Implant Camp",
    partnerPharma: "Sun Pharma",
    city: "Ahmedabad",
    date: "2026-12-03",
    registrations: 280,
    screened: 0,
    conversions: 0,
    channel: "SMS",
    status: "Scheduled",
  },
  {
    id: "camp-03",
    title: "Infosys Tech Park Preventive Smile Camp",
    partnerPharma: "Dr. Reddy's Oral",
    city: "Bengaluru",
    date: "2026-11-15",
    registrations: 610,
    screened: 548,
    conversions: 129,
    channel: "Email",
    status: "Completed",
  },
];

export const INITIAL_DPDP_LOGS: DpdpAuditLog[] = [
  {
    id: "log-01",
    timestamp: "2026-11-25 11:08 IST",
    actor: "Dr. Meera Deshmukh",
    action: "AI Radiograph Inference",
    subject: "Aarav Sharma (pat-101)",
    purpose: "Clinical Diagnostics (Sec 6 Consent)",
    status: "Compliant",
    branchName: "DentAI Pro — Bandra West",
  },
  {
    id: "log-02",
    timestamp: "2026-11-25 10:42 IST",
    actor: "Bajaj Finserv Health API",
    action: "Credit Bureau Soft Pull",
    subject: "Aarav Sharma (pat-101)",
    purpose: "0% EMI Financing",
    status: "Verified",
    branchName: "DentAI Pro — Bandra West",
  },
  {
    id: "log-03",
    timestamp: "2026-11-24 19:12 IST",
    actor: "Patient Self-Service PWA",
    action: "Marketing Consent Opt-Out",
    subject: "Priya Nair (pat-102)",
    purpose: "Promotional Outreach",
    status: "Consent Revoked",
    branchName: "DentAI Pro — Connaught Place",
  },
  {
    id: "log-04",
    timestamp: "2026-11-24 14:05 IST",
    actor: "Riya AI Receptionist",
    action: "WhatsApp Recall Blocked",
    subject: "Karanveer Mehta (pat-105)",
    purpose: "Lapsed Patient Recall",
    status: "Flagged",
    branchName: "DentAI Pro — Satellite",
  },
];
