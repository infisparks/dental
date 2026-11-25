"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Sparkles,
  Mic,
  CheckCircle2,
  Share2,
  FileCheck2,
  ScanLine,
  MessageSquare,
  HeartPulse,
  History,
  CreditCard,
  Send,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type {
  Branch,
  DeliveryLogEvent,
  PrescriptionRecord,
  ToothCondition,
} from "@/types/dentai";
import { ReferComplexCaseModal } from "@/components/clinic/ReferralsTrackerTab";
import { FinalizeInvoiceModal } from "@/components/clinic/FinalizeInvoiceModal";

interface PatientEdrWorkspaceProps {
  branch: Branch;
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
}

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

const CONDITION_STYLES: Record<ToothCondition, string> = {
  Healthy: "bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#2563EB]",
  Cavity: "bg-amber-50 text-[#F59E0B] border-amber-300 font-bold",
  "Root Canal Needed":
    "bg-rose-50 text-[#F43F5E] border-rose-300 font-bold",
  Crown: "bg-[#EFF6FF] text-[#2563EB] border-blue-300 font-bold",
  Extracted:
    "bg-slate-100 text-slate-400 border-slate-300 line-through opacity-75",
};

const CONDITION_OPTIONS: Array<{
  condition: ToothCondition;
  label: string;
  priceHint: string;
}> = [
  { condition: "Healthy", label: "Healthy", priceHint: "₹0" },
  { condition: "Cavity", label: "Cavity", priceHint: "+₹4,500" },
  {
    condition: "Root Canal Needed",
    label: "Root Canal Needed",
    priceHint: "+₹1,00,000",
  },
  { condition: "Crown", label: "Crown", priceHint: "+₹35,000" },
  { condition: "Extracted", label: "Extracted", priceHint: "+₹8,500" },
];

