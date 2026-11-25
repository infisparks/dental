"use client";

import React from "react";
import {
  X,
  CheckCircle2,
  Printer,
  MessageSquare,
  Mail,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import type {
  Branch,
  DeliveryLogEvent,
  Patient,
  PrescriptionRecord,
} from "@/types/dentai";

interface FinalizeInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  branch: Branch;
  prescription?: PrescriptionRecord;
  deliveryEvent: DeliveryLogEvent | null;
}

export function FinalizeInvoiceModal({
  open,
  onClose,
  patient,
  branch,
  prescription,
  deliveryEvent,
}: FinalizeInvoiceModalProps) {
  if (!open) return null;

  const items =
    patient.treatmentPlan.length > 0
      ? patient.treatmentPlan
      : [
          {
            id: "default",
            toothNumber: 36,
            procedure: patient.activeTreatment,
            cost: patient.outstandingBalance || 100000,
            status: "Completed" as const,
          },
        ];

  const total = items.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-2xl h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <div className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Visit Completed &amp; Auto-Delivery Triggered
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">
              Tax Invoice &amp; Digital Prescription Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Auto-Delivery Confirmation Strip */}
        <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-[#10B981]">
            Automated Dispatch Sent ({deliveryEvent?.timestamp ?? "Now"}):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#10B981] border border-emerald-200 font-medium">
              <MessageSquare className="h-3 w-3" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#2563EB] border border-blue-200 font-medium">
              <Mail className="h-3 w-3" />
              Email
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#4F46E5] border border-indigo-200 font-medium">
              <Smartphone className="h-3 w-3" />
              PWA Vault
            </span>
          </div>
        </div>

        {/* PDF Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB]">
                <Sparkles className="h-4 w-4" />
                DentAI Pro — Dr. Bajaj Dental Network
              </div>
              <div className="text-xs font-semibold text-[#0F172A] mt-1">
                {branch.name} ({branch.code})
              </div>
              <div className="text-[11px] text-slate-500">{branch.address}</div>
              <div className="text-[11px] text-slate-500">
                GSTIN: 27AABCD1234E1Z5 • {branch.phone}
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs font-bold text-[#0F172A]">
                INV-2026-{(deliveryEvent?.id ?? patient.id).slice(-4).toUpperCase()}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: 25 Nov 2026
              </div>
              <div className="text-[11px] text-slate-500">
                Doctor: {branch.leadDentist}
              </div>
            </div>
          </div>

          {/* Patient Block */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400">Patient: </span>
              <span className="font-semibold text-[#0F172A]">
                {patient.name}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Phone: </span>
              <span className="text-slate-700">{patient.phone}</span>
            </div>
            <div>
              <span className="text-slate-400">Allergies: </span>
              <span className="text-[#F43F5E] font-medium">
                {patient.allergies.join(", ")}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Loyalty Earned: </span>
              <span className="text-[#10B981] font-semibold">
                +300 SmilePoints
              </span>
            </div>
          </div>

          {/* Itemized Treatments */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-slate-500">
                <tr>
                  <th className="py-2 px-3">Tooth</th>
                  <th className="py-2 px-3">Clinical Procedure</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 px-3 font-mono text-[#2563EB]">
                      {it.toothNumber ? `#${it.toothNumber}` : "—"}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#0F172A]">
                      {it.procedure}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#0F172A]">
                      {formatINR(it.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#EFF6FF] border-t border-blue-200">
                <tr>
                  <td
                    colSpan={2}
                    className="py-2.5 px-3 font-bold text-[#0F172A]"
                  >
                    Total Invoice Amount (Incl. Clinical Care)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-sm text-[#2563EB]">
                    {formatINR(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Prescription Summary */}
          {prescription && (
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2 text-xs">
              <div className="font-semibold text-[#4F46E5]">
                Digital Prescription &amp; D2C Home-Care Kit
              </div>
              <ul className="space-y-1 text-slate-700 list-disc pl-4">
                {prescription.medicines.map((m, i) => (
                  <li key={i}>
                    <strong>{m.name}</strong> — {m.dosage} ({m.duration})
                  </li>
                ))}
              </ul>
              <div className="text-[11px] text-slate-600 pt-1">
                <strong>D2C Self-Care Kit:</strong>{" "}
                {prescription.d2cSelfCareKit.join(" • ")}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2">
          <button
            onClick={() =>
              toast.success("PDF Prepared for Print / Download", {
                description: `Invoice & Rx for ${patient.name} ready.`,
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-medium text-[#0F172A] cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
