"use client";

import React, { useState } from "react";
import {
  Share2,
  CheckCircle2,
  FileImage,
  X,
  Plus,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { Branch, Patient, SpecialistReferral } from "@/types/dentai";

const SPECIALISTS_BY_TYPE: Record<
  SpecialistReferral["specialty"],
  Array<{ name: string; branch: string }>
> = {
  Endodontist: [
    {
      name: "Dr. Meera Deshmukh (MDS Endo)",
      branch: "DentAI Pro — Bandra West",
    },
    {
      name: "Dr. Arjun Rao (MDS Microscope Endo)",
      branch: "DentAI Pro — Powai",
    },
  ],
  "Oral Surgeon": [
    {
      name: "Dr. Vikramaditya Sen (MDS OMFS)",
      branch: "DentAI Pro — Lower Parel Surgical Hub",
    },
    {
      name: "Dr. Kabir Malhotra (MDS Implantology)",
      branch: "DentAI Pro — Connaught Place",
    },
  ],
  Orthodontist: [
    {
      name: "Dr. Sneha Joshi (MDS Ortho)",
      branch: "DentAI Pro — Koregaon Park",
    },
    {
      name: "Dr. Ananya Iyer (MDS Aligners)",
      branch: "DentAI Pro — Indiranagar",
    },
  ],
};

interface ReferComplexCaseModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  branch: Branch;
}

export function ReferComplexCaseModal({
  open,
  onClose,
  patient,
  branch,
}: ReferComplexCaseModalProps) {
  const { createReferral } = useDentAi();
  const [specialty, setSpecialty] =
    useState<SpecialistReferral["specialty"]>("Endodontist");
  const [specialistIdx, setSpecialistIdx] = useState(0);
  const [xrayAttached, setXrayAttached] = useState(true);
  const [estimatedValue, setEstimatedValue] = useState(
    patient.outstandingBalance || 100000
  );
  const [caseNotes, setCaseNotes] = useState(
    `Complex clinical presentation requiring specialist ${specialty} evaluation for ${patient.name}.`
  );

  if (!open) return null;

  const choices = SPECIALISTS_BY_TYPE[specialty];
  const chosen = choices[specialistIdx] ?? choices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReferral({
      patientId: patient.id,
      fromBranch: branch.name,
      fromDoctor: branch.leadDentist,
      specialty,
      targetSpecialist: chosen.name,
      targetBranch: chosen.branch,
      caseNotes,
      xrayAttached,
      estimatedValue,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] w-full max-w-md h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#2563EB]">
              Doctor-to-Doctor Specialist Network
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">
              Refer Complex Case — {patient.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Specialty *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Endodontist", "Oral Surgeon", "Orthodontist"] as const).map(
                (sp) => (
                  <button
                    type="button"
                    key={sp}
                    onClick={() => {
                      setSpecialty(sp);
                      setSpecialistIdx(0);
                    }}
                    className={cn(
                      "py-2 px-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                      specialty === sp
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0]"
                    )}
                  >
                    {sp}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Network Specialist *
            </label>
            <select
              value={specialistIdx}
              onChange={(e) => setSpecialistIdx(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
            >
              {choices.map((c, idx) => (
                <option key={c.name} value={idx}>
                  {c.name} — {c.branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estimated Treatment Value (₹)
            </label>
            <input
              type="number"
              min={1000}
              step={500}
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Clinical Case Notes *
            </label>
            <textarea
              rows={3}
              required
              value={caseNotes}
              onChange={(e) => setCaseNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
            <input
              type="checkbox"
              checked={xrayAttached}
              onChange={(e) => setXrayAttached(e.target.checked)}
              className="accent-[#2563EB]"
            />
            <FileImage className="h-4 w-4 text-[#4F46E5]" />
            <span className="text-xs font-medium text-[#0F172A]">
              Attach OPG / CBCT Radiographs &amp; DentAI Vision Report
            </span>
          </label>
        </div>

        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
          >
            Submit Referral (15% Share)
          </button>
        </div>
      </form>
    </div>
  );
}

const REF_STEPS: SpecialistReferral["status"][] = [
  "Referred",
  "Accepted",
  "Consultation Done",
  "Completed",
];

export function ReferralsTrackerTab({ branch }: { branch: Branch }) {
  const { patients, referrals, advanceReferralStatus } = useDentAi();
  const [modalOpen, setModalOpen] = useState(false);

  const totalShare = referrals.reduce(
    (sum, r) => sum + Math.round((r.estimatedValue * r.referralSharePercent) / 100),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Network Referrals</span>
            <Share2 className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {referrals.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Endo • OMFS • Ortho Specialists
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Referral Revenue Share</span>
            <IndianRupee className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#10B981]">
            {formatINR(totalShare)}
          </div>
          <div className="mt-1 text-[11px] text-[#10B981] font-medium">
            12–15% Automated Branch Credit
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-xs text-slate-500">
            Escalate Complex Clinical Case
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Specialist Referral
          </button>
        </div>
      </div>

      {/* Referrals Tracker Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Doctor-to-Doctor Referrals Tracker
          </h2>
          <p className="text-xs text-slate-500">
            Case-wise progression across Referred → Accepted → Consultation Done
            → Completed
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Ref # &amp; Patient</th>
                <th className="py-2.5 px-3">Specialty &amp; Specialist</th>
                <th className="py-2.5 px-3">Progression</th>
                <th className="py-2.5 px-3 text-right">Case Value</th>
                <th className="py-2.5 px-3 text-right">Ref Share</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {referrals.map((ref) => {
                const idx = REF_STEPS.indexOf(ref.status);
                const shareAmt = Math.round(
                  (ref.estimatedValue * ref.referralSharePercent) / 100
                );
                return (
                  <tr key={ref.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-mono font-semibold text-[#2563EB]">
                        {ref.referralCode}
                      </div>
                      <div className="font-semibold text-[#0F172A]">
                        {ref.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ref.xrayAttached ? "OPG/CBCT Attached" : "Notes Only"}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                        {ref.specialty}
                      </span>
                      <div className="font-medium text-[#0F172A] mt-1">
                        {ref.targetSpecialist}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ref.targetBranch}
                      </div>
                    </td>
                    <td className="py-3 px-3 min-w-[270px]">
                      <div className="flex flex-wrap items-center gap-1">
                        {REF_STEPS.map((st, sIdx) => {
                          const done = sIdx <= idx;
                          const curr = sIdx === idx;
                          return (
                            <span
                              key={st}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                ref.status === "Completed" && done
                                  ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                                  : curr
                                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                                  : done
                                  ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              )}
                            >
                              {st}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#0F172A]">
                      {formatINR(ref.estimatedValue)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#10B981]">
                      {formatINR(shareAmt)} ({ref.referralSharePercent}%)
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ref.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Settled
                        </span>
                      ) : (
                        <button
                          onClick={() => advanceReferralStatus(ref.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                        >
                          Advance
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ReferComplexCaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={patients[0]}
        branch={branch}
      />
    </div>
  );
}