export function PatientEdrWorkspace({
  branch,
  selectedPatientId,
  onSelectPatient,
}: PatientEdrWorkspaceProps) {
  const {
    patients,
    prescriptions,
    deliveryLogs,
    updateToothCondition,
    savePrescription,
    completeVisitAndDeliver,
  } = useDentAi();

  const patient =
    patients.find((p) => p.id === selectedPatientId) ?? patients[0];

  const [edrSubTab, setEdrSubTab] = useState<"chart" | "history">("chart");
  const [selectedTooth, setSelectedTooth] = useState<number>(36);
  const [aiScanEnabled, setAiScanEnabled] = useState<boolean>(false);

  // Modals
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [lastDelivery, setLastDelivery] = useState<DeliveryLogEvent | null>(
    null
  );

  // AI Doctor Assistant state
  const [dictating, setDictating] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string>(
    "Ready. Tap any quick-prompt below or run Voice-to-Prescription for allergy-checked clinical guidance."
  );

  const currentRx = prescriptions[patient.id];
  const hasRealAllergy =
    patient.allergies.length > 0 && patient.allergies[0] !== "None Known";

  const totalPlanCost = patient.treatmentPlan.reduce((s, t) => s + t.cost, 0);

  const handleVoiceToRx = () => {
    setDictating(true);
    setTimeout(() => {
      const generated: PrescriptionRecord = {
        id: `rx-${Date.now()}`,
        patientId: patient.id,
        medicines: [
          {
            name: hasRealAllergy
              ? "Tab. Clindamycin 300mg (Allergy-Safe Alternative)"
              : "Tab. Amoxicillin 500mg + Clavulanate 125mg",
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
          "BajajDent Nano-Hydroxyapatite Desensitizing Paste",
          "BajajSteril Chlorhexidine 0.2% Mouthwash",
          "Post-Procedure Ultra-Soft Recovery Brush",
        ],
        advice:
          "Soft lukewarm diet for 24 hrs. Avoid biting directly on treated quadrant.",
        generatedAt: "Just now (Voice-to-Rx)",
      };
      savePrescription(patient.id, generated);
      setDictating(false);
    }, 850);
  };

  const handleQuickPrompt = (promptKey: string) => {
    if (promptKey === "interactions") {
      setAiAnswer(
        hasRealAllergy
          ? `ALERT: ${patient.name} has documented allergy (${patient.allergies.join(
              ", "
            )}). Avoid Beta-Lactams/NSAIDs where flagged; Clindamycin 300mg + Paracetamol is safe with ${patient.medicalHistory[0]}.`
          : `No major drug allergies recorded. Standard Amoxicillin-Clavulanate + Aceclofenac protocol is compatible with ${patient.medicalHistory[0]}.`
      );
    } else if (promptKey === "history") {
      setAiAnswer(
        `${patient.name} has ${patient.visitHistory.length} recorded visits (${patient.visitHistory
          .map((v) => v.procedure)
          .slice(0, 2)
          .join("; ")}). Last visit: ${patient.lastVisit}.`
      );
    } else if (promptKey === "explain") {
      setAiAnswer(
        `Patient-Friendly Script: "Your X-ray shows deep decay reaching the nerve in tooth #${selectedTooth}. Our painless single-sitting rotary treatment cleans it in 40 minutes, and a Zirconia crown protects it for 15+ years."`
      );
    } else {
      const emi12 = Math.round((totalPlanCost || 100000) / 12);
      setAiAnswer(
        `0% No-Cost EMI Pitch: For a ${formatINR(
          totalPlanCost || 100000
        )} plan, offer ${formatINR(
          emi12
        )}/month for 12 months via Bajaj Finserv Health (Instant soft-pull approval in Patient PWA).`
      );
    }
  };

  const handleCompleteVisit = () => {
    const evt = completeVisitAndDeliver({
      patientId: patient.id,
      branchId: branch.id,
      totalAmount: totalPlanCost || patient.outstandingBalance || 100000,
    });
    setLastDelivery(evt);
    setInvoiceModalOpen(true);
  };

  const renderToothButton = (num: number) => {
    const cond = patient.toothChart[num] ?? "Healthy";
    const isSelected = selectedTooth === num;
    return (
      <button
        key={num}
        onClick={() => setSelectedTooth(num)}
        title={`Tooth #${num}: ${cond}`}
        className={cn(
          "h-12 w-full rounded-lg border text-[11px] flex flex-col items-center justify-center transition-all cursor-pointer relative",
          CONDITION_STYLES[cond],
          isSelected && "ring-2 ring-[#2563EB] ring-offset-1"
        )}
      >
        <span className="leading-none">{num}</span>
        <span className="text-[9px] mt-1 opacity-80 leading-none truncate max-w-[90%]">
          {cond === "Healthy"
            ? "OK"
            : cond === "Root Canal Needed"
            ? "RCT"
            : cond === "Cavity"
            ? "CAV"
            : cond === "Crown"
            ? "CRN"
            : "EXT"}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Patient Selector Strip */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-3 shadow-2xs flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 uppercase px-2 shrink-0">
          Patient EDR:
        </span>
        {patients.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPatient(p.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
              p.id === patient.id
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "bg-[#F8FAFC] text-slate-600 hover:text-[#0F172A] border border-[#E2E8F0]"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Patient Header + Primary Workflow Actions */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">{patient.name}</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
              {patient.age} yrs • {patient.gender} • {patient.segment}
            </span>
            {hasRealAllergy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-[#F43F5E] border border-rose-200">
                <AlertTriangle className="h-3 w-3" />
                Allergy: {patient.allergies.join(", ")}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>{patient.phone}</span>
            <span>{patient.email}</span>
            <span>Medical: {patient.medicalHistory.join(" • ")}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setReferModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 text-xs font-semibold text-[#0F172A] cursor-pointer transition-colors"
          >
            <Share2 className="h-3.5 w-3.5 text-[#2563EB]" />
            Refer Complex Case
          </button>

          <button
            onClick={handleCompleteVisit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <FileCheck2 className="h-4 w-4" />
            Complete Visit &amp; Finalize Bill
          </button>
        </div>
      </div>

      {/* Main Split: Left 2/3 EDR & Tooth Chart | Right 1/3 AI Doctor Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols */}
        <div className="xl:col-span-8 space-y-6">
          {/* EDR Inner Tabs */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-1.5 shadow-2xs inline-flex gap-1">
            <button
              onClick={() => setEdrSubTab("chart")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                edrSubTab === "chart"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Interactive Tooth Chart &amp; AI X-Ray
            </button>
            <button
              onClick={() => setEdrSubTab("history")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                edrSubTab === "history"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Demographics, Medical History &amp; Billing
            </button>
          </div>

          {edrSubTab === "chart" ? (
            <>
              {/* Interactive Dental Tooth Chart */}
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      Interactive FDI Dental Chart (Click Any Tooth)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mark tooth condition to auto-populate procedure &amp; ₹
                      estimate in the Treatment Plan
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-medium">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-[#F59E0B] border border-amber-200">
                      CAV: Cavity
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-[#F43F5E] border border-rose-200">
                      RCT: Root Canal
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
                      CRN: Crown
                    </span>
                  </div>
                </div>

                {/* Upper Jaw */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Upper Arch (Maxillary)
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                    {UPPER_RIGHT.map(renderToothButton)}
                    {UPPER_LEFT.map(renderToothButton)}
                  </div>
                </div>

                {/* Lower Jaw */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Lower Arch (Mandibular)
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                    {LOWER_RIGHT.map(renderToothButton)}
                    {LOWER_LEFT.map(renderToothButton)}
                  </div>
                </div>

                {/* Selected Tooth Condition Picker */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Selected: Tooth #{selectedTooth} (Current:{" "}
                      <span className="text-[#2563EB]">
                        {patient.toothChart[selectedTooth] ?? "Healthy"}
                      </span>
                      )
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Select a clinical finding to auto-update Treatment Plan
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITION_OPTIONS.map((opt) => {
                      const active =
                        (patient.toothChart[selectedTooth] ?? "Healthy") ===
                        opt.condition;
                      return (
                        <button
                          key={opt.condition}
                          onClick={() =>
                            updateToothCondition(
                              patient.id,
                              selectedTooth,
                              opt.condition
                            )
                          }
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors",
                            active
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-white text-slate-700 border-[#E2E8F0] hover:border-[#2563EB]"
                          )}
                        >
                          {opt.label}{" "}
                          <span className="opacity-75">({opt.priceHint})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auto-Updated Treatment Plan */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#0F172A]">
                      Live Treatment Plan &amp; Cost Estimate
                    </span>
                    <span className="text-sm font-bold text-[#2563EB]">
                      Total: {formatINR(totalPlanCost)}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-slate-500">
                        <tr>
                          <th className="py-2 px-3">Tooth</th>
                          <th className="py-2 px-3">Procedure</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patient.treatmentPlan.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-4 px-3 text-center text-slate-400"
                            >
                              Click any tooth above to add a treatment procedure
                            </td>
                          </tr>
                        ) : (
                          patient.treatmentPlan.map((tp) => (
                            <tr key={tp.id}>
                              <td className="py-2 px-3 font-mono font-semibold text-[#2563EB]">
                                {tp.toothNumber ? `#${tp.toothNumber}` : "Arch"}
                              </td>
                              <td className="py-2 px-3 font-medium text-[#0F172A]">
                                {tp.procedure}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                    tp.status === "Completed"
                                      ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                                      : "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                                  )}
                                >
                                  {tp.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-right font-semibold text-[#0F172A]">
                                {formatINR(tp.cost)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* AI Dental X-Ray / OPG Pre-Screening Viewer */}
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                      <ScanLine className="h-4 w-4 text-[#4F46E5]" />
                      AI Dental X-Ray / OPG Pre-Screening
                    </h3>
                    <p className="text-xs text-slate-500">
                      DentAI Vision v4.2 automated caries &amp; periapical lesion
                      overlay
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => setAiScanEnabled((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all self-start",
                      aiScanEnabled
                        ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs"
                        : "bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:border-[#4F46E5]"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      {aiScanEnabled
                        ? "AI Pre-Screening: ON"
                        : "Run AI Pre-Screening"}
                    </span>
                  </button>
                </div>

                {/* Radiograph Canvas */}
                <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden h-[240px] flex items-center justify-center">
                  {/* Stylized OPG Radiograph SVG */}
                  <svg
                    viewBox="0 0 600 220"
                    className="w-full h-full opacity-90"
                    aria-label="Sample Dental OPG Radiograph"
                  >
                    <defs>
                      <radialGradient id="xrayGlow" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#020617" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="220" fill="url(#xrayGlow)" />
                    {/* Upper Arch Silhouettes */}
                    {[...Array(14)].map((_, i) => {
                      const x = 90 + i * 31;
                      const curveY = 58 + Math.abs(6.5 - i) * 2.2;
                      return (
                        <g key={`u-${i}`} opacity="0.72">
                          <rect
                            x={x}
                            y={curveY}
                            width="20"
                            height="28"
                            rx="5"
                            fill="#94A3B8"
                          />
                          <path
                            d={`M${x + 4},${curveY} L${x + 8},${
                              curveY - 20
                            } L${x + 12},${curveY} Z`}
                            fill="#CBD5E1"
                            opacity="0.65"
                          />
                        </g>
                      );
                    })}
                    {/* Lower Arch Silhouettes */}
                    {[...Array(14)].map((_, i) => {
                      const x = 90 + i * 31;
                      const curveY = 126 - Math.abs(6.5 - i) * 2.1;
                      return (
                        <g key={`l-${i}`} opacity="0.72">
                          <rect
                            x={x}
                            y={curveY}
                            width="20"
                            height="28"
                            rx="5"
                            fill="#94A3B8"
                          />
                          <path
                            d={`M${x + 4},${curveY + 28} L${x + 8},${
                              curveY + 52
                            } L${x + 12},${curveY + 28} Z`}
                            fill="#CBD5E1"
                            opacity="0.65"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Top-left Metadata Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                    OPG • {patient.name} • 72 kVp / 10 mA
                  </div>

                  {/* Animated AI Bounding Boxes when toggled ON */}
                  {aiScanEnabled && (
                    <>
                      {/* Cavity Zone (#14) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: [0.85, 1, 0.85],
                          scale: [1, 1.03, 1],
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute left-[27%] top-[24%] w-[95px] h-[58px] rounded-lg border-2 border-[#F59E0B] bg-amber-500/15 flex items-start justify-start p-1"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-[#F59E0B] text-white text-[9px] font-bold whitespace-nowrap">
                          #14 Cavity • 94.8%
                        </span>
                      </motion.div>

                      {/* Root Canal Zone (#36) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: [0.85, 1, 0.85],
                          scale: [1, 1.04, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: 0.4,
                        }}
                        className="absolute right-[18%] bottom-[16%] w-[125px] h-[72px] rounded-lg border-2 border-[#F43F5E] bg-rose-500/20 flex items-end justify-start p-1"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-[#F43F5E] text-white text-[9px] font-bold whitespace-nowrap">
                          #36 RCT Zone • 97.4%
                        </span>
                      </motion.div>
                    </>
                  )}
                </div>

                {aiScanEnabled && (
                  <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-4 space-y-1.5">
                    <div className="text-xs font-semibold text-[#4F46E5] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Plain-English Patient Explanation
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      &ldquo;Our AI scan highlighted two areas: a{" "}
                      <strong>3.2mm deep nerve infection under lower molar #36</strong>{" "}
                      (red box) which can be saved painlessly with a single-sitting
                      Root Canal + Zirconia Crown, and{" "}
                      <strong>early enamel decay on upper premolar #14</strong>{" "}
                      (amber box) treatable with a quick tooth-colored filling.&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Demographics, Medical History & Visit Billing Tab */
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4 text-[#F43F5E]" />
                    Allergies &amp; Systemic Medical History
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Allergies:</strong> {patient.allergies.join(", ")}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Conditions:</strong>{" "}
                    {patient.medicalHistory.join(", ")}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-[#2563EB]" />
                    Account &amp; Loyalty Summary
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Registered Branch:</strong> {patient.branchName}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>SmilePoints Balance:</strong>{" "}
                    <span className="font-semibold text-[#2563EB]">
                      {patient.loyaltyPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5 mb-3">
                  <History className="h-4 w-4 text-[#2563EB]" />
                  Past Visits &amp; Billing History
                </h3>
                <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-slate-500">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Procedure</th>
                        <th className="py-2 px-3">Doctor &amp; Clinic</th>
                        <th className="py-2 px-3 text-right">Billed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patient.visitHistory.map((vh) => (
                        <tr key={vh.id}>
                          <td className="py-2.5 px-3 text-slate-500">
                            {vh.date}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[#0F172A]">
                            {vh.procedure}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {vh.doctor} ({vh.branchName})
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-[#0F172A]">
                            {formatINR(vh.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {deliveryLogs.filter((d) => d.patientId === patient.id).length >
                0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="text-xs font-semibold text-[#10B981]">
                    Automated Delivery Events (Today)
                  </div>
                  {deliveryLogs
                    .filter((d) => d.patientId === patient.id)
                    .map((dlv) => (
                      <div key={dlv.id} className="text-xs text-slate-700">
                        ✓ {dlv.timestamp} — Invoice {formatINR(dlv.invoiceAmount)}{" "}
                        &amp; Rx delivered via {dlv.channels.join(", ")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Cols: AI Doctor Assistant Side-Panel */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-[#FFFFFF] rounded-xl border border-indigo-200 p-5 shadow-2xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-xs font-semibold text-[#4F46E5] border border-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                AI Doctor Assistant
              </div>
              <span className="text-[11px] text-slate-400">Clinical Co-Pilot</span>
            </div>

            {/* 3-Bullet AI Summary + Allergy Alert */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="text-xs font-semibold text-[#0F172A]">
                3-Bullet Patient Brief
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc pl-4">
                <li>
                  <strong>Active Focus:</strong> {patient.activeTreatment}
                </li>
                <li>
                  <strong>Systemic Profile:</strong>{" "}
                  {patient.medicalHistory[0] ?? "No systemic conditions"}
                </li>
                <li>
                  <strong>Retention &amp; Value:</strong> {patient.segment} tier
                  with {patient.loyaltyPoints} SmilePoints
                </li>
              </ul>
              {hasRealAllergy && (
                <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-semibold text-[#F43F5E] flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Allergy Guard: {patient.allergies.join(", ")}
                </div>
              )}
            </div>

            {/* Voice-to-Prescription Simulator */}
            <div className="space-y-2.5 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={handleVoiceToRx}
                disabled={dictating}
                className={cn(
                  "w-full py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-all",
                  dictating
                    ? "bg-rose-50 text-[#F43F5E] border border-rose-200 animate-pulse"
                    : "bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-xs"
                )}
              >
                <Mic className="h-4 w-4" />
                {dictating
                  ? "Listening & Structuring Rx..."
                  : "Voice-to-Prescription (Simulate)"}
              </button>

              {currentRx && (
                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#4F46E5]">
                      Structured Digital Rx
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {currentRx.generatedAt}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    {currentRx.medicines.map((m, idx) => (
                      <div key={idx}>
                        • <strong>{m.name}</strong> ({m.dosage})
                      </div>
                    ))}
                  </div>
                  <div className="pt-1.5 border-t border-indigo-200/70">
                    <div className="font-semibold text-[#2563EB] mb-0.5">
                      Prescribed D2C Self-Care Kit:
                    </div>
                    {currentRx.d2cSelfCareKit.map((k, idx) => (
                      <div key={idx} className="text-slate-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-[#10B981] shrink-0" />
                        {k}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Prompt Clinical Q&A */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#2563EB]" />
                Ask AI Clinical Co-Pilot
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ["interactions", "Drug Interactions"],
                  ["history", "Last 3 Visits"],
                  ["explain", "Patient RCT Script"],
                  ["emi", "0% EMI Pitch"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleQuickPrompt(key)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4F46E5] hover:text-[#4F46E5] text-[11px] font-medium text-slate-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="truncate">{label}</span>
                    <Send className="h-2.5 w-2.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-slate-700 leading-relaxed">
                {aiAnswer}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialist Referral Modal */}
      <ReferComplexCaseModal
        key={patient.id}
        open={referModalOpen}
        onClose={() => setReferModalOpen(false)}
        patient={patient}
        branch={branch}
      />

      {/* Finalize Visit & Auto-Delivery Invoice/Rx PDF Preview Modal */}
      <FinalizeInvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        patient={patient}
        branch={branch}
        prescription={currentRx}
        deliveryEvent={lastDelivery}
      />
    </div>
  );
}
