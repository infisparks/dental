"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  Edit3,
  Trash2,
  MessageSquareWarning,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import type { DpdpTicket, Patient } from "@/types/dentai";

export function PatientPrivacyTab({ patient }: { patient: Patient }) {
  const { toggleDpdpConsent, createDpdpTicket } = useDentAi();

  const [dataExportOpen, setDataExportOpen] = useState(false);
  const [ticketModalType, setTicketModalType] = useState<
    DpdpTicket["type"] | null
  >(null);
  const [ticketDetails, setTicketDetails] = useState("");

  const exportPayload = {
    dataPrincipal: {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      city: patient.city,
      registeredBranch: patient.branchName,
    },
    clinicalProfile: {
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory,
      activeTreatment: patient.activeTreatment,
      visitCount: patient.visitHistory.length,
    },
    dpdpConsentState: patient.dpdpConsent,
    statutoryNote: "Exported under DPDP Act 2023 Section 11 (Right to Access)",
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.id}-My-DentAI-Data.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Personal Data Archive Downloaded (JSON)");
  };

  const handleOpenTicketModal = (type: DpdpTicket["type"]) => {
    setTicketModalType(type);
    if (type === "Data Correction") {
      setTicketDetails("Update residential pin code to 400050 (Bandra West).");
    } else if (type === "Account Erasure") {
      setTicketDetails(
        "Request erasure of non-statutory marketing & promotional records under DPDP Sec 12."
      );
    } else {
      setTicketDetails(
        "Need clarification on third-party NBFC soft-pull timestamp."
      );
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketModalType || !ticketDetails.trim()) return;
    createDpdpTicket({
      patientId: patient.id,
      patientName: patient.name,
      type: ticketModalType,
      details: ticketDetails.trim(),
    });
    setTicketModalType(null);
  };

  return (
    <div className="space-y-4">
      {/* Granular Consent Controls */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
          <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
          My Privacy &amp; Consent Controls (DPDP Act 2023)
        </div>
        <p className="text-[11px] text-slate-500">
          Changes sync immediately with the DPO Compliance Console &amp; stop
          automated processing.
        </p>

        {(
          [
            ["treatment", "Core Clinical Dental Care"],
            ["aiDiagnostics", "AI X-Ray & OPG Diagnostics"],
            ["marketing", "WhatsApp / SMS Marketing & Recall"],
            ["financing", "Third-Party Fintech / NBFC Sharing"],
          ] as const
        ).map(([key, label]) => {
          const enabled = patient.dpdpConsent[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-t border-slate-100 text-xs"
            >
              <span className="text-slate-700 font-medium pr-2">{label}</span>
              <button
                onClick={() => toggleDpdpConsent(patient.id, key)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors border shrink-0",
                  enabled
                    ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                    : "bg-rose-50 text-[#F43F5E] border-rose-200"
                )}
              >
                {enabled ? "Granted" : "Withdrawn"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Self-Service Data Rights Actions */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 space-y-2.5 shadow-2xs">
        <div className="text-xs font-bold text-[#0F172A]">
          My Statutory Data Rights
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => setDataExportOpen(true)}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] text-left flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <Download className="h-4 w-4 text-[#2563EB] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#0F172A]">
                Download My Data
              </div>
              <div className="text-[10px] text-slate-500">
                Right to Access (JSON/PDF)
              </div>
            </div>
          </button>

          <button
            onClick={() => handleOpenTicketModal("Data Correction")}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] text-left flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <Edit3 className="h-4 w-4 text-[#2563EB] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#0F172A]">
                Request Data Correction
              </div>
              <div className="text-[10px] text-slate-500">
                Update profile / clinical info
              </div>
            </div>
          </button>

          <button
            onClick={() => handleOpenTicketModal("Account Erasure")}
            className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <Trash2 className="h-4 w-4 text-[#F43F5E] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#F43F5E]">
                Request Account Erasure
              </div>
              <div className="text-[10px] text-slate-500">
                Right to Erasure (Sec 12)
              </div>
            </div>
          </button>

          <button
            onClick={() => handleOpenTicketModal("DPO Grievance")}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4F46E5] text-left flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <MessageSquareWarning className="h-4 w-4 text-[#4F46E5] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#0F172A]">
                File Grievance with DPO
              </div>
              <div className="text-[10px] text-slate-500">
                Direct escalation to DPO
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Download My Data Preview Bottom Sheet */}
      {dataExportOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-2">
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <span className="text-xs font-bold text-[#0F172A]">
                Right to Access — Personal Data Export
              </span>
              <button
                onClick={() => setDataExportOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="p-4 text-[10px] font-mono bg-slate-950 text-emerald-300 max-h-[300px] overflow-y-auto">
              {JSON.stringify(exportPayload, null, 2)}
            </pre>
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                onClick={() => setDataExportOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction / Erasure / Grievance Bottom Sheet */}
      {ticketModalType && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitTicket}
            className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-2"
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <span className="text-sm font-bold text-[#0F172A]">
                {ticketModalType}
              </span>
              <button
                type="button"
                onClick={() => setTicketModalType(null)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              {ticketModalType === "Account Erasure" && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#F59E0B]" />
                  <span>
                    <strong>Statutory Medical Retention Notice:</strong> Clinical
                    treatment notes &amp; OPG radiographs must be retained for{" "}
                    <strong>7 years</strong> under ICMR / Clinical Establishment
                    regulations. Marketing &amp; non-statutory records will be
                    erased within 72 hours.
                  </span>
                </div>
              )}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Request Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTicketModalType(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Submit to DPO
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
