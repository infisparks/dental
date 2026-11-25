"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { ScheduleCalendarTab } from "@/components/clinic/ScheduleCalendarTab";
import { PatientEdrWorkspace } from "@/components/clinic/PatientEdrWorkspace";
import { ReferralsTrackerTab } from "@/components/clinic/ReferralsTrackerTab";
import { SupplyChainModule } from "@/components/shared/SupplyChainModule";

const CLINIC_META = {
  schedule: {
    title: "Appointment Calendar & Slots",
    subtitle: "Manage day/week chair bookings, check-ins, and rescheduling",
  },
  edr: {
    title: "Patient Record (EDR) & AI Doctor",
    subtitle: "Interactive tooth chart, AI X-ray screening, Voice-to-Rx & billing",
  },
  referrals: {
    title: "Specialist Referral Network",
    subtitle: "Refer complex cases to MDS specialists and track revenue share",
  },
  supply: {
    title: "Clinic Stock & B2B Orders",
    subtitle: "Daily consumables ledger, expiry alerts & 1-click HQ reorders",
  },
} as const;

export default function ClinicErpPage() {
  const { branches, patients, clinicTab, setClinicTab } = useDentAi();

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) ?? branches[0];
  const meta = CLINIC_META[clinicTab];

  const handleOpenPatientEdr = (patientId: string) => {
    setSelectedPatientId(patientId);
    setClinicTab("edr");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{meta.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {selectedBranch.leadDentist} • {meta.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-semibold">
            <Sparkles className="h-4 w-4" />
            AI Co-Pilot Active
          </span>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          >
            {branches.slice(0, 12).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={clinicTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
        >
          {clinicTab === "schedule" && (
            <ScheduleCalendarTab
              branchId={selectedBranchId}
              onOpenPatientEdr={handleOpenPatientEdr}
            />
          )}
          {clinicTab === "edr" && (
            <PatientEdrWorkspace
              branch={selectedBranch}
              selectedPatientId={selectedPatientId}
              onSelectPatient={setSelectedPatientId}
            />
          )}
          {clinicTab === "referrals" && (
            <ReferralsTrackerTab branch={selectedBranch} />
          )}
          {clinicTab === "supply" && (
            <SupplyChainModule role="clinic" branchId={selectedBranchId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
