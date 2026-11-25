"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  INITIAL_AUTOMATION_LOGS,
  INITIAL_B2B_CATALOG,
  INITIAL_BRANCHES,
  INITIAL_CAMPS,
  INITIAL_CAMP_LEADS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_CONSUMABLES,
  INITIAL_D2C_PRODUCTS,
  INITIAL_DPDP_LOGS,
  INITIAL_DPDP_TICKETS,
  INITIAL_EMI_APPLICATIONS,
  INITIAL_EQUIPMENT,
  INITIAL_INSURANCE_CLAIMS,
  INITIAL_INSURANCE_PLANS,
  INITIAL_MARKETING_TEMPLATES,
  INITIAL_ONBOARDING_PIPELINE,
  INITIAL_PATIENTS,
  INITIAL_POS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_PROPERTIES,
  INITIAL_PURCHASED_POLICIES,
  INITIAL_REFERRALS,
  INITIAL_ROYALTY_TRANSACTIONS,
  INITIAL_SECURITY_LOGS,
  INITIAL_VISITS,
} from "@/data/seed";
import type {
  AutomationLog,
  Branch,
  CampCampaign,
  CampLead,
  CatalogProduct,
  City,
  CommunityPost,
  ConsumableItem,
  D2COrder,
  D2CProduct,
  DeliveryLogEvent,
  DpdpAuditLog,
  DpdpConsent,
  DpdpTicket,
  EmiApplication,
  EquipmentItem,
  InsuranceClaim,
  InsurancePlan,
  MarketingTemplate,
  OnboardingFranchisee,
  Patient,
  PrescriptionRecord,
  PropertyListing,
  PurchaseOrder,
  PurchasedPolicy,
  RoyaltyTransaction,
  SecurityAccessLog,
  SpecialistReferral,
  ToothCondition,
  Visit,
} from "@/types/dentai";
import { formatINR } from "@/lib/utils";

interface DentAiContextValue {
  branches: Branch[];
  patients: Patient[];
  visits: Visit[];
  b2bCatalog: CatalogProduct[];
  consumables: ConsumableItem[];
  purchaseOrders: PurchaseOrder[];
  emiApplications: EmiApplication[];
  camps: CampCampaign[];
  dpdpLogs: DpdpAuditLog[];
  onboardingList: OnboardingFranchisee[];
  equipmentList: EquipmentItem[];
  properties: PropertyListing[];
  marketingTemplates: MarketingTemplate[];
  royaltyTransactions: RoyaltyTransaction[];
  referrals: SpecialistReferral[];
  prescriptions: Record<string, PrescriptionRecord>;
  deliveryLogs: DeliveryLogEvent[];
  insurancePlans: InsurancePlan[];
  purchasedPolicies: PurchasedPolicy[];
  insuranceClaims: InsuranceClaim[];
  d2cProducts: D2CProduct[];
  d2cOrders: D2COrder[];
  communityPosts: CommunityPost[];
  automationLogs: AutomationLog[];
  campLeads: CampLead[];
  securityLogs: SecurityAccessLog[];
  dpdpTickets: DpdpTicket[];
  mobileAppMode: boolean;
  setMobileAppMode: (val: boolean) => void;
  hqTab: "bi" | "onboarding" | "property" | "compliance" | "royalty" | "supply";
  setHqTab: (
    tab: "bi" | "onboarding" | "property" | "compliance" | "royalty" | "supply"
  ) => void;
  clinicTab: "schedule" | "edr" | "referrals" | "supply";
  setClinicTab: (tab: "schedule" | "edr" | "referrals" | "supply") => void;
  campsTab: "simulator" | "segmentation" | "pharma";
  setCampsTab: (tab: "simulator" | "segmentation" | "pharma") => void;
  pharmaTab: "onboarding" | "hierarchy" | "ai-content";
  setPharmaTab: (tab: "onboarding" | "hierarchy" | "ai-content") => void;
  createDpdpTicket: (params: {
    patientId: string;
    patientName: string;
    type: DpdpTicket["type"];
    details: string;
  }) => void;
  resolveDpdpTicket: (ticketId: string) => void;
  logGuardianConsent: (params: {
    minorName: string;
    dob: string;
    guardianName: string;
    relationship: string;
  }) => void;
  recordSecurityExport: (format: "CSV" | "JSON") => void;
  addAutomationLog: (log: Omit<AutomationLog, "id" | "timestamp">) => void;
  launchSegmentCampaign: (params: {
    segment: string;
    channel: CampCampaign["channel"];
    recipientCount: number;
    message: string;
  }) => void;
  registerCampAttendee: (params: {
    campId: string;
    name: string;
    phone: string;
    dentalIssue: string;
    assignedBranch: string;
    dpdpConsentGranted: boolean;
  }) => void;
  disbursePatientEmi: (params: {
    patientId: string;
    treatment: string;
    amount: number;
    tenureMonths: number;
    lender: EmiApplication["lender"];
  }) => void;
  purchaseInsurancePolicy: (planId: string) => void;
  fileInsuranceClaim: (params: {
    policyNumber: string;
    invoiceRef: string;
    procedure: string;
    claimAmount: number;
  }) => void;
  advanceInsuranceClaim: (claimId: string) => void;
  placeD2cOrder: (params: {
    items: Array<{ product: D2CProduct; qty: number }>;
    address: string;
  }) => D2COrder;
  advanceD2cOrderStatus: (orderId: string) => void;
  toggleLikeCommunityPost: (postId: string) => void;
  addCommunityComment: (postId: string, author: string, text: string) => void;
  askCommunityQuestion: (author: string, title: string, body: string) => void;
  createAppointment: (params: {
    patientId: string;
    branchId: string;
    doctorName: string;
    date: string;
    time: string;
    chair: string;
    treatment: string;
    estimatedAmount: number;
  }) => void;
  rescheduleAppointment: (
    visitId: string,
    newDate: string,
    newTime: string
  ) => void;
  updateToothCondition: (
    patientId: string,
    toothNumber: number,
    condition: ToothCondition
  ) => void;
  createReferral: (params: {
    patientId: string;
    fromBranch: string;
    fromDoctor: string;
    specialty: SpecialistReferral["specialty"];
    targetSpecialist: string;
    targetBranch: string;
    caseNotes: string;
    xrayAttached: boolean;
    estimatedValue: number;
  }) => void;
  advanceReferralStatus: (referralId: string) => void;
  savePrescription: (patientId: string, rx: PrescriptionRecord) => void;
  completeVisitAndDeliver: (params: {
    patientId: string;
    branchId: string;
    visitId?: string;
    totalAmount: number;
  }) => DeliveryLogEvent;
  createPurchaseOrder: (params: {
    branchId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    requestedBy: string;
  }) => void;
  submitCartPurchaseOrder: (params: {
    branchId: string;
    items: Array<{ product: CatalogProduct; qty: number }>;
    requestedBy: string;
  }) => void;
  advancePoStatus: (poId: string) => void;
  approvePurchaseOrder: (poId: string) => void;
  adjustConsumableStock: (consumableId: string, delta: number) => void;
  reorderConsumableFromHq: (consumableId: string, branchId?: string) => void;
  approveEmi: (emiId: string) => void;
  declineEmi: (emiId: string) => void;
  applyForEmi: (params: {
    patientId: string;
    treatment: string;
    amount: number;
    tenureMonths: number;
    lender: EmiApplication["lender"];
  }) => void;
  finalizeVisit: (visitId: string) => void;
  advanceVisitStatus: (visitId: string, nextStatus: Visit["status"]) => void;
  toggleDpdpConsent: (
    patientId: string,
    consentKey: keyof Omit<DpdpConsent, "updatedAt">,
    actor?: string
  ) => void;
  launchCamp: (params: {
    title: string;
    partnerPharma: string;
    city: City;
    channel: CampCampaign["channel"];
  }) => void;
  toggleOnboardingStep: (franchiseeId: string, stepId: string) => void;
  cycleEquipmentStatus: (equipmentId: string) => void;
  updatePropertyStatus: (
    propertyId: string,
    status: PropertyListing["status"],
    siteVisitDate?: string
  ) => void;
  toggleBranchComplianceItem: (branchId: string, checkItemId: string) => void;
  settleRoyaltyTransaction: (txnId: string) => void;
  resetDemoData: () => void;
}

