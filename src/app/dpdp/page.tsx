"use client";

import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileWarning,
  CheckCircle2,
  Download,
  Search,
  Baby,
  Siren,
  KeyRound,
  Clock,
  X,
  AlertTriangle,
  TicketCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import type { DpdpConsent } from "@/types/dentai";

const CONSENT_KEYS: Array<{
  key: keyof Omit<DpdpConsent, "updatedAt">;
  label: string;
  purpose: string;
}> = [
  { key: "treatment", label: "Clinical Care", purpose: "Clinical Care" },
  { key: "aiDiagnostics", label: "AI X-Ray", purpose: "AI Diagnostics" },
  { key: "marketing", label: "Marketing", purpose: "WhatsApp Marketing" },
  { key: "financing", label: "Fintech KYC", purpose: "Fintech KYC" },
];

export default function DpdpCompliancePage() {
  const {
    patients,
    dpdpLogs,
    securityLogs,
    dpdpTickets,
    toggleDpdpConsent,
    resolveDpdpTicket,
    logGuardianConsent,
    recordSecurityExport,
  } = useDentAi();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Withdrawn"
  >("All");
  const [sdkTenant, setSdkTenant] = useState<
    "dentai" | "muthoot" | "mcgm" | "ministry"
  >("dentai");

  // Minor (<18) Verifiable Guardian Consent Modal
  const [guardianOpen, setGuardianOpen] = useState(false);
  const [minorName, setMinorName] = useState("Vivaan Malhotra");
  const [minorDob, setMinorDob] = useState("2012-05-14");
  const [guardianName, setGuardianName] = useState("Rajesh Malhotra");
  const [guardianRelation, setGuardianRelation] = useState("Father");
  const [guardianPhone, setGuardianPhone] = useState("+91 98201 77432");
  const [guardianOtpVerified, setGuardianOtpVerified] = useState(false);

  // 72-Hour Breach Simulator Modal
  const [breachOpen, setBreachOpen] = useState(false);
  const [breachChecks, setBreachChecks] = useState<Record<string, boolean>>({
    b1: true,
    b2: true,
    b3: false,
    b4: false,
  });

  // Compute age from DOB relative to 2026-11-25
  const computedAge = useMemo(() => {
    const dob = new Date(minorDob);
    if (Number.isNaN(dob.getTime())) return 25;
    const ref = new Date("2026-11-25");
    let age = ref.getFullYear() - dob.getFullYear();
    const m = ref.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) age -= 1;
    return age;
  }, [minorDob]);

  const isMinor = computedAge < 18;

  // Build searchable Granular Consent Ledger rows
  const ledgerRows = useMemo(() => {
    const rows: Array<{
      id: string;
      patientId: string;
      patientName: string;
      purpose: string;
      consentKey: keyof Omit<DpdpConsent, "updatedAt">;
      version: string;
      timestamp: string;
      status: "Active" | "Withdrawn";
    }> = [];

    patients.forEach((p) => {
      CONSENT_KEYS.forEach((ck) => {
        const active = p.dpdpConsent[ck.key];
        rows.push({
          id: `${p.id}-${ck.key}`,
          patientId: p.id,
          patientName: p.name,
          purpose: ck.purpose,
          consentKey: ck.key,
          version: ck.key === "financing" ? "v2.4" : "v2.3",
          timestamp: p.dpdpConsent.updatedAt,
          status: active ? "Active" : "Withdrawn",
        });
      });
    });

    const q = searchQuery.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === "All" || r.status === statusFilter;
      const matchesQuery =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [patients, searchQuery, statusFilter]);

  const handleExport = (format: "CSV" | "JSON") => {
    let content = "";
    let mime = "text/plain;charset=utf-8";
    if (format === "CSV") {
      const header = "PatientName,Purpose,ConsentVersion,Timestamp,Status\n";
      const lines = ledgerRows
        .map(
          (r) =>
            `"${r.patientName}","${r.purpose}","${r.version}","${r.timestamp}","${r.status}"`
        )
        .join("\n");
      content = header + lines;
      mime = "text/csv;charset=utf-8";
    } else {
      content = JSON.stringify(
        {
          exportedAt: "2026-11-25T21:00:00+05:30",
          dpo: "Vikram Kulkarni",
          act: "Digital Personal Data Protection Act, 2023",
          records: ledgerRows,
          auditTrail: dpdpLogs,
        },
        null,
        2
      );
      mime = "application/json;charset=utf-8";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DentAI-DPDP-Audit-Ledger.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
    recordSecurityExport(format);
  };

  const handleDownloadBreachPacket = () => {
    const packet = {
      documentType: "DPDP Act 2023 Sec 8(6) — 72-Hour Breach Notification Packet",
      dataFiduciary: "DentAI Pro — Dr. Bajaj Dental Network Pvt Ltd",
      dpo: "Vikram Kulkarni (dpo@dentai.in)",
      incidentId: "INC-2026-72H-01",
      detectedAt: "2026-11-25 20:55 IST",
      regulatoryDeadline: "2026-11-28 20:55 IST (72 Hours)",
      affectedPrincipalsCount: 3420,
      clinicalXrayExposure: "0 files (Encrypted AES-256-GCM at rest)",
      remediationChecklist: breachChecks,
      authoritiesNotified: [
        "Data Protection Board of India (DPB)",
        "CERT-In (Indian Computer Emergency Response Team)",
      ],
    };
    const blob = new Blob([JSON.stringify(packet, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DPB-India-72Hr-Breach-Notice-Packet.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data Protection Board Notice Packet Downloaded", {
      description: "72-hour regulatory filing packet generated & archived.",
    });
  };

  const openTickets = dpdpTickets.filter((t) => t.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Mandatory May 13, 2027 Readiness Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            DPDP Act 2023 • Mandatory Deadline: May 13, 2027
          </div>
          <h1 className="text-lg lg:text-xl font-bold">
            98% Compliance Ready — ₹250 Cr Penalty Protection Shield Active
          </h1>
          <p className="text-xs text-blue-100">
            Modular Standalone DPDP SaaS / SDK •{" "}
            {sdkTenant === "dentai"
              ? "DentAI Pro (104 Clinics)"
              : sdkTenant === "muthoot"
              ? "Muthoot Finance Enterprise NBFC Pipeline"
              : sdkTenant === "mcgm"
              ? "MCGM Hospitals Mumbai (Gov Tender Mode)"
              : "Ministry of Health Sandbox Deployment"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setGuardianOtpVerified(false);
              setGuardianOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-bold cursor-pointer transition-colors"
          >
            <Baby className="h-4 w-4" />
            Minor (&lt;18) Guardian Workflow
          </button>
          <button
            onClick={() => setBreachOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F43F5E] hover:bg-rose-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Siren className="h-4 w-4" />
            Simulate Breach Incident
          </button>
        </div>
      </div>

      {/* Point 3: Standalone Enterprise & Gov DPDP SaaS/SDK Switcher */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-[#0F172A]">
            Modular DPDP Compliance SaaS / SDK (Enterprise &amp; Gov Pipeline)
          </div>
          <div className="text-[11px] text-slate-500">
            Switch tenant profile to preview drop-in SDK deployment for BFSI,
            Municipal Hospitals &amp; Government Healthcare
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["dentai", "DentAI Pro (104 Clinics)"],
              ["muthoot", "Muthoot Finance (NBFC)"],
              ["mcgm", "MCGM Hospitals (Mumbai)"],
              ["ministry", "Healthcare Ministry"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setSdkTenant(id);
                toast.info(`Switched DPDP SDK Tenant: ${label}`);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                sdkTenant === id
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0] hover:text-[#0F172A]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Penalty Protection Score</span>
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">98.0%</div>
          <div className="mt-1 text-xs text-[#10B981] font-medium">
            ₹250 Cr Statutory Shield
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Granular Consent Records</span>
            <Lock className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {ledgerRows.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {ledgerRows.filter((r) => r.status === "Withdrawn").length} Withdrawn
            (Auto-Suppressed)
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Encryption &amp; RBAC Logs</span>
            <KeyRound className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            AES-256
          </div>
          <div className="mt-1 text-xs text-[#4F46E5] font-medium">
            {securityLogs.length} Verified Access Events
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Data Principal Tickets</span>
            <FileWarning className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {openTickets} Open
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Correction • Erasure • Grievance
          </div>
        </div>
      </div>

      {/* Granular Consent Ledger Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Granular Consent Ledger (Live Sync with Patient PWA)
            </h2>
            <p className="text-xs text-slate-500">
              Click status pill to toggle consent or export tamper-proof
              CSV/JSON audit ledger
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient or purpose..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:bg-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg">
              {(["All", "Active", "Withdrawn"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                    statusFilter === st
                      ? "bg-[#2563EB] text-white"
                      : "text-slate-600"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport("JSON")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[340px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Patient Name</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Consent Version</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Status (Toggle)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-[#0F172A]">
                    {row.patientName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{row.purpose}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#2563EB]">
                    {row.version}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {row.timestamp}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() =>
                        toggleDpdpConsent(
                          row.patientId,
                          row.consentKey,
                          "DPO Vikram Kulkarni"
                        )
                      }
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors",
                        row.status === "Active"
                          ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                          : "bg-rose-50 text-[#F43F5E] border-rose-200"
                      )}
                    >
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Access Logs + Retention & DPO Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Security & Access Audit Logs */}
        <div className="xl:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Security &amp; RBAC Access Audit Logs
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
              <KeyRound className="h-3 w-3" />
              AES-256-GCM Enforced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2 px-3">User &amp; RBAC Role</th>
                  <th className="py-2 px-3">Action &amp; Record</th>
                  <th className="py-2 px-3">Encryption</th>
                  <th className="py-2 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#0F172A]">
                        {sec.user}
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold">
                        {sec.rbacRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#0F172A]">
                        {sec.action}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sec.patientRecord}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-[#10B981] font-semibold">
                      {sec.encryption}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[11px] text-slate-400 whitespace-nowrap">
                      {sec.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Retention Scheduler + DPO Grievance Tickets */}
        <div className="xl:col-span-5 space-y-6">
          {/* Automated Retention Scheduler */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#2563EB]" />
                Automated Retention Scheduler
              </h2>
              <span className="text-[11px] font-semibold text-[#10B981]">
                Auto-Purge Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ["Clinical EDR & OPG X-Rays", "7 Yrs (ICMR Statutory)"],
                ["Pharma Camp Unconverted Leads", "180 Days Auto-Purge"],
                ["Fintech KYC Tokens", "Zero Storage (Pass-Through)"],
              ].map(([policy, rule]) => (
                <div
                  key={policy}
                  className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2"
                >
                  <span className="font-medium text-[#0F172A]">{policy}</span>
                  <span className="text-[11px] font-semibold text-[#2563EB]">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DPO Grievance & Data Rights Tickets */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
            <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-1.5">
              <TicketCheck className="h-4 w-4 text-[#2563EB]" />
              DPO Rights &amp; Grievance Tickets ({dpdpTickets.length})
            </h2>
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {dpdpTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#2563EB]">
                        {tkt.ticketNumber}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-[#4F46E5] text-[10px] font-semibold">
                        {tkt.type}
                      </span>
                    </div>
                    <div className="font-semibold text-[#0F172A] mt-0.5">
                      {tkt.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tkt.details}
                    </div>
                  </div>
                  {tkt.status === "Resolved" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200 shrink-0">
                      Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveDpdpTicket(tkt.id)}
                      className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verifiable Guardian Consent Right Sidebar (Minors < 18) */}
      {guardianOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-lg h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#2563EB]">
                  DPDP Act 2023 Sec 9 Compliance
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Verifiable Guardian Consent Workflow (&lt; 18 yrs)
                </h3>
              </div>
              <button
                onClick={() => setGuardianOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={minorName}
                    onChange={(e) => setMinorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date of Birth (Calculated Age: {computedAge} yrs)
                  </label>
                  <input
                    type="date"
                    value={minorDob}
                    onChange={(e) => {
                      setMinorDob(e.target.value);
                      setGuardianOtpVerified(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
              </div>

              {isMinor ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#F43F5E] font-semibold flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      Standard Self-Onboarding Blocked: Patient is {computedAge}{" "}
                      years old (&lt;18). Verifiable Parent/Guardian Consent +
                      OTP is mandatory under DPDP Sec 9.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Relationship *
                      </label>
                      <select
                        value={guardianRelation}
                        onChange={(e) => setGuardianRelation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Guardian Aadhaar / Mobile for OTP *
                    </label>
                    <input
                      type="text"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                    />
                  </div>

                  {guardianOtpVerified ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#10B981] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Guardian OTP Verified! Minor Onboarding Unlocked &amp;
                      Logged.
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setGuardianOtpVerified(true);
                        logGuardianConsent({
                          minorName,
                          dob: minorDob,
                          guardianName,
                          relationship: guardianRelation,
                        });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
                    >
                      Send &amp; Verify Guardian OTP
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#10B981] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Patient is {computedAge} years old (Adult). Standard consent
                  workflow allowed.
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setGuardianOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 72-Hour Data Breach Simulator Right Sidebar */}
      {breachOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-xl h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F43F5E] flex items-center gap-1.5">
                  <Siren className="h-4 w-4" />
                  72-Hour DPDP Regulatory Breach Protocol
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Incident Impact &amp; Data Protection Board Notice Simulator
                </h3>
              </div>
              <button
                onClick={() => setBreachOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[10px] text-slate-400">
                    Affected Users
                  </div>
                  <div className="text-base font-bold text-[#F43F5E]">
                    3,420
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[10px] text-slate-400">
                    X-Ray Exposure
                  </div>
                  <div className="text-base font-bold text-[#10B981]">
                    0 (AES-256)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[10px] text-slate-400">
                    DPB SLA Window
                  </div>
                  <div className="text-base font-bold text-[#2563EB]">
                    71h 48m
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-[#0F172A]">
                  Mandatory 72-Hour Response Checklist
                </div>
                {[
                  ["b1", "Revoke compromised API credentials & rotate KMS keys"],
                  ["b2", "Generate CERT-In & forensic telemetry snapshot"],
                  [
                    "b3",
                    "Submit Form-B Notice to Data Protection Board of India",
                  ],
                  [
                    "b4",
                    "Dispatch plain-language SMS/Email notice to 3,420 principals",
                  ],
                ].map(([key, label]) => {
                  const checked = !!breachChecks[key];
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setBreachChecks((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      className={cn(
                        "w-full text-left p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer",
                        checked
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-white border-[#E2E8F0]"
                      )}
                    >
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4 shrink-0",
                          checked ? "text-[#10B981]" : "text-slate-300"
                        )}
                      />
                      <span className="font-medium text-[#0F172A]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap justify-end gap-2">
              <button
                onClick={handleDownloadBreachPacket}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download Data Protection Board Notice Packet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