const DentAiContext = createContext<DentAiContextValue | null>(null);

function nowIstString(): string {
  return (
    new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }) + " IST"
  );
}

export function DentAiProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  const [b2bCatalog] = useState<CatalogProduct[]>(INITIAL_B2B_CATALOG);
  const [consumables, setConsumables] =
    useState<ConsumableItem[]>(INITIAL_CONSUMABLES);
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(INITIAL_POS);
  const [emiApplications, setEmiApplications] = useState<EmiApplication[]>(
    INITIAL_EMI_APPLICATIONS
  );
  const [camps, setCamps] = useState<CampCampaign[]>(INITIAL_CAMPS);
  const [dpdpLogs, setDpdpLogs] = useState<DpdpAuditLog[]>(INITIAL_DPDP_LOGS);
  const [onboardingList, setOnboardingList] = useState<OnboardingFranchisee[]>(
    INITIAL_ONBOARDING_PIPELINE
  );
  const [equipmentList, setEquipmentList] =
    useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [properties, setProperties] =
    useState<PropertyListing[]>(INITIAL_PROPERTIES);
  const [marketingTemplates] = useState<MarketingTemplate[]>(
    INITIAL_MARKETING_TEMPLATES
  );
  const [royaltyTransactions, setRoyaltyTransactions] = useState<
    RoyaltyTransaction[]
  >(INITIAL_ROYALTY_TRANSACTIONS);
  const [referrals, setReferrals] =
    useState<SpecialistReferral[]>(INITIAL_REFERRALS);
  const [prescriptions, setPrescriptions] = useState<
    Record<string, PrescriptionRecord>
  >(INITIAL_PRESCRIPTIONS);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLogEvent[]>([]);
  const [insurancePlans] = useState<InsurancePlan[]>(INITIAL_INSURANCE_PLANS);
  const [purchasedPolicies, setPurchasedPolicies] = useState<PurchasedPolicy[]>(
    INITIAL_PURCHASED_POLICIES
  );
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(
    INITIAL_INSURANCE_CLAIMS
  );
  const [d2cProducts] = useState<D2CProduct[]>(INITIAL_D2C_PRODUCTS);
  const [d2cOrders, setD2cOrders] = useState<D2COrder[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(
    INITIAL_COMMUNITY_POSTS
  );
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(
    INITIAL_AUTOMATION_LOGS
  );
  const [campLeads, setCampLeads] = useState<CampLead[]>(INITIAL_CAMP_LEADS);
  const [securityLogs, setSecurityLogs] = useState<SecurityAccessLog[]>(
    INITIAL_SECURITY_LOGS
  );
  const [dpdpTickets, setDpdpTickets] =
    useState<DpdpTicket[]>(INITIAL_DPDP_TICKETS);
  const [mobileAppMode, setMobileAppMode] = useState<boolean>(true);
  const [hqTab, setHqTab] = useState<
    "bi" | "onboarding" | "property" | "compliance" | "royalty" | "supply"
  >("bi");
  const [clinicTab, setClinicTab] = useState<
    "schedule" | "edr" | "referrals" | "supply"
  >("schedule");
  const [campsTab, setCampsTab] = useState<
    "simulator" | "segmentation" | "pharma"
  >("simulator");
  const [pharmaTab, setPharmaTab] = useState<
    "onboarding" | "hierarchy" | "ai-content"
  >("onboarding");

  const createPurchaseOrder = useCallback(
    ({
      branchId,
      itemName,
      quantity,
      unitPrice,
      requestedBy,
    }: {
      branchId: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
      requestedBy: string;
    }) => {
      const branch = branches.find((b) => b.id === branchId) ?? branches[0];
      const totalAmount = quantity * unitPrice;
      const poNumber = `PO-2026-${Math.floor(8850 + Math.random() * 900)}`;
      const newPo: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber,
        branchId: branch.id,
        branchName: branch.name,
        itemName: `${itemName} (${quantity} units)`,
        quantity,
        totalAmount,
        status: "Ordered",
        createdAt: nowIstString(),
        requestedBy,
      };
      setPurchaseOrders((prev) => [newPo, ...prev]);
      toast.success(`Purchase Order ${poNumber} created`, {
        description: `${branch.name} • ${formatINR(totalAmount)} sent to HQ depot.`,
      });
    },
    [branches]
  );

  const submitCartPurchaseOrder = useCallback(
    ({
      branchId,
      items,
      requestedBy,
    }: {
      branchId: string;
      items: Array<{ product: CatalogProduct; qty: number }>;
      requestedBy: string;
    }) => {
      if (items.length === 0) return;
      const branch = branches.find((b) => b.id === branchId) ?? branches[0];
      const totalQty = items.reduce((s, i) => s + i.qty, 0);
      const totalAmount = items.reduce(
        (s, i) => s + i.product.wholesalePrice * i.qty,
        0
      );
      const poNumber = `PO-2026-${Math.floor(8860 + Math.random() * 900)}`;
      const headline =
        items.length === 1
          ? `${items[0].product.name} (${items[0].qty})`
          : `${items[0].product.name} + ${items.length - 1} more items`;

      const newPo: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber,
        branchId: branch.id,
        branchName: branch.name,
        itemName: headline,
        quantity: totalQty,
        totalAmount,
        status: "Ordered",
        createdAt: nowIstString(),
        requestedBy,
        itemsSummary: items.map((i) => ({
          sku: i.product.sku,
          name: i.product.name,
          qty: i.qty,
          unitPrice: i.product.wholesalePrice,
        })),
      };
      setPurchaseOrders((prev) => [newPo, ...prev]);
      toast.success(`B2B Purchase Order ${poNumber} Submitted`, {
        description: `${totalQty} packs (${formatINR(totalAmount)}) queued at HQ Central Depot.`,
      });
    },
    [branches]
  );

  const advancePoStatus = useCallback(
    (poId: string) => {
      const orderFlow: PurchaseOrder["status"][] = [
        "Ordered",
        "Packed",
        "Shipped",
        "Delivered",
      ];
      const target = purchaseOrders.find((p) => p.id === poId);
      if (!target) return;
      const currentIdx = orderFlow.indexOf(target.status);
      if (currentIdx === -1 || currentIdx >= orderFlow.length - 1) return;
      const nextStatus = orderFlow[currentIdx + 1];

      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === poId ? { ...po, status: nextStatus } : po
        )
      );
      toast.success(`${target.poNumber} → ${nextStatus}`, {
        description: `${target.branchName} fulfillment updated.`,
      });
    },
    [purchaseOrders]
  );

  const approvePurchaseOrder = useCallback(
    (poId: string) => {
      advancePoStatus(poId);
    },
    [advancePoStatus]
  );

  const adjustConsumableStock = useCallback(
    (consumableId: string, delta: number) => {
      const target = consumables.find((c) => c.id === consumableId);
      if (!target) return;
      const nextStock = Math.max(0, target.stock + delta);
      setConsumables((prev) =>
        prev.map((c) =>
          c.id === consumableId ? { ...c, stock: nextStock } : c
        )
      );
      if (delta > 0) {
        toast.success(`Stock Added: ${target.name}`, {
          description: `Current stock: ${nextStock} ${target.unit}`,
        });
      } else if (nextStock < target.moq) {
        toast.warning(`Low-Stock Alert: ${target.name}`, {
          description: `Stock dropped to ${nextStock} ${target.unit} (below MOQ of ${target.moq}).`,
        });
      } else {
        toast.info(`Consumed ${Math.abs(delta)} ${target.unit}`, {
          description: `${target.name} • Remaining: ${nextStock} ${target.unit}`,
        });
      }
    },
    [consumables]
  );

  const reorderConsumableFromHq = useCallback(
    (consumableId: string, branchId?: string) => {
      const item = consumables.find((c) => c.id === consumableId);
      if (!item) return;
      const branch =
        branches.find((b) => b.id === (branchId ?? item.branchId)) ??
        branches[0];
      const reorderQty = Math.max(item.moq, item.moq - item.stock + 5);
      const totalAmount = reorderQty * item.unitPrice;
      const poNumber = `PO-2026-${Math.floor(8870 + Math.random() * 900)}`;

      const newPo: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber,
        branchId: branch.id,
        branchName: branch.name,
        itemName: `${item.name} (${reorderQty} ${item.unit})`,
        quantity: reorderQty,
        totalAmount,
        status: "Ordered",
        createdAt: nowIstString(),
        requestedBy: `${branch.leadDentist} (Auto-Reorder)`,
      };
      setPurchaseOrders((prev) => [newPo, ...prev]);
      toast.success(`1-Click Reorder Submitted: ${poNumber}`, {
        description: `${reorderQty} ${item.unit} of ${item.name} (${formatINR(totalAmount)}) ordered from HQ.`,
      });
    },
    [consumables, branches]
  );

  const approveEmi = useCallback(
    (emiId: string) => {
      const target = emiApplications.find((e) => e.id === emiId);
      setEmiApplications((prev) =>
        prev.map((e) => (e.id === emiId ? { ...e, status: "Approved" } : e))
      );
      if (target) {
        setBranches((prev) =>
          prev.map((b) =>
            b.name === target.branchName
              ? { ...b, emiVolume: b.emiVolume + target.amount }
              : b
          )
        );
      }
      toast.success(`0% EMI Approved for ${target?.patientName ?? "Patient"}`, {
        description: `${formatINR(target?.amount ?? 0)} via ${target?.lender ?? "Lender"}`,
      });
    },
    [emiApplications]
  );

  const declineEmi = useCallback(
    (emiId: string) => {
      const target = emiApplications.find((e) => e.id === emiId);
      setEmiApplications((prev) =>
        prev.map((e) => (e.id === emiId ? { ...e, status: "Declined" } : e))
      );
      toast.info(
        `EMI application declined for ${target?.patientName ?? "Patient"}`
      );
    },
    [emiApplications]
  );

  const applyForEmi = useCallback(
    ({
      patientId,
      treatment,
      amount,
      tenureMonths,
      lender,
    }: {
      patientId: string;
      treatment: string;
      amount: number;
      tenureMonths: number;
      lender: EmiApplication["lender"];
    }) => {
      const patient = patients.find((p) => p.id === patientId) ?? patients[0];
      const monthlyEmi = Math.round(amount / tenureMonths);
      const newEmi: EmiApplication = {
        id: `emi-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        branchName: patient.branchName,
        treatment,
        amount,
        tenureMonths,
        monthlyEmi,
        lender,
        creditScore: 790,
        status: "Pending",
        appliedAt: nowIstString(),
      };
      setEmiApplications((prev) => [newEmi, ...prev]);
      toast.success("0% EMI Application Submitted", {
        description: `${formatINR(monthlyEmi)}/mo for ${tenureMonths} months via ${lender}. Sent to HQ & Lender.`,
      });
    },
    [patients]
  );

  const advanceVisitStatus = useCallback(
    (visitId: string, nextStatus: Visit["status"]) => {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status: nextStatus } : v))
      );
      toast.info(`Visit status updated to ${nextStatus}`);
    },
    []
  );

  const finalizeVisit = useCallback(
    (visitId: string) => {
      const visit = visits.find((v) => v.id === visitId);
      if (!visit) return;

      const addedProfit = Math.round(visit.estimatedAmount * 0.34);
      const addedExpense = visit.estimatedAmount - addedProfit;

      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status: "Completed" } : v))
      );
      setBranches((prev) =>
        prev.map((b) =>
          b.id === visit.branchId
            ? {
                ...b,
                monthlyRevenue: b.monthlyRevenue + visit.estimatedAmount,
                expenses: b.expenses + addedExpense,
                netProfit: b.netProfit + addedProfit,
                patientCount: b.patientCount + 1,
              }
            : b
        )
      );
      setPatients((prev) =>
        prev.map((p) =>
          p.id === visit.patientId
            ? {
                ...p,
                loyaltyPoints: p.loyaltyPoints + 250,
                lastVisit: "2026-11-25",
              }
            : p
        )
      );

      toast.success(`Visit Finalized: ${visit.patientName}`, {
        description: `${formatINR(visit.estimatedAmount)} billed & +250 SmilePoints credited.`,
      });
    },
    [visits]
  );

  const toggleDpdpConsent = useCallback(
    (
      patientId: string,
      consentKey: keyof Omit<DpdpConsent, "updatedAt">,
      actor = "Patient Self-Service PWA"
    ) => {
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) return;

      const nextValue = !patient.dpdpConsent[consentKey];
      const timestamp = nowIstString();

      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? {
                ...p,
                dpdpConsent: {
                  ...p.dpdpConsent,
                  [consentKey]: nextValue,
                  updatedAt: timestamp,
                },
              }
            : p
        )
      );

      const newLog: DpdpAuditLog = {
        id: `log-${Date.now()}`,
        timestamp,
        actor,
        action: `${consentKey.toUpperCase()} Consent ${
          nextValue ? "Granted" : "Revoked"
        }`,
        subject: `${patient.name} (${patient.id})`,
        purpose: `DPDP Act 2023 Sec 6 — ${consentKey}`,
        status: nextValue ? "Compliant" : "Consent Revoked",
        branchName: patient.branchName,
      };
      setDpdpLogs((prev) => [newLog, ...prev]);

      if (nextValue) {
        toast.success(`DPDP Consent Granted (${consentKey})`, {
          description: `Audit log recorded for ${patient.name}.`,
        });
      } else {
        toast.warning(`DPDP Consent Revoked (${consentKey})`, {
          description: `Automated processing paused for ${patient.name}.`,
        });
      }
    },
    [patients]
  );

  const launchCamp = useCallback(
    ({
      title,
      partnerPharma,
      city,
      channel,
    }: {
      title: string;
      partnerPharma: string;
      city: City;
      channel: CampCampaign["channel"];
    }) => {
      const newCamp: CampCampaign = {
        id: `camp-${Date.now()}`,
        title,
        partnerPharma,
        city,
        date: "2026-12-05",
        registrations: 150,
        screened: 0,
        conversions: 0,
        channel,
        status: "Active",
      };
      setCamps((prev) => [newCamp, ...prev]);
      toast.success(`Camp Launched: ${title}`, {
        description: `${channel} outreach queued with ${partnerPharma} in ${city}.`,
      });
    },
    []
  );

  const toggleOnboardingStep = useCallback(
    (franchiseeId: string, stepId: string) => {
      setOnboardingList((prev) =>
        prev.map((f) => {
          if (f.id !== franchiseeId) return f;
          const updatedChecklist = f.checklist.map((item) =>
            item.id === stepId ? { ...item, completed: !item.completed } : item
          );
          const doneCount = updatedChecklist.filter((c) => c.completed).length;
          const pct = Math.round((doneCount / updatedChecklist.length) * 100);
          let nextStage: OnboardingFranchisee["stage"] = "Agreement";
          if (pct === 100) nextStage = "Live";
          else if (pct >= 80) nextStage = "Ready for Go-Live";
          else if (pct >= 60) nextStage = "Equipment & Training";
          else if (pct >= 30) nextStage = "Fit-Out";

          toast.success(`${f.proposedBranch} Readiness: ${pct}%`, {
            description: `Stage updated to ${nextStage} (${doneCount}/10 milestones)`,
          });
          return {
            ...f,
            checklist: updatedChecklist,
            stage: nextStage,
          };
        })
      );
    },
    []
  );

  const cycleEquipmentStatus = useCallback(
    (equipmentId: string) => {
      const target = equipmentList.find((eq) => eq.id === equipmentId);
      if (!target) return;
      const nextStatus: EquipmentItem["maintenanceStatus"] =
        target.maintenanceStatus === "Operational"
          ? "Due Soon"
          : target.maintenanceStatus === "Due Soon"
          ? "Under Service"
          : "Operational";

      setEquipmentList((prev) =>
        prev.map((eq) =>
          eq.id === equipmentId ? { ...eq, maintenanceStatus: nextStatus } : eq
        )
      );
      toast.info(`${target.model} (${target.serialNumber})`, {
        description: `Maintenance status set to ${nextStatus}`,
      });
    },
    [equipmentList]
  );

  const updatePropertyStatus = useCallback(
    (
      propertyId: string,
      status: PropertyListing["status"],
      siteVisitDate?: string
    ) => {
      const target = properties.find((p) => p.id === propertyId);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                status,
                siteVisitDate:
                  siteVisitDate ??
                  (status === "Site Visit Scheduled"
                    ? "2026-12-01"
                    : p.siteVisitDate),
              }
            : p
        )
      );

      if (status === "Rejected") {
        toast.warning(`Property Rejected: ${target?.title ?? "Location"}`);
      } else {
        toast.success(`Property Status: ${status}`, {
          description: target?.title,
        });
      }
    },
    [properties]
  );

  const toggleBranchComplianceItem = useCallback(
    (branchId: string, checkItemId: string) => {
      setBranches((prev) =>
        prev.map((b) => {
          if (b.id !== branchId) return b;
          const updatedChecklist = b.complianceChecklist.map((c) =>
            c.id === checkItemId ? { ...c, passed: !c.passed } : c
          );
          const passed = updatedChecklist.filter((c) => c.passed).length;
          const newScore = Math.round((passed / updatedChecklist.length) * 100);
          toast.success(`${b.name} Audit Score: ${newScore}%`, {
            description: `${passed}/${updatedChecklist.length} compliance controls passed.`,
          });
          return {
            ...b,
            complianceChecklist: updatedChecklist,
            complianceScore: newScore,
          };
        })
      );
    },
    []
  );

  const settleRoyaltyTransaction = useCallback(
    (txnId: string) => {
      const target = royaltyTransactions.find((r) => r.id === txnId);
      setRoyaltyTransactions((prev) =>
        prev.map((r) =>
          r.id === txnId ? { ...r, settlementStatus: "Settled" } : r
        )
      );
      toast.success(`Split Settlement Executed (${target?.txnRef ?? txnId})`, {
        description: `HQ Share ${formatINR(target?.hqShare ?? 0)} • Franchisee Payout ${formatINR(
          target?.franchiseeShare ?? 0
        )}`,
      });
    },
    [royaltyTransactions]
  );

  const createAppointment = useCallback(
    ({
      patientId,
      branchId,
      doctorName,
      date,
      time,
      chair,
      treatment,
      estimatedAmount,
    }: {
      patientId: string;
      branchId: string;
      doctorName: string;
      date: string;
      time: string;
      chair: string;
      treatment: string;
      estimatedAmount: number;
    }) => {
      const patient = patients.find((p) => p.id === patientId) ?? patients[0];
      const newVisit: Visit = {
        id: `vis-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        branchId,
        doctorName,
        date,
        time,
        chair,
        treatment,
        estimatedAmount,
        status: "Scheduled",
        aiNotes: `Scheduled ${treatment} for ${patient.name}. Allergies: ${patient.allergies.join(", ")}.`,
        xrayFindings: "Pre-op AI screening pending",
      };
      setVisits((prev) => [newVisit, ...prev]);
      toast.success(`Appointment Booked: ${patient.name}`, {
        description: `${date} at ${time} (${chair}) • ${treatment}`,
      });
    },
    [patients]
  );

  const rescheduleAppointment = useCallback(
    (visitId: string, newDate: string, newTime: string) => {
      const target = visits.find((v) => v.id === visitId);
      setVisits((prev) =>
        prev.map((v) =>
          v.id === visitId ? { ...v, date: newDate, time: newTime } : v
        )
      );
      toast.info(`Rescheduled ${target?.patientName ?? "Appointment"}`, {
        description: `Moved to ${newDate} at ${newTime}`,
      });
    },
    [visits]
  );

  const updateToothCondition = useCallback(
    (patientId: string, toothNumber: number, condition: ToothCondition) => {
      const procMap: Record<
        Exclude<ToothCondition, "Healthy">,
        { procedure: string; cost: number }
      > = {
        Cavity: {
          procedure: "BajajDent Nano-Hybrid Composite Restoration",
          cost: 4500,
        },
        "Root Canal Needed": {
          procedure: "Single-Sitting Rotary Root Canal + Zirconia Crown",
          cost: 100000,
        },
        Crown: {
          procedure: "Monolithic Zirconia CAD/CAM Crown",
          cost: 35000,
        },
        Extracted: {
          procedure: "Atraumatic Extraction + Socket Preservation",
          cost: 8500,
        },
      };

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;
          const nextChart = { ...p.toothChart, [toothNumber]: condition };
          let nextPlan = [...p.treatmentPlan];

          if (condition !== "Healthy") {
            const mapped = procMap[condition];
            const existingIdx = nextPlan.findIndex(
              (item) => item.toothNumber === toothNumber
            );
            const newItem = {
              id: `tp-${toothNumber}-${Date.now()}`,
              toothNumber,
              procedure: mapped.procedure,
              cost: mapped.cost,
              status: "Proposed" as const,
            };
            if (existingIdx >= 0) {
              nextPlan[existingIdx] = newItem;
            } else {
              nextPlan.push(newItem);
            }
          } else {
            nextPlan = nextPlan.filter(
              (item) => item.toothNumber !== toothNumber
            );
          }

          const newBalance = nextPlan.reduce((s, item) => s + item.cost, 0);
          return {
            ...p,
            toothChart: nextChart,
            treatmentPlan: nextPlan,
            outstandingBalance: newBalance,
          };
        })
      );

      if (condition === "Healthy") {
        toast.info(`Tooth #${toothNumber} marked Healthy`);
      } else {
        const mapped = procMap[condition];
        toast.success(`Tooth #${toothNumber}: ${condition}`, {
          description: `Added "${mapped.procedure}" (${formatINR(mapped.cost)}) to Treatment Plan.`,
        });
      }
    },
    []
  );

  const createReferral = useCallback(
    ({
      patientId,
      fromBranch,
      fromDoctor,
      specialty,
      targetSpecialist,
      targetBranch,
      caseNotes,
      xrayAttached,
      estimatedValue,
    }: {
      patientId: string;
      fromBranch: string;
      fromDoctor: string;
      specialty: SpecialistReferral["specialty"];
      targetSpecialist: string;
      targetBranch: string;
      caseNotes: string;
      xrayAttached: boolean;
      estimatedValue: number;
    }) => {
      const patient = patients.find((p) => p.id === patientId) ?? patients[0];
      const referralCode = `REF-2026-${Math.floor(410 + Math.random() * 500)}`;
      const newRef: SpecialistReferral = {
        id: `ref-${Date.now()}`,
        referralCode,
        patientId: patient.id,
        patientName: patient.name,
        fromBranch,
        fromDoctor,
        specialty,
        targetSpecialist,
        targetBranch,
        caseNotes,
        xrayAttached,
        estimatedValue,
        referralSharePercent: 15,
        status: "Referred",
        createdAt: nowIstString(),
      };
      setReferrals((prev) => [newRef, ...prev]);
      toast.success(`Specialist Referral Sent (${referralCode})`, {
        description: `${patient.name} referred to ${targetSpecialist} (${specialty}).`,
      });
    },
    [patients]
  );

  const advanceReferralStatus = useCallback(
    (referralId: string) => {
      const flow: SpecialistReferral["status"][] = [
        "Referred",
        "Accepted",
        "Consultation Done",
        "Completed",
      ];
      const target = referrals.find((r) => r.id === referralId);
      if (!target) return;
      const idx = flow.indexOf(target.status);
      if (idx === -1 || idx >= flow.length - 1) return;
      const nextStatus = flow[idx + 1];
      setReferrals((prev) =>
        prev.map((r) =>
          r.id === referralId ? { ...r, status: nextStatus } : r
        )
      );
      toast.success(`${target.referralCode} → ${nextStatus}`, {
        description: `${target.patientName} (${target.specialty})`,
      });
    },
    [referrals]
  );

  const savePrescription = useCallback(
    (patientId: string, rx: PrescriptionRecord) => {
      setPrescriptions((prev) => ({ ...prev, [patientId]: rx }));
      toast.success("Digital Prescription Saved", {
        description: `${rx.medicines.length} medicines + ${rx.d2cSelfCareKit.length} D2C care items attached.`,
      });
    },
    []
  );

  const completeVisitAndDeliver = useCallback(
    ({
      patientId,
      branchId,
      visitId,
      totalAmount,
    }: {
      patientId: string;
      branchId: string;
      visitId?: string;
      totalAmount: number;
    }): DeliveryLogEvent => {
      const patient = patients.find((p) => p.id === patientId) ?? patients[0];
      const addedProfit = Math.round(totalAmount * 0.34);
      const addedExpense = totalAmount - addedProfit;
      const timestamp = nowIstString();

      if (visitId) {
        setVisits((prev) =>
          prev.map((v) =>
            v.id === visitId ? { ...v, status: "Completed" } : v
          )
        );
      } else {
        setVisits((prev) =>
          prev.map((v) =>
            v.patientId === patientId && v.status !== "Completed"
              ? { ...v, status: "Completed" }
              : v
          )
        );
      }

      setBranches((prev) =>
        prev.map((b) =>
          b.id === branchId
            ? {
                ...b,
                monthlyRevenue: b.monthlyRevenue + totalAmount,
                expenses: b.expenses + addedExpense,
                netProfit: b.netProfit + addedProfit,
                patientCount: b.patientCount + 1,
              }
            : b
        )
      );

      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? {
                ...p,
                loyaltyPoints: p.loyaltyPoints + 300,
                lastVisit: "2026-11-25",
                treatmentPlan: p.treatmentPlan.map((tp) => ({
                  ...tp,
                  status: "Completed",
                })),
              }
            : p
        )
      );

      const event: DeliveryLogEvent = {
        id: `dlv-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        channels: ["WhatsApp", "Email", "PWA Vault"],
        timestamp,
        invoiceAmount: totalAmount,
      };
      setDeliveryLogs((prev) => [event, ...prev]);

      toast.success(`Visit Completed & Auto-Delivered`, {
        description: `${formatINR(totalAmount)} finalized • Rx & Invoice sent via WhatsApp, Email & PWA Vault.`,
      });

      return event;
    },
    [patients]
  );

  const disbursePatientEmi = useCallback(
    ({
      patientId,
      treatment,
      amount,
      tenureMonths,
      lender,
    }: {
      patientId: string;
      treatment: string;
      amount: number;
      tenureMonths: number;
      lender: EmiApplication["lender"];
    }) => {
      const patient = patients.find((p) => p.id === patientId) ?? patients[0];
      const monthlyEmi = Math.round(amount / tenureMonths);

      const newEmi: EmiApplication = {
        id: `emi-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        branchName: patient.branchName,
        treatment,
        amount,
        tenureMonths,
        monthlyEmi,
        lender,
        creditScore: 796,
        status: "Disbursed",
        appliedAt: nowIstString(),
      };
      setEmiApplications((prev) => [newEmi, ...prev]);

      setPatients((prev) =>
        prev.map((p) =>
          p.id === patient.id
            ? {
                ...p,
                outstandingBalance: 0,
                treatmentPlan: p.treatmentPlan.map((tp) => ({
                  ...tp,
                  status: "Completed",
                })),
              }
            : p
        )
      );

      setBranches((prev) =>
        prev.map((b) =>
          b.id === patient.branchId
            ? { ...b, emiVolume: b.emiVolume + amount }
            : b
        )
      );

      toast.success("EMI Approved & Disbursed to Clinic!", {
        description: `${formatINR(amount)} (${formatINR(monthlyEmi)}/mo × ${tenureMonths}m) settled via ${lender}.`,
      });
    },
    [patients]
  );

  const purchaseInsurancePolicy = useCallback(
    (planId: string) => {
      const plan = insurancePlans.find((p) => p.id === planId);
      if (!plan) return;
      const newPol: PurchasedPolicy = {
        id: `pol-${Date.now()}`,
        policyNumber: `DBN-INS-${Math.floor(10000 + Math.random() * 89999)}`,
        planName: plan.planName,
        insurer: plan.insurer,
        coverageAmount: plan.coverageAmount,
        annualPremium: plan.annualPremium,
        validUntil: "2027-11-25",
        status: "Active",
      };
      setPurchasedPolicies((prev) => [newPol, ...prev]);
      toast.success(`Policy Purchased: ${plan.planName}`, {
        description: `${newPol.policyNumber} added to your Digital Vault.`,
      });
    },
    [insurancePlans]
  );

  const fileInsuranceClaim = useCallback(
    ({
      policyNumber,
      invoiceRef,
      procedure,
      claimAmount,
    }: {
      policyNumber: string;
      invoiceRef: string;
      procedure: string;
      claimAmount: number;
    }) => {
      const claimNumber = `CLM-2026-${Math.floor(400 + Math.random() * 500)}`;
      const newClaim: InsuranceClaim = {
        id: `clm-${Date.now()}`,
        claimNumber,
        policyNumber,
        invoiceRef,
        procedure,
        claimAmount,
        attachments: [`${invoiceRef}.pdf`, "OPG_AI_Scan.dcm"],
        status: "Submitted",
        submittedAt: nowIstString(),
      };
      setInsuranceClaims((prev) => [newClaim, ...prev]);
      toast.success(`Insurance Claim Filed (${claimNumber})`, {
        description: `Auto-attached ${invoiceRef}.pdf & OPG X-Ray (${formatINR(claimAmount)}).`,
      });
    },
    []
  );

  const advanceInsuranceClaim = useCallback(
    (claimId: string) => {
      const flow: InsuranceClaim["status"][] = [
        "Submitted",
        "Under Review",
        "Approved/Settled",
      ];
      const target = insuranceClaims.find((c) => c.id === claimId);
      if (!target) return;
      const idx = flow.indexOf(target.status);
      if (idx === -1 || idx >= flow.length - 1) return;
      const next = flow[idx + 1];
      setInsuranceClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: next } : c))
      );
      toast.success(`${target.claimNumber} → ${next}`);
    },
    [insuranceClaims]
  );

  const placeD2cOrder = useCallback(
    ({
      items,
      address,
    }: {
      items: Array<{ product: D2CProduct; qty: number }>;
      address: string;
    }): D2COrder => {
      const totalAmount = items.reduce(
        (s, i) => s + i.product.price * i.qty,
        0
      );
      const newOrder: D2COrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `D2C-${Math.floor(7000 + Math.random() * 2900)}`,
        items,
        totalAmount,
        address,
        paymentMethod: "UPI",
        status: "Confirmed",
        placedAt: nowIstString(),
      };
      setD2cOrders((prev) => [newOrder, ...prev]);
      toast.success(`Order Confirmed (${newOrder.orderNumber})`, {
        description: `Paid ${formatINR(totalAmount)} via UPI • Delivering to ${address}.`,
      });
      return newOrder;
    },
    []
  );

  const advanceD2cOrderStatus = useCallback(
    (orderId: string) => {
      const flow: D2COrder["status"][] = [
        "Confirmed",
        "Packed",
        "Out for Delivery",
        "Delivered",
      ];
      const target = d2cOrders.find((o) => o.id === orderId);
      if (!target) return;
      const idx = flow.indexOf(target.status);
      if (idx === -1 || idx >= flow.length - 1) return;
      const next = flow[idx + 1];
      setD2cOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
      );
      toast.info(`${target.orderNumber} → ${next}`);
    },
    [d2cOrders]
  );

  const toggleLikeCommunityPost = useCallback((postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = !p.likedByUser;
        return {
          ...p,
          likedByUser: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  }, []);

  const addCommunityComment = useCallback(
    (postId: string, author: string, text: string) => {
      if (!text.trim()) return;
      setCommunityPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: `cmt-${Date.now()}`,
                    author,
                    text: text.trim(),
                    time: "Just now",
                  },
                ],
              }
            : p
        )
      );
      toast.success("Comment posted to Community Hub");
    },
    []
  );

  const askCommunityQuestion = useCallback(
    (author: string, title: string, body: string) => {
      if (!title.trim() || !body.trim()) return;
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        author,
        roleBadge: "Verified Patient",
        verifiedDoctor: false,
        title: title.trim(),
        body: body.trim(),
        likes: 1,
        likedByUser: true,
        comments: [],
        timestamp: "Just now",
      };
      setCommunityPosts((prev) => [newPost, ...prev]);
      toast.success("Question posted — MDS Dentist notified");
    },
    []
  );

  const addAutomationLog = useCallback(
    (log: Omit<AutomationLog, "id" | "timestamp">) => {
      const entry: AutomationLog = {
        ...log,
        id: `aut-${Date.now()}`,
        timestamp: nowIstString(),
      };
      setAutomationLogs((prev) => [entry, ...prev]);
    },
    []
  );

  const launchSegmentCampaign = useCallback(
    ({
      segment,
      channel,
      recipientCount,
      message,
    }: {
      segment: string;
      channel: CampCampaign["channel"];
      recipientCount: number;
      message: string;
    }) => {
      const entry: AutomationLog = {
        id: `aut-${Date.now()}`,
        ruleName: "Segment Care Drip",
        channel,
        recipient: `${segment} Segment (${recipientCount} DPDP-Consented Patients)`,
        summary: message.slice(0, 72) + (message.length > 72 ? "..." : ""),
        timestamp: nowIstString(),
        status: "Delivered",
      };
      setAutomationLogs((prev) => [entry, ...prev]);
      toast.success(`Care-Plan Campaign Sent to ${segment}`, {
        description: `${recipientCount} patients targeted via ${channel} (DPDP consent verified).`,
      });
    },
    []
  );

  const registerCampAttendee = useCallback(
    ({
      campId,
      name,
      phone,
      dentalIssue,
      assignedBranch,
      dpdpConsentGranted,
    }: {
      campId: string;
      name: string;
      phone: string;
      dentalIssue: string;
      assignedBranch: string;
      dpdpConsentGranted: boolean;
    }) => {
      const camp = camps.find((c) => c.id === campId) ?? camps[0];
      const voucherCode = `${camp.partnerPharma
        .split(" ")[0]
        .toUpperCase()}-RVG-${Math.floor(100 + Math.random() * 899)}`;
      const timestamp = nowIstString();

      const newLead: CampLead = {
        id: `lead-${Date.now()}`,
        campId: camp.id,
        campTitle: camp.title,
        partnerPharma: camp.partnerPharma,
        name,
        phone,
        dentalIssue,
        assignedBranch,
        dpdpConsentGranted,
        voucherCode,
        status: "Voucher Sent",
        registeredAt: timestamp,
      };
      setCampLeads((prev) => [newLead, ...prev]);

      setCamps((prev) =>
        prev.map((c) =>
          c.id === camp.id
            ? {
                ...c,
                registrations: c.registrations + 1,
                screened: c.screened + 1,
              }
            : c
        )
      );

      setDpdpLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp,
          actor: "Pharma Camp Lead Form",
          action: "Camp Screening & Recall Consent Granted",
          subject: `${name} (${phone})`,
          purpose: `DPDP Act 2023 Sec 6 — ${camp.partnerPharma} Camp`,
          status: "Compliant",
          branchName: assignedBranch,
        },
        ...prev,
      ]);

      setAutomationLogs((prev) => [
        {
          id: `aut-${Date.now()}`,
          ruleName: "Booking Confirmation",
          channel: "WhatsApp",
          recipient: `${name} (${phone})`,
          summary: `Welcome WhatsApp Voucher ${voucherCode} • Assigned: ${assignedBranch}`,
          timestamp,
          status: "Delivered",
        },
        ...prev,
      ]);

      toast.success(`Camp Attendee Registered & Welcome Voucher Sent!`, {
        description: `WhatsApp voucher ${voucherCode} (FREE AI RVG Scan) sent to ${name} • Assigned to ${assignedBranch}.`,
      });
    },
    [camps]
  );

  const createDpdpTicket = useCallback(
    ({
      patientId,
      patientName,
      type,
      details,
    }: {
      patientId: string;
      patientName: string;
      type: DpdpTicket["type"];
      details: string;
    }) => {
      const prefix =
        type === "Data Correction"
          ? "COR"
          : type === "Account Erasure"
          ? "ERS"
          : "GRV";
      const ticketNumber = `DPDP-${prefix}-${Math.floor(215 + Math.random() * 700)}`;
      const timestamp = nowIstString();

      setDpdpTickets((prev) => [
        {
          id: `tkt-${Date.now()}`,
          ticketNumber,
          patientId,
          patientName,
          type,
          details,
          status: "Open",
          createdAt: timestamp,
        },
        ...prev,
      ]);

      setDpdpLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp,
          actor: "Patient Privacy Portal",
          action: `${type} Request Filed (${ticketNumber})`,
          subject: `${patientName} (${patientId})`,
          purpose: `DPDP Act 2023 Sec 12–13 Data Principal Right`,
          status: type === "Account Erasure" ? "Flagged" : "Verified",
          branchName: "Patient Super-App PWA",
        },
        ...prev,
      ]);

      toast.success(`${type} Ticket Created (${ticketNumber})`, {
        description: "Routed to DPO Vikram Kulkarni in the DPDP Console.",
      });
    },
    []
  );

  const resolveDpdpTicket = useCallback(
    (ticketId: string) => {
      const target = dpdpTickets.find((t) => t.id === ticketId);
      setDpdpTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "Resolved" } : t))
      );
      toast.success(`Resolved ${target?.ticketNumber ?? "Ticket"}`, {
        description: `DPO action logged for ${target?.patientName ?? "Data Principal"}.`,
      });
    },
    [dpdpTickets]
  );

  const logGuardianConsent = useCallback(
    ({
      minorName,
      dob,
      guardianName,
      relationship,
    }: {
      minorName: string;
      dob: string;
      guardianName: string;
      relationship: string;
    }) => {
      const timestamp = nowIstString();
      setDpdpLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp,
          actor: `${guardianName} (${relationship})`,
          action: "Verifiable Guardian Consent Verified (Minor < 18)",
          subject: `${minorName} (DOB: ${dob})`,
          purpose: "DPDP Act 2023 Sec 9 — Verifiable Parental Consent",
          status: "Verified",
          branchName: "DentAI Pro — Bandra West",
        },
        ...prev,
      ]);
      toast.success("Verifiable Parental Consent Recorded", {
        description: `${guardianName} verified via OTP for minor ${minorName}.`,
      });
    },
    []
  );

  const recordSecurityExport = useCallback((format: "CSV" | "JSON") => {
    const timestamp = nowIstString();
    setSecurityLogs((prev) => [
      {
        id: `sec-${Date.now()}`,
        timestamp,
        user: "Vikram Kulkarni",
        rbacRole: "DPO Officer",
        action: "Exported Audit CSV",
        patientRecord: `Full Consent Ledger (${format})`,
        encryption: "AES-256-GCM",
      },
      ...prev,
    ]);
    toast.success(`DPDP Audit Ledger Exported (${format})`, {
      description: "Tamper-proof timestamped audit file downloaded.",
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setBranches(INITIAL_BRANCHES);
    setPatients(INITIAL_PATIENTS);
    setVisits(INITIAL_VISITS);
    setConsumables(INITIAL_CONSUMABLES);
    setPurchaseOrders(INITIAL_POS);
    setEmiApplications(INITIAL_EMI_APPLICATIONS);
    setCamps(INITIAL_CAMPS);
    setDpdpLogs(INITIAL_DPDP_LOGS);
    setOnboardingList(INITIAL_ONBOARDING_PIPELINE);
    setEquipmentList(INITIAL_EQUIPMENT);
    setProperties(INITIAL_PROPERTIES);
    setRoyaltyTransactions(INITIAL_ROYALTY_TRANSACTIONS);
    setReferrals(INITIAL_REFERRALS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setDeliveryLogs([]);
    setPurchasedPolicies(INITIAL_PURCHASED_POLICIES);
    setInsuranceClaims(INITIAL_INSURANCE_CLAIMS);
    setD2cOrders([]);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setAutomationLogs(INITIAL_AUTOMATION_LOGS);
    setCampLeads(INITIAL_CAMP_LEADS);
    setSecurityLogs(INITIAL_SECURITY_LOGS);
    setDpdpTickets(INITIAL_DPDP_TICKETS);
    toast.info("Demo Data Reset", {
      description:
        "All 104 branches, schedules, EDR charts, EMI KYC, store & ledgers restored.",
    });
  }, []);

  return (
    <DentAiContext.Provider
      value={{
        branches,
        patients,
        visits,
        b2bCatalog,
        consumables,
        purchaseOrders,
        emiApplications,
        camps,
        dpdpLogs,
        onboardingList,
        equipmentList,
        properties,
        marketingTemplates,
        royaltyTransactions,
        referrals,
        prescriptions,
        deliveryLogs,
        insurancePlans,
        purchasedPolicies,
        insuranceClaims,
        d2cProducts,
        d2cOrders,
        communityPosts,
        automationLogs,
        campLeads,
        securityLogs,
        dpdpTickets,
        mobileAppMode,
        setMobileAppMode,
        hqTab,
        setHqTab,
        clinicTab,
        setClinicTab,
        campsTab,
        setCampsTab,
        pharmaTab,
        setPharmaTab,
        createDpdpTicket,
        resolveDpdpTicket,
        logGuardianConsent,
        recordSecurityExport,
        addAutomationLog,
        launchSegmentCampaign,
        registerCampAttendee,
        createPurchaseOrder,
        submitCartPurchaseOrder,
        advancePoStatus,
        approvePurchaseOrder,
        adjustConsumableStock,
        reorderConsumableFromHq,
        approveEmi,
        declineEmi,
        applyForEmi,
        disbursePatientEmi,
        purchaseInsurancePolicy,
        fileInsuranceClaim,
        advanceInsuranceClaim,
        placeD2cOrder,
        advanceD2cOrderStatus,
        toggleLikeCommunityPost,
        addCommunityComment,
        askCommunityQuestion,
        finalizeVisit,
        advanceVisitStatus,
        toggleDpdpConsent,
        launchCamp,
        toggleOnboardingStep,
        cycleEquipmentStatus,
        updatePropertyStatus,
        toggleBranchComplianceItem,
        settleRoyaltyTransaction,
        createAppointment,
        rescheduleAppointment,
        updateToothCondition,
        createReferral,
        advanceReferralStatus,
        savePrescription,
        completeVisitAndDeliver,
        resetDemoData,
      }}
    >
      {children}
    </DentAiContext.Provider>
  );
}

export function useDentAi() {
  const ctx = useContext(DentAiContext);
  if (!ctx) {
    throw new Error("useDentAi must be used within a DentAiProvider");
  }
  return ctx;
}
